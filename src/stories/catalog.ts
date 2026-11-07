// The stories shipped with the app, read at build time from the stories/ folder: one folder per
// story with story.json, en.md, fr.md, pt.md and picture.svg (format: stories/README.md).

import type { Locale } from '../domain/types';

export const LENGTHS = [2, 5, 10] as const;
/** How a story feels. Names: locales/*.json → stories.styles. */
export const STYLES = ['funny', 'adventure', 'calm', 'puzzle'] as const;
/** What a story is about. Names: locales/*.json → stories.themes. */
export const THEMES = ['perseverance', 'kindness', 'cleverness', 'gentleness', 'home'] as const;
export type Minutes = (typeof LENGTHS)[number];
export type Style = (typeof STYLES)[number];
export type Theme = (typeof THEMES)[number];

/** One language version of a story. */
export interface StoryText {
  title: string;
  paragraphs: string[]; // empty for a book read from the shelf
  moral: string; // '' when there is none
}

export interface Story {
  id: string;
  minutes: Minutes;
  style: Style;
  theme: Theme;
  author: string | Partial<Record<Locale, string>>;
  texts: Partial<Record<Locale, StoryText>>;
  picture?: string; // URL of the illustration
}

/** Reads a text file: "# Title", paragraphs separated by blank lines, and "> the moral". */
export function parseStoryText(raw: string): StoryText {
  const text: StoryText = { title: '', paragraphs: [], moral: '' };
  const blocks = raw.replace(/\r\n?/g, '\n').split(/\n[ \t]*\n/).map((b) => b.trim()).filter(Boolean);
  for (const block of blocks) {
    if (!text.title && block.startsWith('# ')) {
      const [first, ...rest] = block.split('\n');
      text.title = first.slice(2).trim();
      if (rest.length) text.paragraphs.push(rest.join('\n').trim());
    } else if (block.startsWith('>')) {
      text.moral = block.split('\n').map((line) => line.replace(/^>\s?/, '').trim()).join(' ');
    } else {
      text.paragraphs.push(block);
    }
  }
  return text;
}

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
const pictures = import.meta.glob<string>('../../stories/*/picture.svg', { eager: true, query: '?url', import: 'default' });

/** All stories, shortest first. The tests check that every story.json is valid. */
export const STORIES: Story[] = Object.entries(metas)
  .map(([path, meta]) => {
    const dir = path.slice(0, path.lastIndexOf('/'));
    const texts: Story['texts'] = {};
    for (const locale of ['en', 'fr', 'pt'] as const) {
      const raw = files[`${dir}/${locale}.md`];
      if (raw !== undefined) texts[locale] = parseStoryText(raw);
    }
    return {
      id: dir.slice(dir.lastIndexOf('/') + 1),
      minutes: meta.minutes as Minutes,
      style: meta.style as Style,
      theme: meta.theme as Theme,
      author: meta.author,
      texts,
      picture: pictures[`${dir}/picture.svg`],
    };
  })
  .sort((a, b) => a.minutes - b.minutes || a.id.localeCompare(b.id));

/** The text in the requested language, else English, else whichever exists. */
export function storyText(story: Story, locale: Locale): StoryText {
  return story.texts[locale] ?? story.texts.en ?? Object.values(story.texts)[0] ?? { title: story.id, paragraphs: [], moral: '' };
}

export function authorName(story: Story, locale: Locale): string {
  const a = story.author;
  return typeof a === 'string' ? a : (a[locale] ?? a.en ?? Object.values(a)[0] ?? '');
}
