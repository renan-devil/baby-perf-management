// Stories: the catalogue in stories/, Constance's taste, and the reactions API (with an in-memory Blob store).
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { isNewTelling, parseTellingPath, tellingPath, type Telling } from '../../api/_stories';
import en from '../../locales/en.json';
import fr from '../../locales/fr.json';
import pt from '../../locales/pt.json';
import { countWords, LENGTHS, parseStoryText, STORIES, STYLES, THEMES } from './catalog';
import { latestByStory, tasteBy } from './taste';

const LOCALES = { en, fr, pt } as const;

describe('story catalogue', () => {
  it('has stories with valid settings', () => {
    expect(STORIES.length).toBeGreaterThanOrEqual(5);
    for (const s of STORIES) {
      expect(s.id, s.id).toMatch(/^[a-z0-9-]{1,60}$/); // same rule as the server (api/_stories.ts)
      expect(LENGTHS, s.id).toContain(s.minutes);
      expect(STYLES, s.id).toContain(s.style);
      expect(THEMES, s.id).toContain(s.theme);
      for (const l of ['en', 'fr', 'pt'] as const) {
        expect(typeof s.author === 'string' ? s.author : s.author[l], `${s.id} author ${l}`).toBeTruthy();
      }
    }
  });

  it('has every story in French, English and Portuguese, at the length it announces', () => {
    for (const s of STORIES) {
      for (const l of ['en', 'fr', 'pt'] as const) {
        const text = s.texts[l];
        expect(text?.title, `${s.id} ${l}: title`).toBeTruthy();
        if (!text?.paragraphs.length) continue; // a book read from the shelf has no text
        expect(text.moral, `${s.id} ${l}: moral`).toBeTruthy();
        // Read aloud calmly with the voices: about 120 words a minute.
        const perMinute = countWords([...text.paragraphs, text.moral].join(' ')) / s.minutes;
        expect(perMinute, `${s.id} ${l}: words per minute`).toBeGreaterThanOrEqual(90);
        expect(perMinute, `${s.id} ${l}: words per minute`).toBeLessThanOrEqual(170);
      }
    }
  });

  it('has the same Stories wording in the three languages, including every style and theme', () => {
    const keys = (o: object, prefix = ''): string[] =>
      Object.entries(o).flatMap(([k, v]) => (typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]));
    for (const [l, messages] of Object.entries(LOCALES)) {
      expect(keys(messages.stories).sort(), l).toEqual(keys(en.stories).sort());
      expect(messages.hub.stories.name, l).toBeTruthy();
      for (const s of STORIES) {
        expect((messages.stories.styles as Record<string, string>)[s.style], `${l} style ${s.style}`).toBeTruthy();
        expect((messages.stories.themes as Record<string, string>)[s.theme], `${l} theme ${s.theme}`).toBeTruthy();
      }
    }
  });

  it('reads a story file', () => {
    const t = parseStoryText('# Title\n\nOne *Plop!*\ntwo.\n\n  \nThree.\n\n> Moral\n> continued.\n');
    expect(t).toEqual({ title: 'Title', paragraphs: ['One *Plop!*\ntwo.', 'Three.'], moral: 'Moral continued.' });
    expect(parseStoryText('# Just a book\n')).toEqual({ title: 'Just a book', paragraphs: [], moral: '' });
    expect(parseStoryText('# Title\nText right after.').paragraphs).toEqual(['Text right after.']);
    expect(countWords('Zip! Zoom! — *Plod…* « Croâ ! »')).toBe(4);
  });
});

describe('telling file names', () => {
  const t = { storyId: 'tortoise-and-hare', date: '2026-11-07', reaction: 'loved', lang: 'fr' } as const;

  it('round-trips', () => {
    const path = tellingPath(t, 1762523456789);
    expect(path).toBe('story-reactions/tortoise-and-hare/2026-11-07_loved_fr_1762523456789.json');
    expect(parseTellingPath(path)).toEqual({ ...t, id: path, savedAt: 1762523456789 });
  });

  it('rejects anything else', () => {
    for (const p of [
      'school/123-file.pdf',
      'story-reactions/x/2026-11-07_loved_fr_1.txt',
      'story-reactions/X/2026-11-07_loved_fr_1.json',
      'story-reactions/x/2026-02-30_loved_fr_1.json',
      'story-reactions/x/2026-11-07_great_fr_1.json',
      'story-reactions/x/2026-11-07_loved_de_1.json',
      'story-reactions/../x/2026-11-07_loved_fr_1.json',
    ]) {
      expect(parseTellingPath(p), p).toBeNull();
    }
  });

  it('checks what the browser sends', () => {
    expect(isNewTelling(t)).toBe(true);
    for (const bad of [null, 'x', {}, { ...t, storyId: '../x' }, { ...t, date: '7/11/2026' }, { ...t, date: '2026-13-01' }, { ...t, reaction: 'meh' }, { ...t, lang: 'es' }]) {
      expect(isNewTelling(bad), JSON.stringify(bad)).toBe(false);
    }
  });
});

describe("Constance's taste", () => {
  const telling = (storyId: string, date: string, reaction: Telling['reaction'], savedAt = 0): Telling => ({ id: `${storyId}${date}${savedAt}`, storyId, date, reaction, lang: 'fr', savedAt });

  it('uses the latest telling of each story', () => {
    const latest = latestByStory([
      telling('a', '2026-11-01', 'loved'),
      telling('a', '2026-11-05', 'disliked', 1),
      telling('a', '2026-11-05', 'ok', 2), // same day, recorded later
      telling('a', '2026-11-03', 'loved', 9), // recorded later but told earlier
      telling('b', '2026-10-01', 'loved'),
    ]);
    expect(latest.get('a')?.reaction).toBe('ok');
    expect(latest.get('b')?.reaction).toBe('loved');
  });

  it('sums it up by style, best liked first, one vote per story', () => {
    const stories = [
      { ...STORIES[0], id: 'a', style: 'funny' as const },
      { ...STORIES[0], id: 'b', style: 'funny' as const },
      { ...STORIES[0], id: 'c', style: 'calm' as const },
      { ...STORIES[0], id: 'd', style: 'puzzle' as const },
    ];
    const latest = latestByStory([
      telling('a', '2026-11-01', 'loved'),
      telling('a', '2026-11-02', 'loved'), // told twice: still one vote
      telling('b', '2026-11-01', 'disliked'),
      telling('c', '2026-11-01', 'ok'),
    ]);
    const { rows, untried } = tasteBy(stories, latest, 'style');
    // funny: (1 + 0) / 2 = 0.5 with 2 stories; calm: 0.5 with 1 story → funny first (more stories).
    expect(rows).toEqual([
      { key: 'funny', reactions: ['loved', 'disliked'], score: 0.5 },
      { key: 'calm', reactions: ['ok'], score: 0.5 },
    ]);
    expect(untried).toEqual(['puzzle']);
  });
});

// ---- The API (api/stories.ts) against an in-memory Blob store ----

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

describe('reactions API', async () => {
  vi.stubEnv('SITE_PASSWORD', 'test-password');
  afterAll(() => vi.unstubAllEnvs());
  const { GET, POST, DELETE } = await import('../../api/stories');
  const { COOKIE, sessionToken } = await import('../../api/_lib');
  const cookie = `${COOKIE}=${await sessionToken()}`;
  const call = (method: string, query = '', body?: unknown, withCookie = true) =>
    new Request(`https://constance.example/api/stories${query}`, {
      method,
      headers: withCookie ? { cookie, 'content-type': 'application/json' } : {},
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  const telling = { storyId: 'lion-and-mouse', date: '2026-11-06', reaction: 'ok', lang: 'pt' };

  beforeEach(() => store.clear());

  it('refuses visitors without the password', async () => {
    expect((await GET(call('GET', '', undefined, false))).status).toBe(401);
    expect((await POST(call('POST', '', telling, false))).status).toBe(401);
    expect((await DELETE(call('DELETE', '?id=x', undefined, false))).status).toBe(401);
  });

  it('records, lists and deletes tellings', async () => {
    const created = await POST(call('POST', '', telling));
    expect(created.status).toBe(201);
    const saved = (await created.json()) as Telling;
    expect(saved).toMatchObject(telling);
    expect(saved.id).toMatch(/^story-reactions\/lion-and-mouse\/2026-11-06_ok_pt_\d+\.json$/);
    expect(JSON.parse(store.get(saved.id)!)).toMatchObject(telling);

    const later = (await (await POST(call('POST', '', { ...telling, date: '2026-11-07', reaction: 'loved' }))).json()) as Telling;
    const listed = (await (await GET(call('GET'))).json()) as Telling[];
    expect(listed.map((x) => x.id)).toEqual([later.id, saved.id]); // most recent first

    expect((await DELETE(call('DELETE', `?id=${encodeURIComponent(saved.id)}`))).status).toBe(204);
    expect([...store.keys()]).toEqual([later.id]);
  });

  it('rejects bad input without touching the store', async () => {
    expect((await POST(call('POST', '', { ...telling, reaction: 'meh' }))).status).toBe(400);
    expect((await POST(new Request('https://constance.example/api/stories', { method: 'POST', headers: { cookie }, body: 'not json' }))).status).toBe(400);
    store.set('school/1-report.pdf', 'x');
    expect((await DELETE(call('DELETE', `?id=${encodeURIComponent('school/1-report.pdf')}`))).status).toBe(400);
    expect(store.has('school/1-report.pdf')).toBe(true);
  });
});
