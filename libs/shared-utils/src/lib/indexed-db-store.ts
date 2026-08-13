import { openDB, IDBPDatabase } from 'idb';

export interface IndexedDbStoreOptions {
  dbName: string;
  storeName: string;
  version?: number;
  keyPath: string;
}

export interface IndexedDbStore<T> {
  get(key: string): Promise<T | undefined>;
  getAll(): Promise<T[]>;
  put(value: T): Promise<void>;
  delete(key: string): Promise<void>;
}

export function createIndexedDbStore<T>(options: IndexedDbStoreOptions): IndexedDbStore<T> {
  let dbPromise: Promise<IDBPDatabase> | null = null;

  function getDb(): Promise<IDBPDatabase> {
    if (typeof indexedDB === 'undefined') {
      return Promise.reject(new Error('IndexedDB is not available in this environment'));
    }
    if (!dbPromise) {
      dbPromise = openDB(options.dbName, options.version ?? 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(options.storeName)) {
            db.createObjectStore(options.storeName, { keyPath: options.keyPath });
          }
        },
      });
    }
    return dbPromise;
  }

  return {
    async get(key) {
      const db = await getDb();
      return db.get(options.storeName, key);
    },
    async getAll() {
      const db = await getDb();
      return db.getAll(options.storeName);
    },
    async put(value) {
      const db = await getDb();
      await db.put(options.storeName, value);
    },
    async delete(key) {
      const db = await getDb();
      await db.delete(options.storeName, key);
    },
  };
}
