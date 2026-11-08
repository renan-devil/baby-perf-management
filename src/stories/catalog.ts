// The stories shipped with the app, read at build time from the stories/ folder: one folder per
// story with story.json, en.md, fr.md, pt.md and one picture per minute, picture-1.svg (the cover)
// to picture-N.svg (format and rules: stories/README.md).

import type { Locale } from '../domain/types';

export const LENGTHS = [2, 5, 10] as const;
/** How a story feels. Names: locales/*.json → stories.styles. */
export const STYLES = ['funny', 'adventure', 'calm', 'puzzle'] as const;
/** What a story is about. Names: locales/*.json → stories.themes. */
export const THEMES = ['perseverance', 'kindness', 'cleverness', 'gentleness', 'home', 'curiosity'] as const;
export type Minutes = (typeof LENGTHS)[number];
export type Style = (typeof STYLES)[number];
export type Theme = (typeof THEMES)[number];

/** A paragraph, or picture n of the story (stories/<id>/picture-<n>.svg) with its description. */
export type Block = { kind: 'text'; text: string } | { kind: 'picture'; n: number; alt: string };

/** One language version of a story. */
export interface StoryText {
  title: string;
  blocks: Block[]; // in reading order; empty for a book read from the shelf
  moral: string; // '' when there is none
}

export interface Story {
  id: string;
  minutes: Minutes;
  style: Style;
  theme: Theme;
  author: string | Partial<Record<Locale, string>>;
  texts: Partial<Record<Locale, StoryText>>;
  pictures: Record<number, string>; // picture number → URL; picture 1 is the cover
}

const PICTURE = /^!\[([^\]]*)\]\(picture-(\d+)\.svg\)$/;

/**
 * Reads a text file: "# Title", then paragraphs separated by blank lines, pictures on their own
 * line as "![what it shows](picture-2.svg)", and "> the moral".
 */
export function parseStoryText(raw: string): StoryText {
  const text: StoryText = { title: '', blocks: [], moral: '' };
  const blocks = raw.replace(/\r\n?/g, '\n').split(/\n[ \t]*\n/).map((b) => b.trim()).filter(Boolean);
  for (let block of blocks) {
    if (!text.title && block.startsWith('# ')) {
      const end = block.indexOf('\n');
      text.title = (end < 0 ? block : block.slice(0, end)).slice(2).trim();
      block = end < 0 ? '' : block.slice(end + 1).trim(); // text written right under the title
      if (!block) continue;
    }
    const picture = PICTURE.exec(block);
    if (picture) text.blocks.push({ kind: 'picture', n: Number(picture[2]), alt: picture[1].trim() });
    else if (block.startsWith('>')) text.moral = block.split('\n').map((line) => line.replace(/^>\s?/, '').trim()).join(' ');
    else text.blocks.push({ kind: 'text', text: block });
  }
  return text;
}

/** True when the story has a text to read (a book read from the shelf has only a title). */
export const hasText = (text: StoryText) => text.blocks.some((b) => b.kind === 'text');

/** Number of words, not counting signs such as "—" or "…". */
export const countWords = (text: string) => text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

interface StoryJson {
  minutes: number;
  style: string;
  theme: string;
  author: Story['author'];
}

const metas = import.meta.glob<StoryJson>('../../stories/*/story.json', { eager: true, import: 'default' });
const files = import.meta.glob<string>('../../stories/*/*.md', { eager: true, query: '?raw', import: 'default' });
const pictureFiles = import.meta.glob<string>('../../stories/*/picture-*.svg', { eager: true, query: '?url', import: 'default' });

/** All stories, shortest first. The tests check that every story is valid (stories.test.ts). */
export const STORIES: Story[] = Object.entries(metas)
  .map(([path, meta]) => {
    const dir = path.slice(0, path.lastIndexOf('/'));
    const texts: Story['texts'] = {};
    for (const locale of ['en', 'fr', 'pt'] as const) {
      const raw = files[`${dir}/${locale}.md`];
      if (raw !== undefined) texts[locale] = parseStoryText(raw);
    }
    const pictures: Story['pictures'] = {};
    for (const [file, url] of Object.entries(pictureFiles)) {
      const m = file.startsWith(`${dir}/`) ? /picture-(\d+)\.svg$/.exec(file) : null;
      if (m) pictures[Number(m[1])] = url;
    }
    return {
      id: dir.slice(dir.lastIndexOf('/') + 1),
      minutes: meta.minutes as Minutes,
      style: meta.style as Style,
      theme: meta.theme as Theme,
      author: meta.author,
      texts,
      pictures,
    };
  })
  .sort((a, b) => a.minutes - b.minutes || a.id.localeCompare(b.id));

/** The text in the requested language, else English, else whichever exists. */
export function storyText(story: Story, locale: Locale): StoryText {
  return story.texts[locale] ?? story.texts.en ?? Object.values(story.texts)[0] ?? { title: story.id, blocks: [], moral: '' };
}

export function authorName(story: Story, locale: Locale): string {
  const a = story.author;
  return typeof a === 'string' ? a : (a[locale] ?? a.en ?? Object.values(a)[0] ?? '');
}
