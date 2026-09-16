/**
 * Minimal promise wrapper around IndexedDB for the studio kv store.
 * No dependencies, fail-closed helpers.
 */
const DB_NAME = "alusna-studio";
const DB_VERSION = 1;
const STORE_NAME = "kv";

export const STUDIO_IDB_KEY = "state";

let dbPromise: Promise<IDBDatabase> | null = null;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB open failed"));
    request.onblocked = () => reject(new Error("IndexedDB open blocked"));
  });
}

function getDatabase(): Promise<IDBDatabase> {
  if (!dbPromise)
    dbPromise = openDatabase().catch((error) => {
      dbPromise = null;
      throw error;
    });
  return dbPromise;
}

function runTransaction<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return getDatabase().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, mode);
        const request = run(tx.objectStore(STORE_NAME));
        tx.onabort = () => reject(tx.error ?? new Error("IndexedDB transaction aborted"));
        tx.onerror = () => reject(tx.error ?? new Error("IndexedDB transaction failed"));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed"));
      }),
  );
}

export function idbGet(key: string): Promise<string | null> {
  return runTransaction<string | null>(
    "readonly",
    (store) => store.get(key) as IDBRequest<string | null>,
  ).then((value) => value ?? null);
}

export function idbSet(key: string, value: string): Promise<void> {
  return runTransaction("readwrite", (store) => store.put(value, key)).then(() => undefined);
}

export function idbDel(key: string): Promise<void> {
  return runTransaction("readwrite", (store) => store.delete(key)).then(() => undefined);
}
