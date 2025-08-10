// Persistent dataset storage using IndexedDB
// Stores uploaded ZIP blobs or a lightweight VFS snapshot, plus metadata

/* eslint-disable no-console */

const DB_NAME = 'peeksta';
const DB_VERSION = 1;
const STORE = 'datasets';

function openDb() {
  return new Promise((resolve, reject) => {
    try {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          const store = db.createObjectStore(STORE, { keyPath: 'id' });
          store.createIndex('createdAt', 'createdAt', { unique: false });
          store.createIndex('lastUsedAt', 'lastUsedAt', { unique: false });
          store.createIndex('name', 'name', { unique: false });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    } catch (err) {
      reject(err);
    }
  });
}

function txStore(db, mode = 'readonly') {
  const tx = db.transaction(STORE, mode);
  return tx.objectStore(STORE);
}

export function generateDatasetId() {
  const rnd = Math.random().toString(36).slice(2, 8);
  return `ds_${Date.now()}_${rnd}`;
}

export async function addDataset(dataset) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const store = txStore(db, 'readwrite');
    const req = store.add(dataset);
    req.onsuccess = () => resolve(dataset.id);
    req.onerror = () => reject(req.error);
  });
}

export async function listDatasets() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const store = txStore(db, 'readonly');
    const req = store.getAll();
    req.onsuccess = () => {
      const items = Array.isArray(req.result) ? req.result : [];
      // Sort by lastUsedAt desc then createdAt desc
      items.sort((a, b) => (b.lastUsedAt || 0) - (a.lastUsedAt || 0) || b.createdAt - a.createdAt);
      resolve(items);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function getDataset(id) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const store = txStore(db, 'readonly');
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteDataset(id) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const store = txStore(db, 'readwrite');
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function renameDataset(id, newName) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const store = txStore(db, 'readwrite');
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const obj = getReq.result;
      if (!obj) return resolve(false);
      obj.name = newName;
      const putReq = store.put(obj);
      putReq.onsuccess = () => resolve(true);
      putReq.onerror = () => reject(putReq.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

export async function touchDataset(id, when = Date.now()) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const store = txStore(db, 'readwrite');
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const obj = getReq.result;
      if (!obj) return resolve(false);
      obj.lastUsedAt = when;
      const putReq = store.put(obj);
      putReq.onsuccess = () => resolve(true);
      putReq.onerror = () => reject(putReq.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

export async function clearAllDatasets() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const store = txStore(db, 'readwrite');
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// Helpers to build dataset objects
export function buildZipDataset({ id, name, fileName, blob, meta = {} }) {
  return {
    id,
    name,
    type: 'zip',
    fileName,
    size: blob?.size || 0,
    createdAt: Date.now(),
    lastUsedAt: null,
    blob,
    ...meta,
  };
}

export function buildVfsDataset({ id, name, snapshot, meta = {} }) {
  // snapshot: Array<[path, text]> to reconstruct Map
  const sizeEstimate = new Blob(snapshot.map(([, t]) => t)).size; // rough estimate
  return {
    id,
    name,
    type: 'vfs',
    size: sizeEstimate,
    createdAt: Date.now(),
    lastUsedAt: null,
    vfs: snapshot,
    ...meta,
  };
}

// Cache analysis into an existing dataset (by id)
export async function cacheAnalysis(id, analysis) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const store = txStore(db, 'readwrite');
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const obj = getReq.result;
      if (!obj) return resolve(false);
      obj.analysis = analysis;
      const putReq = store.put(obj);
      putReq.onsuccess = () => resolve(true);
      putReq.onerror = () => reject(putReq.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}


