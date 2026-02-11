import { kv } from '@vercel/kv';
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

// Master User logic (Always exists)
const MASTER_USER_PIN = process.env.MASTER_USER_PIN; // e.g. "88888"
const MASTER_USER: User | null = MASTER_USER_PIN ? {
    id: 'MASTER-USER',
    name: 'Demo Admin User',
    email: 'admin@demo.com',
    pin: MASTER_USER_PIN,
    paymentStatus: 'paid',
    qrCode: '',
    qrUrl: '',
    createdAt: new Date().toISOString()
} : null;

// In-memory store
let inMemoryDb: Database = { ...DEFAULT_DB };
let isInitialized = false;

// Check if KV is configured
const hasKv = !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;

async function initDb() {
  if (isInitialized) return;

  if (hasKv) {
      try {
          const storedDb = await kv.get<Database>('app_db');
          if (storedDb) {
              inMemoryDb = storedDb;
              console.log('Database loaded from Vercel KV.');
          } else {
              console.log('Vercel KV empty, using defaults.');
              await kv.set('app_db', DEFAULT_DB);
          }
      } catch (e) {
          console.error('Failed to load from Vercel KV:', e);
      }
  } else {
      try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        inMemoryDb = JSON.parse(data);
        console.log(`Database loaded from disk. Users: ${inMemoryDb.users.length}`);
      } catch (error) {
        console.warn('Could not load database from disk. Using in-memory store.');
      }
  }

  // Ensure Master User exists if configured
  if (MASTER_USER) {
      const exists = inMemoryDb.users.find(u => u.pin === MASTER_USER.pin);
      if (!exists) {
          console.log('Injecting Master User');
          inMemoryDb.users.push(MASTER_USER);
      }
  }

  isInitialized = true;
}

// Get DB
async function getDb(): Promise<Database> {
  await initDb();
  return inMemoryDb;
}

// Save DB
async function saveDb(db: Database) {
  // Update in-memory
  inMemoryDb = db;

  if (hasKv) {
      try {
          await kv.set('app_db', db);
          console.log('Saved to Vercel KV');
      } catch (e) {
          console.error('Failed to save to Vercel KV:', e);
      }
  } else {
      // Try to persist to disk (local dev)
      if (!process.env.VERCEL) {
          try {
            await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
            await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
          } catch (error) {
            console.warn('Failed to save database to disk.');
          }
      }
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
  console.log(`Adding user: ${user.name} (${user.id})`);
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
