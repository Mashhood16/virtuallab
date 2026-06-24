import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

export interface DataPoint {
  key: string;
  value: string | number;
  timestamp?: number;
}

export interface ProgressRecord {
  id?: number;
  userId: string;
  experimentId: string;
  startTime: number;
  completionTime: number | null;
  score: number | null;
  synced: number; // 0 for false, 1 for true
  dataPoints?: DataPoint[]; // Store recorded experimental data
}

interface VirtualLabDB extends DBSchema {
  progress: {
    key: number;
    value: ProgressRecord;
    indexes: {
      'by-experiment': string;
      'by-sync-status': number;
      'by-user': string;
    };
  };
}

const DB_NAME = 'VirtualLabDB';
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase<VirtualLabDB>> | null = null;

export const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<VirtualLabDB>(DB_NAME, DB_VERSION, {
      async upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          if (!db.objectStoreNames.contains('progress')) {
            const store = db.createObjectStore('progress', {
              keyPath: 'id',
              autoIncrement: true,
            });
            store.createIndex('by-experiment', 'experimentId');
            store.createIndex('by-sync-status', 'synced');
          }
        }
        if (oldVersion < 2) {
          // Add userId index for per-user queries
          const tx = db.transaction('progress', 'readwrite');
          const store = tx.objectStore('progress');
          if (!store.indexNames.contains('by-user')) {
            // @ts-expect-error - createIndex exists on native IDBObjectStore but idb's typed store doesn't expose it
            store.createIndex('by-user', 'userId');
          }
          await tx.done;
        }
      },
    });
  }
  return dbPromise;
};

export const progressDB = {
  async addRecord(record: Omit<ProgressRecord, 'id'>) {
    const db = await initDB();
    return db.add('progress', record as ProgressRecord);
  },
  
  async updateRecord(record: ProgressRecord) {
    const db = await initDB();
    return db.put('progress', record);
  },
  
  async getRecordByExperiment(experimentId: string, userId?: string) {
    const db = await initDB();
    if (userId) {
      // Get all records for this experiment + user
      const allRecords = await db.getAll('progress');
      const filtered = allRecords.filter(r => r.experimentId === experimentId && r.userId === userId);
      return filtered.length ? filtered[filtered.length - 1] : null;
    }
    const records = await db.getAllFromIndex('progress', 'by-experiment', experimentId);
    return records.length ? records[records.length - 1] : null;
  },
  
  async getAllRecords(userId?: string) {
    const db = await initDB();
    if (userId) {
      return db.getAllFromIndex('progress', 'by-user', userId);
    }
    return db.getAll('progress');
  },
  
  async getUnsyncedRecords(userId?: string) {
    const db = await initDB();
    if (userId) {
      const all = await db.getAllFromIndex('progress', 'by-user', userId);
      return all.filter(r => r.synced === 0);
    }
    return db.getAllFromIndex('progress', 'by-sync-status', 0);
  },
  
  async markAsSynced(id: number) {
    const db = await initDB();
    const record = await db.get('progress', id);
    if (record) {
      record.synced = 1;
      await db.put('progress', record);
    }
  }
};
