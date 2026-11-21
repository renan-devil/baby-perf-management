// Bucket list: the items in bucket-list/, the search, how "done" marks are filed, and the API
// (with an in-memory Blob store).
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { firstMarks, isNewMark, markPath, parseMarkPath, type Mark } from '../../api/_bucket';
import en from '../../locales/en.json';
import fr from '../../locales/fr.json';
import pt from '../../locales/pt.json';
import { fold, ITEMS, search, strayPictures, type Item } from './catalog';

const LOCALES = { en, fr, pt } as const;

describe('bucket list items', () => {
  it('has items with a valid, unique id', () => {
    expect(ITEMS.length).toBeGreaterThanOrEqual(10);
    for (const item of ITEMS) expect(item.id, item.id).toMatch(/^[a-z0-9-]{1,60}$/); // same rule as api/_bucket.ts
    expect(new Set(ITEMS.map((i) => i.id)).size).toBe(ITEMS.length);
  });

  it('has every item in French, English and Portuguese', () => {
    for (const item of ITEMS) {
      for (const l of ['en', 'fr', 'pt'] as const) {
        expect(item.title[l]?.trim(), `${item.id} title ${l}`).toBeTruthy();
        expect(item.note[l]?.trim(), `${item.id} note ${l}`).toBeTruthy();
      }
    }
  });

  it('has one picture for each item, and no picture without an item', () => {
    for (const item of ITEMS) expect(item.picture, `bucket-list/${item.id}.svg`).toBeTruthy();
    expect(strayPictures()).toEqual([]);
  });

  it('has the same wording in the three languages', () => {
    const keys = (o: object, prefix = ''): string[] =>
      Object.entries(o).flatMap(([k, v]) => (typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]));
    for (const [l, messages] of Object.entries(LOCALES)) {
      expect(keys(messages.bucket).sort(), l).toEqual(keys(en.bucket).sort());
      expect(messages.hub.bucketList.name, l).toBeTruthy();
      expect(messages.hub.bucketList.desc, l).toBeTruthy();
    }
  });
});

describe('search', () => {
  const item = (id: string, title: string, note = ''): Item => ({
    id,
    title: { en: title, fr: `${title} fr`, pt: `${title} pt` },
    note: { en: note, fr: '', pt: '' },
  });
  const sea = { id: 'sea', title: { en: 'See the sea', fr: 'Voir la mer', pt: 'Ver o mar' }, note: { en: 'Waves', fr: 'Vagues', pt: 'Ondas' } };
  const bike = { id: 'bike', title: { en: 'Ride a bike', fr: 'Faire du vélo', pt: 'Andar de bicicleta' }, note: { en: '', fr: 'Casser les œufs', pt: '' } };
  const items = [sea, bike];

  it('ignores case and accents', () => {
    expect(fold('Été Ça œufs')).toBe('ete ca oeufs');
    expect(search(items, 'VELO').map((i) => i.id)).toEqual(['bike']);
    expect(search(items, 'vélo').map((i) => i.id)).toEqual(['bike']);
    expect(search(items, 'oeufs').map((i) => i.id)).toEqual(['bike']);
  });

  it('looks in the three languages, in titles and notes', () => {
    for (const q of ['sea', 'mer', 'mar', 'ondas']) expect(search(items, q).map((i) => i.id), q).toEqual(['sea']);
  });

  it('needs every word typed', () => {
    expect(search(items, 'voir mer').map((i) => i.id)).toEqual(['sea']);
    expect(search(items, 'voir velo')).toEqual([]);
  });

  it('shows everything when the search is empty', () => {
    expect(search(items, '')).toEqual(items);
    expect(search(items, '   ')).toEqual(items);
    expect(search([item('a', 'A')], 'zzz')).toEqual([]);
  });

  it('finds real items', () => {
    expect(search(ITEMS, 'velo').map((i) => i.id)).toContain('ride-a-bike');
    expect(search(ITEMS, 'comboio').map((i) => i.id)).toContain('take-the-train');
  });
});

describe('done marks', () => {
  const m = { itemId: 'see-the-sea', date: '2025-07-14' };

  it('round-trips file names', () => {
    const path = markPath(m, 1762523456789);
    expect(path).toBe('bucket-list/see-the-sea/2025-07-14_1762523456789.json');
    expect(parseMarkPath(path)).toEqual({ ...m, id: path, savedAt: 1762523456789 });
  });

  it('rejects anything else', () => {
    for (const p of [
      'school/123-file.pdf',
      'story-reactions/x/2026-11-07_loved_fr_1.json',
      'bucket-list/x/2026-11-07_1.txt',
      'bucket-list/X/2026-11-07_1.json',
      'bucket-list/x/2026-02-30_1.json',
      'bucket-list/../x/2026-11-07_1.json',
      'bucket-list/x/2026-11-07.json',
    ]) {
      expect(parseMarkPath(p), p).toBeNull();
    }
  });

  it('checks what the browser sends', () => {
    expect(isNewMark(m)).toBe(true);
    for (const bad of [null, 'x', {}, { ...m, itemId: '../x' }, { ...m, date: '14/7/2025' }, { ...m, date: '2025-13-01' }, { itemId: 'x' }]) {
      expect(isNewMark(bad), JSON.stringify(bad)).toBe(false);
    }
  });

  it('counts the first time an item was done', () => {
    const mark = (itemId: string, date: string, savedAt: number): Mark => ({ id: `${itemId}${date}${savedAt}`, itemId, date, savedAt });
    const first = firstMarks([mark('a', '2026-05-01', 1), mark('a', '2025-05-01', 2), mark('b', '2026-01-01', 3), mark('b', '2026-01-01', 1)]);
    expect(first.get('a')?.date).toBe('2025-05-01');
    expect(first.get('b')?.savedAt).toBe(1); // same day: the one recorded first
    expect(first.has('c')).toBe(false);
  });
});

// ---- The API (api/bucket.ts) against an in-memory Blob store ----

const store = new Map<string, string>();
vi.mock('@vercel/blob', () => ({
  list: async ({ prefix }: { prefix: string }) => ({
    blobs: [...store.keys()].filter((p) => p.startsWith(prefix)).map((pathname) => ({ pathname })),
    hasMore: false,
  }),
  put: async (pathname: string, body: string, options: { access: string; addRandomSuffix: boolean }) => {
    expect(options).toMatchObject({ access: 'private', addRandomSuffix: false });
    if (store.has(pathname)) throw new Error('exists');
    store.set(pathname, body);
    return { pathname };
  },
  del: async (pathname: string) => void store.delete(pathname),
}));

describe('bucket list API', async () => {
  vi.stubEnv('SITE_PASSWORD', 'test-password');
  afterAll(() => vi.unstubAllEnvs());
  const { GET, POST, DELETE } = await import('../../api/bucket');
  const { COOKIE, sessionToken } = await import('../../api/_lib');
  const cookie = `${COOKIE}=${await sessionToken()}`;
  const call = (method: string, query = '', body?: unknown, withCookie = true) =>
    new Request(`https://constance.example/api/bucket${query}`, {
      method,
      headers: withCookie ? { cookie, 'content-type': 'application/json' } : {},
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  const mark = { itemId: 'see-the-sea', date: '2025-07-14' };

  beforeEach(() => store.clear());

  it('refuses visitors without the password', async () => {
    expect((await GET(call('GET', '', undefined, false))).status).toBe(401);
    expect((await POST(call('POST', '', mark, false))).status).toBe(401);
    expect((await DELETE(call('DELETE', '?id=x', undefined, false))).status).toBe(401);
  });

  it('records, lists and deletes marks', async () => {
    const created = await POST(call('POST', '', mark));
    expect(created.status).toBe(201);
    const saved = (await created.json()) as Mark;
    expect(saved).toMatchObject(mark);
    expect(saved.id).toMatch(/^bucket-list\/see-the-sea\/2025-07-14_\d+\.json$/);
    expect(JSON.parse(store.get(saved.id)!)).toMatchObject(mark);

    const earlier = (await (await POST(call('POST', '', { itemId: 'fly-a-kite', date: '2024-04-02' }))).json()) as Mark;
    const listed = (await (await GET(call('GET'))).json()) as Mark[];
    expect(listed.map((x) => x.id)).toEqual([earlier.id, saved.id]); // first time first

    expect((await DELETE(call('DELETE', `?id=${encodeURIComponent(saved.id)}`))).status).toBe(204);
    expect([...store.keys()]).toEqual([earlier.id]);
  });

  it('rejects bad input without touching the store', async () => {
    expect((await POST(call('POST', '', { ...mark, date: 'yesterday' }))).status).toBe(400);
    expect((await POST(new Request('https://constance.example/api/bucket', { method: 'POST', headers: { cookie }, body: 'not json' }))).status).toBe(400);
    store.set('story-reactions/x/2026-11-07_loved_fr_1.json', 'x');
    expect((await DELETE(call('DELETE', `?id=${encodeURIComponent('story-reactions/x/2026-11-07_loved_fr_1.json')}`))).status).toBe(400);
    expect(store.size).toBe(1);
  });
});
