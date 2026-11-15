import { describe, expect, it } from 'vitest';
import { parseStoryText, STORIES } from './catalog';
import { forSpeech, sentences, spokenParts } from './listen';

describe('listening to a story', () => {
  it('drops the stars that mark italics', () => {
    expect(forSpeech('*Snif, snif.*  He  sniffed.')).toBe('Snif, snif. He sniffed.');
  });

  it('cuts a paragraph into sentences, keeping closing quotes', () => {
    expect(sentences('« Mmm ! Du fromage ! » Il leva les yeux. Et voilà…')).toEqual(['« Mmm !', 'Du fromage ! »', 'Il leva les yeux.', 'Et voilà…']);
    expect(sentences('"Hello!" said the fox. "Lovely day?"')).toEqual(['"Hello!" said the fox.', '"Lovely day?"']);
  });

  it('says the title, then each paragraph, then the moral', () => {
    const text = parseStoryText('# The Fox\n\n![cover](picture-1.svg)\n\nOne. Two.\n\nThree.\n\n> Be kind.');
    expect(spokenParts(text)).toEqual([
      { block: -1, text: 'The Fox' },
      { block: 1, text: 'One.' },
      { block: 1, text: 'Two.' },
      { block: 2, text: 'Three.' },
      { block: 3, text: 'Be kind.' },
    ]);
  });

  it('reads every word of every story', () => {
    for (const story of STORIES)
      for (const text of Object.values(story.texts)) {
        const said = spokenParts(text).map((p) => p.text).join(' ');
        const written = forSpeech([text.title, ...text.blocks.flatMap((b) => (b.kind === 'text' ? [b.text] : [])), text.moral].join(' '));
        expect(said, story.id).toBe(written);
      }
  });
});
