import fs from 'fs/promises';
import path from 'path';
import { User, Settings } from '@/types/user';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

interface Database {
  users: User[];
  settings: Settings;
}

const DEFAULT_DB: Database = {
  users: [],
  settings: {
    paymentKey: process.env.PAYMENKU_API_KEY || "",
    price: Number(process.env.SUBSCRIPTION_PRICE) || 50000
  }
};

// In-memory store
let inMemoryDb: Database = { ...DEFAULT_DB };
let isInitialized = false;

async function initDb() {
  if (isInitialized) return;

  try {
    // Try to load from disk
    const data = await fs.readFile(DB_PATH, 'utf-8');
    inMemoryDb = JSON.parse(data);
    console.log('Database loaded from disk.');
  } catch (error) {
    console.warn('Could not load database from disk (this is expected on Vercel if file does not exist). Using in-memory store initialized with Environment Variables.');

    // If running locally, try to create the file so we can save changes
    if (!process.env.VERCEL) {
        try {
            await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
            await fs.writeFile(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2));
        } catch (e) {
            console.warn('Failed to initialize DB file:', e);
        }
    }
  }
  isInitialized = true;
}

// Get DB (Helper)
async function getDb(): Promise<Database> {
  await initDb();
  return inMemoryDb;
}

// Save DB (Helper)
async function saveDb(db: Database) {
  // Update in-memory
  inMemoryDb = db;

  // Try to persist to disk
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
  } catch (error) {
    console.warn('Failed to save database to disk (expected on Vercel). Data will be lost on restart.');
  }
}

// Settings API
export async function getSettings(): Promise<Settings> {
  const db = await getDb();
  return db.settings;
}

export async function updateSettings(newSettings: Settings) {
  const db = await getDb();
  db.settings = newSettings;
  await saveDb(db);
}

// User API
export async function getUsers(): Promise<User[]> {
  const db = await getDb();
  return db.users;
}

export async function addUser(user: User) {
  const db = await getDb();
  db.users.push(user);
  await saveDb(db);
}

export async function deleteUser(id: string) {
    const db = await getDb();
    const index = db.users.findIndex(u => u.id === id);
    if (index !== -1) {
        db.users.splice(index, 1);
        await saveDb(db);
        return true;
    }
    return false;
}

export async function updateUserPayment(id: string, status: 'paid' | 'failed', pin?: string, qrCode?: string) {
  const db = await getDb();
  const index = db.users.findIndex(u => u.id === id);
  if (index !== -1) {
    db.users[index].paymentStatus = status;
    if (pin) db.users[index].pin = pin;
    if (qrCode) db.users[index].qrCode = qrCode;
    await saveDb(db);
  }
}

export async function getUserByPin(pin: string): Promise<User | undefined> {
  const db = await getDb();
  return db.users.find(u => u.pin === pin);
}

export async function getUserById(id: string): Promise<User | undefined> {
    const db = await getDb();
    return db.users.find(u => u.id === id);
}
