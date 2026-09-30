// Browser storage: the whole family snapshot is one record in IndexedDB.
// IndexedDB (unlike localStorage) has room for photos.

import type { Child, JournalEntry, Observation } from '../domain/types';
import { emptySnapshot, type Repo, type Snapshot } from './repo';

const DB = 'constance-tracker';
const STORE = 'kv';
const KEY = 'snapshot-v1';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function get<T>(key: string): Promise<T | undefined> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE).objectStore(STORE).get(key);
    req.onsuccess = () => resolve(req.result as T | undefined);
    req.onerror = () => reject(req.error);
  });
}

async function put(key: string, value: unknown): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export class LocalRepo implements Repo {
  readonly mode = 'local' as const;
  private cache: Snapshot | null = null;

  async load(): Promise<Snapshot> {
    this.cache = (await get<Snapshot>(KEY)) ?? emptySnapshot();
    return structuredClone(this.cache);
  }

  private async update(fn: (s: Snapshot) => void): Promise<void> {
    const s = this.cache ?? (await this.load());
    fn(s);
    this.cache = s;
    await put(KEY, s);
  }

  saveChild(child: Child) {
    return this.update((s) => void (s.child = child));
  }
  addObservations(obs: Observation[]) {
    return this.update((s) => void s.observations.push(...obs));
  }
  deleteObservation(id: string) {
    return this.update((s) => void (s.observations = s.observations.filter((o) => o.id !== id)));
  }
  saveJournal(entry: JournalEntry) {
    return this.update((s) => {
      s.journal = s.journal.filter((j) => j.id !== entry.id);
      s.journal.push(entry);
    });
  }
  deleteJournal(id: string) {
    return this.update((s) => void (s.journal = s.journal.filter((j) => j.id !== id)));
  }
  async photoUrl(ref: string) {
    return ref; // photos are stored inline as data URLs
  }
  async storePhoto(dataUrl: string) {
    return dataUrl;
  }
  replaceAll(snapshot: Snapshot) {
    return this.update((s) => Object.assign(s, structuredClone(snapshot)));
  }
  deleteAll() {
    return this.update((s) => Object.assign(s, emptySnapshot()));
  }
}
