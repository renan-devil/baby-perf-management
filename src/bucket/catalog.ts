// Constance's bucket list: the things to do, read at build time from bucket-list/items.json (title
// and short note in French, English and Portuguese), with one picture each, bucket-list/<id>.svg.
// Format: bucket-list/README.md. Whether she has done each one is shared by the family through
// api/bucket.ts.

import type { Locale } from '../domain/types';
import raw from '../../bucket-list/items.json';

export type Texts = Record<Locale, string>;

export interface Item {
  id: string;
  title: Texts;
  note: Texts;
  picture?: string; // URL of bucket-list/<id>.svg
}

const pictureFiles = import.meta.glob<string>('../../bucket-list/*.svg', { eager: true, query: '?url', import: 'default' });
const pictureOf = (id: string) => pictureFiles[`../../bucket-list/${id}.svg`];

/** Every item, in the order of items.json. The tests check that each one is complete. */
export const ITEMS: Item[] = (raw as Omit<Item, 'picture'>[]).map((item) => ({ ...item, picture: pictureOf(item.id) }));

/** Picture files with no item in items.json (the tests check there are none). */
export const strayPictures = () =>
  Object.keys(pictureFiles)
    .map((file) => file.slice(file.lastIndexOf('/') + 1, -'.svg'.length))
    .filter((id) => !ITEMS.some((item) => item.id === id));

/** Lower case without accents, so that "Velo" finds "vélo" and "oeufs" finds "œufs". */
export const fold = (s: string) =>
  s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/œ/g, 'oe').replace(/æ/g, 'ae');

/**
 * The items matching a search: each word typed must appear in the item's title or note, in any of
 * the three languages (so "mer", "sea" and "mar" all find "See the sea"). An empty search matches all.
 */
export function search(items: Item[], query: string): Item[] {
  const words = fold(query).split(/\s+/).filter(Boolean);
  if (!words.length) return items;
  return items.filter((item) => {
    const haystack = fold([...Object.values(item.title), ...Object.values(item.note)].join(' '));
    return words.every((w) => haystack.includes(w));
  });
}
