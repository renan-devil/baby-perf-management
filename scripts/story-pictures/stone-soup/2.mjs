import { PAL, hatch, transformPath, tufts } from '../lib.mjs';
import { compose, girl, place, pot, traveller } from './characters.mjs';

// Stone Soup, 2: in the village square the traveller drops the round grey stone into his pot of water
// (Plop! the water splashes up), while a little girl peeks at him over her window sill.
const ground = 'M0 272C90 268 190 274 290 270C340 268 370 271 400 269';
const P = 'translate(206 268) scale(1.1)';
const T = 'translate(318 272) scale(1.1)';
const G = 'translate(62 207) scale(1.3)';

// the corner of the girl's cottage, with its open window and shutters
const wall = 'M-10 44L120 37L120 280';
const roof = 'M-10 44L132 35L136 23L-10 30';
const win = 'M22 64L102 64L102 160L22 160Z';
const sill = 'M14 160L110 160L112 168L12 168Z';
const shutterL = 'M22 64L5 70L5 154L22 160';
const shutterR = 'M102 64L119 70L119 154L102 160';
const stones = 'M10 200q8 -4 16 0M40 236q8 -4 16 0M86 210q8 -4 16 0M96 250q8 -4 16 0';

// Plop! drops of water jump up out of the pot, and lines show the stone falling
const drop = (x, y, a, s) => transformPath('M0 -6C3 -2 4 2 2 4C0 6 -2 6 -3 4C-4 2 -3 -2 0 -6Z', `translate(${x} ${y}) rotate(${a}) scale(${s})`);
const drops = [drop(188, 130, -30, 1.3), drop(198, 118, -14, 1.5), drop(230, 118, 16, 1.5), drop(244, 130, 32, 1.3)].join('');
const splash = 'M196 145C192 138 190 134 186 132M205 140C203 132 203 128 201 124M224 140C226 132 228 128 230 124M234 145C238 138 240 134 244 132';
const fall = 'M212 104l-1 14M220 106l-1 14M204 110l-1 10';

export default compose({
  title: 'Plop! went the stone',
  seed: 73,
  washes: [
    { c: PAL.ochre, o: 0.35, d: 'M0 268C90 264 190 270 290 266C340 264 370 267 400 265L400 296C300 300 100 298 0 296Z' },
    { c: PAL.ochre, o: 0.32, d: `M-10 44L120 37L120 268L-10 270Z${win}`, rule: 'evenodd' },
    { c: PAL.terracotta, o: 0.75, d: `${roof}Z` },
    { c: PAL.sky, o: 0.7, d: `${shutterL}Z${shutterR}Z` },
    { c: PAL.terracotta, o: 0.55, d: sill },
    { c: PAL.sky, o: 0.8, d: drops },
  ],
  lines: [ground, wall, roof, win, sill, shutterL, shutterR, drops],
  fine: [
    stones,
    'M6 96L21 96M6 132L21 132M103 96L118 96M103 132L118 132',
    'M10 34l8 -1M40 31l8 -1M70 29l8 -1M100 27l8 -1',
    splash,
    fall,
    hatch(150, 284, 386, 286, 9, 8, 172, 4),
    tufts([[150, 271], [384, 268]], 9, 6),
  ],
  parts: [
    place(
      girl({
        mood: 'peep',
        tilt: 6,
        upper: true,
        arms: [
          [[-12, -62, 7], [-18, -52, 6.5], [-17, -42, 6.5], [-12, -35, 6.5]],
          [[12, -62, 7], [18, -52, 6.5], [17, -42, 6.5], [12, -35, 6.5]],
        ],
      }),
      G,
    ),
    place(pot({ inside: 'water' }), P),
    place(
      traveller({
        mood: 'peepL',
        tilt: -8,
        arms: [
          [[-22, -108, 11], [-38, -116, 10], [-52, -128, 10], [-66, -138, 10]],
          [[22, -108, 11], [34, -96, 10], [36, -84, 10], [26, -76, 10]],
        ],
      }),
      T,
    ),
  ],
});
