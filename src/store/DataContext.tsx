// App-wide data: the child, observations and journal, with actions that save through the repo.

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { catalog } from '../catalog';
import { todayIso } from '../domain/age';
import type { Child, JournalEntry, Locale, Observation, ObservationStatus } from '../domain/types';
import { LocalRepo } from './localRepo';
import { newId, type Repo, type Snapshot } from './repo';

export interface LogInput {
  skillId: string;
  status: ObservationStatus;
  observedOn?: string;
  languages?: Locale[];
  note?: string;
  approximate?: boolean;
}

interface DataValue {
  repo: Repo;
  loading: boolean;
  error: string | null;
  readOnly: boolean;
  child: Child | null;
  observations: Observation[];
  journal: JournalEntry[];
  saveChild(child: Omit<Child, 'id'> & { id?: string }): Promise<void>;
  log(entries: LogInput[]): Promise<void>;
  /** Create (or keep) the child and add a batch of past observations in one go. */
  createWithHistory(child: Omit<Child, 'id'>, entries: LogInput[]): Promise<void>;
  deleteObservation(id: string): Promise<void>;
  saveJournal(entry: Omit<JournalEntry, 'id' | 'childId' | 'createdAt'> & { id?: string }): Promise<void>;
  deleteJournal(id: string): Promise<void>;
  replaceAll(snapshot: Snapshot): Promise<void>;
  deleteAll(): Promise<void>;
}

const Ctx = createContext<DataValue | null>(null);

function toObservations(childId: string, entries: LogInput[]): Observation[] {
  const now = new Date().toISOString();
  return entries.map((e) => ({
    id: newId(),
    childId,
    skillId: e.skillId,
    status: e.status,
    observedOn: e.observedOn ?? todayIso(),
    languages: e.languages,
    note: e.note,
    approximate: e.approximate,
    catalogVersion: catalog.version,
    createdAt: now,
  }));
}

export function DataProvider({ repo, initial, readOnly = false, children }: { repo?: Repo; initial?: Snapshot; readOnly?: boolean; children: ReactNode }) {
  const [theRepo] = useState<Repo>(() => repo ?? new LocalRepo());
  const [snap, setSnap] = useState<Snapshot>(initial ?? { child: null, observations: [], journal: [] });
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) return;
    theRepo
      .load()
      .then(setSnap)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [theRepo, initial]);

  const guard = useCallback(
    async (fn: () => Promise<void>) => {
      if (readOnly) return;
      try {
        await fn();
      } catch (e) {
        setError((e as Error).message);
        throw e;
      }
    },
    [readOnly],
  );

  const value = useMemo<DataValue>(
    () => ({
      repo: theRepo,
      loading,
      error,
      readOnly,
      child: snap.child,
      observations: snap.observations,
      journal: snap.journal,
      saveChild: (c) =>
        guard(async () => {
          const child: Child = { ...c, id: c.id ?? snap.child?.id ?? newId() };
          await theRepo.saveChild(child);
          setSnap((s) => ({ ...s, child }));
        }),
      log: (entries) =>
        guard(async () => {
          if (!snap.child) return;
          const obs = toObservations(snap.child.id, entries);
          await theRepo.addObservations(obs);
          setSnap((s) => ({ ...s, observations: [...s.observations, ...obs] }));
        }),
      createWithHistory: (c, entries) =>
        guard(async () => {
          const child: Child = snap.child ?? { ...c, id: newId() };
          if (!snap.child) await theRepo.saveChild(child);
          const have = new Set(snap.observations.map((o) => o.skillId));
          const obs = toObservations(child.id, entries.filter((e) => !have.has(e.skillId)));
          await theRepo.addObservations(obs);
          setSnap((s) => ({ ...s, child, observations: [...s.observations, ...obs] }));
        }),
      deleteObservation: (id) =>
        guard(async () => {
          await theRepo.deleteObservation(id);
          setSnap((s) => ({ ...s, observations: s.observations.filter((o) => o.id !== id) }));
        }),
      saveJournal: (e) =>
        guard(async () => {
          if (!snap.child) return;
          const existing = e.id ? snap.journal.find((j) => j.id === e.id) : undefined;
          const entry: JournalEntry = {
            ...e,
            id: e.id ?? newId(),
            childId: snap.child.id,
            createdAt: existing?.createdAt ?? new Date().toISOString(),
          };
          await theRepo.saveJournal(entry);
          setSnap((s) => ({ ...s, journal: [...s.journal.filter((j) => j.id !== entry.id), entry] }));
        }),
      deleteJournal: (id) =>
        guard(async () => {
          await theRepo.deleteJournal(id);
          setSnap((s) => ({ ...s, journal: s.journal.filter((j) => j.id !== id) }));
        }),
      replaceAll: (snapshot) =>
        guard(async () => {
          await theRepo.replaceAll(snapshot);
          setSnap(await theRepo.load());
        }),
      deleteAll: () =>
        guard(async () => {
          await theRepo.deleteAll();
          setSnap({ child: null, observations: [], journal: [] });
        }),
    }),
    [theRepo, loading, error, readOnly, snap, guard],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useData(): DataValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useData outside DataProvider');
  return v;
}
