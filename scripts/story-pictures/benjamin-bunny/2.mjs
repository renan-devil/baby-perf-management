import { PAL, hatch, tufts } from '../lib.mjs';
import { compose, place } from '../peter-rabbit/characters.mjs';
import { benjamin, peterHanky } from './characters.mjs';

// The Tale of Benjamin Bunny, 2: in the wood, Benjamin comes hopping up to his cousin Peter, who sits
// all alone and very sorry for himself, wrapped up in a red cotton handkerchief.
const ground = 'M0 262C90 259 190 264 290 261C340 260 370 262 400 261';

// Two tree trunks at the edges of the picture, with leafy crowns
const trunks = 'M14 262C20 200 18 120 22 40M52 262C46 200 50 120 46 40M352 262C358 200 356 130 360 50M388 262C382 200 386 130 382 50';
const bark = 'M28 220l4 -12M36 160l-4 -14M30 100l4 -12M364 210l4 -12M372 150l-4 -14M366 96l4 -12';
const crowns = 'M-10 60C-20 30 0 6 26 14C40 -6 76 0 80 26C100 34 96 66 70 70C56 84 20 82 6 70C-4 76 -14 70 -10 60ZM330 66C318 40 340 16 364 24C378 6 414 10 414 36C420 56 400 78 380 76C364 90 338 86 330 66Z';

// Benjamin's hop: a dotted trail through the air behind him, and little puffs where he landed
const trail = 'M8 214C20 176 40 160 56 166';
const puff = 'M22 256c-4 -6 2 -10 6 -6c2 -6 10 -4 8 2';

export default compose({
  title: 'Benjamin hops up to Peter, who sits wrapped in a red handkerchief',
  seed: 92,
  washes: [
    { c: PAL.green, o: 0.35, d: 'M0 258C90 255 190 260 290 257C340 256 370 258 400 257L400 300L0 300Z' },
    { c: PAL.terracotta, o: 0.5, d: 'M14 262C20 200 18 120 22 40L46 40C50 120 46 200 52 262ZM352 262C358 200 356 130 360 50L382 50C386 130 382 200 388 262Z' },
    { c: PAL.green, o: 0.7, d: crowns },
    { c: PAL.ochre, o: 0.2, d: crowns },
  ],
  lines: [ground, trunks, crowns],
  fine: [bark, puff, hatch(110, 280, 300, 282, 8, 6, 165, 2), tufts([[110, 262], [180, 263], [236, 262], [344, 262]], 8, 3)],
  once: `<path d="${trail}" stroke-dasharray="2 7"/>`,
  parts: [
    place(benjamin({ pose: 'hop', mood: 'happy' }), 'translate(124 168) scale(1.7)'),
    place(peterHanky({ pose: 'sit', mood: 'cry' }), 'translate(296 206) scale(-1.85 1.85)'),
  ],
});
