// What a "done" mark is (Constance did one thing on her bucket list, on a given day) and how it is
// filed in the private Blob store. Shared by the server (api/bucket.ts) and the browser
// (src/pages/BucketList.tsx), so this file must not import anything.
//
// Each mark is one tiny file that is never changed afterwards, and its name holds all the data:
//   bucket-list/<item id>/<day done>_<saved at, in ms>.json
//   bucket-list/see-the-sea/2025-07-14_1762523456789.json
// So listing the folder is enough to read everything, and two people saving at the same moment
// can never overwrite each other. "Not done yet" simply means the item has no file; undoing a
// mark deletes its file. If an item has several marks, the earliest day counts (the first time).

export const PREFIX = 'bucket-list/';

export interface NewMark {
  itemId: string; // the item's id in bucket-list/items.json
  date: string; // day she did it, YYYY-MM-DD
}

export interface Mark extends NewMark {
  id: string; // file name in the store
  savedAt: number; // when it was recorded (ms since 1970)
}

const ITEM_ID = '[a-z0-9-]{1,60}';
const IS_ITEM_ID = new RegExp(`^${ITEM_ID}$`);
const PATH = new RegExp(`^${PREFIX}(${ITEM_ID})/(\\d{4}-\\d{2}-\\d{2})_(\\d{1,16})\\.json$`);

/** True for a real calendar day written YYYY-MM-DD (rejects 2026-02-30). Same rule as api/_stories.ts. */
function isDay(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(s);
}

export function isNewMark(x: unknown): x is NewMark {
  if (typeof x !== 'object' || x === null) return false;
  const m = x as Record<string, unknown>;
  return typeof m.itemId === 'string' && IS_ITEM_ID.test(m.itemId) && typeof m.date === 'string' && isDay(m.date);
}

export const markPath = (m: NewMark, savedAt: number) => `${PREFIX}${m.itemId}/${m.date}_${savedAt}.json`;

/** Reads a file name back into a mark; null if it is not one. */
export function parseMarkPath(pathname: string): Mark | null {
  const m = PATH.exec(pathname);
  if (!m || !isDay(m[2])) return null;
  return { id: pathname, itemId: m[1], date: m[2], savedAt: Number(m[3]) };
}

/** First time first: by the day it was done, then by when it was recorded. */
export const firstFirst = (a: Mark, b: Mark) => a.date.localeCompare(b.date) || a.savedAt - b.savedAt;

/** For each item done, its first mark (the day she first did it). */
export function firstMarks(marks: Mark[]): Map<string, Mark> {
  const first = new Map<string, Mark>();
  for (const m of [...marks].sort(firstFirst)) if (!first.has(m.itemId)) first.set(m.itemId, m);
  return first;
}
