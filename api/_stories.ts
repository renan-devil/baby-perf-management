// What a "telling" is (one time a story was told to Constance, and how she liked it) and how it
// is filed in the private Blob store. Shared by the server (api/stories.ts) and the browser
// (src/pages/Stories.tsx), so this file must not import anything.
//
// Each telling is one tiny file that is never changed afterwards, and its name holds all the data:
//   story-reactions/<story id>/<day told>_<reaction>_<language>_<saved at, in ms>.json
//   story-reactions/tortoise-and-hare/2026-11-07_loved_fr_1762523456789.json
// So listing the folder is enough to read everything, and two people saving at the same moment
// can never overwrite each other.

export const PREFIX = 'story-reactions/';
export const REACTIONS = ['loved', 'ok', 'disliked'] as const;
export type Reaction = (typeof REACTIONS)[number];
export const LANGS = ['fr', 'en', 'pt'] as const;
export type Lang = (typeof LANGS)[number];

export interface NewTelling {
  storyId: string; // the story's folder name in stories/
  date: string; // day it was told, YYYY-MM-DD
  reaction: Reaction;
  lang: Lang; // language it was told in
}

export interface Telling extends NewTelling {
  id: string; // file name in the store
  savedAt: number; // when it was recorded (ms since 1970)
}

const STORY_ID = '[a-z0-9-]{1,60}';
const IS_STORY_ID = new RegExp(`^${STORY_ID}$`);
const PATH = new RegExp(`^${PREFIX}(${STORY_ID})/(\\d{4}-\\d{2}-\\d{2})_(${REACTIONS.join('|')})_(${LANGS.join('|')})_(\\d{1,16})\\.json$`);

/** True for a real calendar day written YYYY-MM-DD (rejects 2026-02-30). */
function isDay(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(s);
}

export function isNewTelling(x: unknown): x is NewTelling {
  if (typeof x !== 'object' || x === null) return false;
  const t = x as Record<string, unknown>;
  return (
    typeof t.storyId === 'string' &&
    IS_STORY_ID.test(t.storyId) &&
    typeof t.date === 'string' &&
    isDay(t.date) &&
    (REACTIONS as readonly unknown[]).includes(t.reaction) &&
    (LANGS as readonly unknown[]).includes(t.lang)
  );
}

export const tellingPath = (t: NewTelling, savedAt: number) => `${PREFIX}${t.storyId}/${t.date}_${t.reaction}_${t.lang}_${savedAt}.json`;

/** Reads a file name back into a telling; null if it is not one. */
export function parseTellingPath(pathname: string): Telling | null {
  const m = PATH.exec(pathname);
  if (!m || !isDay(m[2])) return null;
  return { id: pathname, storyId: m[1], date: m[2], reaction: m[3] as Reaction, lang: m[4] as Lang, savedAt: Number(m[5]) };
}

/** Most recent first: by the day it was told, then by when it was recorded. */
export const newestFirst = (a: Telling, b: Telling) => b.date.localeCompare(a.date) || b.savedAt - a.savedAt;
