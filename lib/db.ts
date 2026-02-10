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
    paymentKey: "", // API Key for Paymenku
    price: 0
  }
};

// Helper to ensure DB file exists
async function ensureDb() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2));
  }
}

// Read DB
export async function getDb(): Promise<Database> {
  await ensureDb();
  const data = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

// Write DB
async function saveDb(db: Database) {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
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
