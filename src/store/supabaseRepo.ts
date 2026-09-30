// Shared family storage in Supabase (see supabase/schema.sql). Enabled when
// VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set at build time.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Child, JournalEntry, Locale, Observation } from '../domain/types';
import { newId, type Repo, type Snapshot } from './repo';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null = url && key ? createClient(url, key, { auth: { flowType: 'pkce', persistSession: true } }) : null;

type Row = Record<string, unknown>;

const toChild = (r: Row): Child => ({
  id: r.id as string,
  firstName: r.first_name as string,
  birthDate: r.birth_date as string,
  gestationalWeeks: (r.gestational_weeks as number | null) ?? null,
  homeLanguages: (r.home_languages as Locale[]) ?? [],
  seedVersion: (r.seed_version as number | null) ?? 1,
});
const toObservation = (r: Row): Observation => ({
  id: r.id as string,
  childId: r.child_id as string,
  skillId: r.skill_id as string,
  status: r.status as Observation['status'],
  observedOn: r.observed_on as string,
  languages: (r.languages as Locale[] | null) ?? undefined,
  note: (r.note as string | null) ?? undefined,
  approximate: r.approximate as boolean,
  catalogVersion: (r.catalog_version as string | null) ?? undefined,
  createdAt: r.created_at as string,
});
const fromObservation = (o: Observation): Row => ({
  id: o.id,
  child_id: o.childId,
  skill_id: o.skillId,
  status: o.status,
  observed_on: o.observedOn,
  languages: o.languages ?? null,
  note: o.note ?? null,
  approximate: !!o.approximate,
  catalog_version: o.catalogVersion ?? null,
  created_at: o.createdAt,
});
const toJournal = (r: Row): JournalEntry => ({
  id: r.id as string,
  childId: r.child_id as string,
  date: r.date as string,
  text: r.text as string,
  photo: (r.photo_path as string | null) ?? undefined,
  skillIds: (r.skill_ids as string[]) ?? [],
  createdAt: r.created_at as string,
});

function check<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data;
}

export class SupabaseRepo implements Repo {
  readonly mode = 'cloud' as const;
  familyId: string | null = null;
  constructor(private db: SupabaseClient) {}

  async load(): Promise<Snapshot> {
    this.familyId = check(await this.db.rpc('bootstrap')) as string;
    const children = check(await this.db.from('child').select('*').eq('family_id', this.familyId).limit(1)) as Row[];
    const child = children[0] ? toChild(children[0]) : null;
    if (!child) return { child: null, observations: [], journal: [] };
    const obs = check(await this.db.from('observation').select('*').eq('child_id', child.id)) as Row[];
    const jr = check(await this.db.from('journal_entry').select('*').eq('child_id', child.id)) as Row[];
    return { child, observations: obs.map(toObservation), journal: jr.map(toJournal) };
  }

  async saveChild(c: Child) {
    check(
      await this.db.from('child').upsert({
        id: c.id,
        family_id: this.familyId,
        first_name: c.firstName,
        birth_date: c.birthDate,
        gestational_weeks: c.gestationalWeeks ?? null,
        home_languages: c.homeLanguages,
        seed_version: c.seedVersion ?? 1,
      }),
    );
  }
  async addObservations(obs: Observation[]) {
    for (let i = 0; i < obs.length; i += 500) check(await this.db.from('observation').insert(obs.slice(i, i + 500).map(fromObservation)));
  }
  async deleteObservation(id: string) {
    check(await this.db.from('observation').delete().eq('id', id));
  }
  async saveJournal(e: JournalEntry) {
    check(
      await this.db.from('journal_entry').upsert({
        id: e.id,
        child_id: e.childId,
        date: e.date,
        text: e.text,
        photo_path: e.photo ?? null,
        skill_ids: e.skillIds,
        created_at: e.createdAt,
      }),
    );
  }
  async deleteJournal(id: string) {
    check(await this.db.from('journal_entry').delete().eq('id', id));
  }
  async storePhoto(dataUrl: string) {
    const blob = await (await fetch(dataUrl)).blob();
    const path = `${this.familyId}/${newId()}.jpg`;
    check(await this.db.storage.from('photos').upload(path, blob, { contentType: 'image/jpeg' }));
    return path;
  }
  async photoUrl(ref: string) {
    if (ref.startsWith('data:')) return ref;
    const res = await this.db.storage.from('photos').createSignedUrl(ref, 3600);
    return res.data?.signedUrl ?? '';
  }
  async replaceAll(s: Snapshot) {
    await this.deleteAll();
    if (!s.child) return;
    await this.saveChild(s.child);
    await this.addObservations(s.observations.map((o) => ({ ...o, childId: s.child!.id })));
    for (const j of s.journal) await this.saveJournal({ ...j, childId: s.child.id });
  }
  async deleteAll() {
    check(await this.db.from('child').delete().eq('family_id', this.familyId));
  }

  // Family & sharing (cloud only)
  async members(): Promise<{ user_id: string; role: string }[]> {
    return check(await this.db.from('member').select('user_id, role').eq('family_id', this.familyId)) as { user_id: string; role: string }[];
  }
  async invitations(): Promise<{ email: string; role: string }[]> {
    return check(await this.db.from('invitation').select('email, role').eq('family_id', this.familyId)) as { email: string; role: string }[];
  }
  async invite(email: string, role: 'editor' | 'viewer') {
    check(await this.db.from('invitation').upsert({ family_id: this.familyId, email: email.trim().toLowerCase(), role }));
  }
  async createShareLink(childId: string, days: number): Promise<string> {
    const expires = new Date(Date.now() + days * 86400000).toISOString();
    const rows = check(await this.db.from('share_link').insert({ child_id: childId, expires_at: expires }).select('token')) as Row[];
    return rows[0].token as string;
  }
  async revokeShareLinks(childId: string) {
    check(await this.db.from('share_link').update({ revoked: true }).eq('child_id', childId));
  }
}

export async function loadShared(token: string): Promise<Snapshot | null> {
  if (!supabase) return null;
  const data = check(await supabase.rpc('get_shared', { p_token: token })) as {
    child: Omit<Child, 'id'>;
    observations: Omit<Observation, 'childId'>[];
  } | null;
  if (!data) return null;
  const child: Child = { ...data.child, id: 'shared' };
  return { child, observations: data.observations.map((o) => ({ ...o, childId: 'shared' })), journal: [] };
}
