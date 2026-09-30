// Storage behind one small interface. Two implementations:
// - LocalRepo: IndexedDB in this browser (default, works offline, no account needed)
// - SupabaseRepo: shared online database for the family (when VITE_SUPABASE_URL is set)

import type { Child, JournalEntry, Observation } from '../domain/types';

export interface Snapshot {
  child: Child | null;
  observations: Observation[];
  journal: JournalEntry[];
}

export interface Repo {
  readonly mode: 'local' | 'cloud';
  load(): Promise<Snapshot>;
  saveChild(child: Child): Promise<void>;
  addObservations(obs: Observation[]): Promise<void>;
  deleteObservation(id: string): Promise<void>;
  saveJournal(entry: JournalEntry): Promise<void>;
  deleteJournal(id: string): Promise<void>;
  /** Resolve a stored photo reference into something an <img> can show. */
  photoUrl(ref: string): Promise<string>;
  /** Store a photo (data URL) and return its reference. */
  storePhoto(dataUrl: string, childId: string): Promise<string>;
  replaceAll(snapshot: Snapshot): Promise<void>;
  deleteAll(): Promise<void>;
}

export const emptySnapshot = (): Snapshot => ({ child: null, observations: [], journal: [] });

export function newId(): string {
  return crypto.randomUUID();
}
