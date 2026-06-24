import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

export interface StudentAccount {
  id: string;
  name: string;
  email: string;
  classLevel: string;
  section: string;
  passwordHash: string;
  salt: string;
  createdAt: number;
}

interface StudentDB extends DBSchema {
  students: {
    key: string;
    value: StudentAccount;
    indexes: { 'by-email': string };
  };
}

const DB_NAME = 'VirtualLabStudents';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<StudentDB>> | null = null;

const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<StudentDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('students')) {
          const store = db.createObjectStore('students', { keyPath: 'id' });
          store.createIndex('by-email', 'email');
        }
      },
    });
  }
  return dbPromise;
};

// --- Password hashing helpers ---

function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToArrayBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes.buffer;
}

async function hashPassword(password: string, saltHex: string): Promise<string> {
  const encoder = new TextEncoder();
  const saltBuffer = hexToArrayBuffer(saltHex);
  const passwordBuffer = encoder.encode(password);

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  return arrayBufferToHex(derivedBits);
}

function generateSalt(): string {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return arrayBufferToHex(salt.buffer);
}

function generateId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return arrayBufferToHex(bytes.buffer);
}

// --- Public API ---

export const studentService = {
  async register(
    name: string,
    email: string,
    classLevel: string,
    section: string,
    password: string
  ): Promise<StudentAccount> {
    const db = await getDB();

    // Check if email already exists
    const existing = await db.getAllFromIndex('students', 'by-email', email.toLowerCase());
    if (existing.length > 0) {
      throw new Error('An account with this email already exists');
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(password, salt);

    const account: StudentAccount = {
      id: generateId(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      classLevel,
      section: section.trim(),
      passwordHash,
      salt,
      createdAt: Date.now(),
    };

    await db.add('students', account);
    return account;
  },

  async login(email: string, password: string): Promise<StudentAccount> {
    const db = await getDB();
    const accounts = await db.getAllFromIndex('students', 'by-email', email.toLowerCase().trim());

    if (accounts.length === 0) {
      throw new Error('No account found with this email');
    }

    const account = accounts[0];
    const passwordHash = await hashPassword(password, account.salt);

    if (passwordHash !== account.passwordHash) {
      throw new Error('Incorrect password');
    }

    return account;
  },

  async getAccount(id: string): Promise<StudentAccount | null> {
    const db = await getDB();
    return (await db.get('students', id)) || null;
  },

  async updateProfile(
    id: string,
    updates: Partial<Pick<StudentAccount, 'name' | 'classLevel' | 'section'>>
  ): Promise<void> {
    const db = await getDB();
    const account = await db.get('students', id);
    if (!account) throw new Error('Account not found');

    const updated = { ...account, ...updates };
    await db.put('students', updated);
  },

  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const db = await getDB();
    const account = await db.get('students', id);
    if (!account) throw new Error('Account not found');

    const currentHash = await hashPassword(currentPassword, account.salt);
    if (currentHash !== account.passwordHash) {
      throw new Error('Current password is incorrect');
    }

    const newSalt = generateSalt();
    const newHash = await hashPassword(newPassword, newSalt);

    await db.put('students', {
      ...account,
      salt: newSalt,
      passwordHash: newHash,
    });
  },

  async deleteAccount(id: string, password: string): Promise<void> {
    const db = await getDB();
    const account = await db.get('students', id);
    if (!account) throw new Error('Account not found');

    const passwordHash = await hashPassword(password, account.salt);
    if (passwordHash !== account.passwordHash) {
      throw new Error('Incorrect password');
    }

    await db.delete('students', id);
  },
};
