// What the "Listen" button says, in order: the title, each paragraph, then the moral.
// Paragraphs are cut into sentences because some browsers stop reading a long text after about
// fifteen seconds, and because short pieces let the reader pause and resume at a sentence.

import type { StoryText } from './catalog';

export interface SpokenPart {
  /** Which block of the story it belongs to: -1 for the title, blocks.length for the moral. */
  block: number;
  text: string;
}

/** Text as it should be spoken: no *stars* (they only mark italics), single spaces. */
export const forSpeech = (text: string) => text.replace(/\*/g, '').replace(/\s+/g, ' ').trim();

/**
 * Cuts a paragraph after each . ! ? or … followed by a space. Closing quotes (even the French
 * « … », with a space before) stay with their sentence, and there is no cut before a word in small
 * letters ("Hello!" said the fox.).
 */
export function sentences(paragraph: string): string[] {
  return forSpeech(paragraph)
    .split(/(?<=[.!?…](?:\s?[»"”’)])?)\s+(?![»”’)\p{Ll}])/u)
    .map((s) => s.trim())
    .filter((s) => /[\p{L}\p{N}]/u.test(s));
}

export function spokenParts(text: StoryText): SpokenPart[] {
  const parts: SpokenPart[] = [];
  if (text.title) parts.push({ block: -1, text: forSpeech(text.title) });
  text.blocks.forEach((b, i) => {
    if (b.kind === 'text') for (const s of sentences(b.text)) parts.push({ block: i, text: s });
  });
  if (text.moral) for (const s of sentences(text.moral)) parts.push({ block: text.blocks.length, text: s });
  return parts;
}
