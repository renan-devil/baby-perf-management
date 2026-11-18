import { PAL } from '../lib.mjs';
import { C_ARMS, cinderella, compose, place, prince, sparkles } from './characters.mjs';

// Cinderella, 6: in the palace ballroom, under a golden chandelier, Cinderella and the prince dance
// together. They hold hands high between them and smile at each other; her silver and blue skirt
// swings out as they turn, and little notes of music float by.
const floor = 'M20 272C120 268 290 268 384 272';
// the chandelier: a chain, a curved golden ring and five candles with little flames
const chain = 'M200 0L200 22';
const ring = 'M150 30C160 50 240 50 250 30C240 40 160 40 150 30Z';
const candles = [150, 175, 200, 225, 250].map((x, i) => {
  const y = i === 0 || i === 4 ? 30 : i === 2 ? 40 : 37;
  return { wax: `M${x - 3} ${y}L${x - 3} ${y - 12}L${x + 3} ${y - 12}L${x + 3} ${y}`, flame: `M${x} ${y - 22}C${x - 4} ${y - 17} ${x - 4} ${y - 13} ${x} ${y - 12}C${x + 4} ${y - 13} ${x + 4} ${y - 17} ${x} ${y - 22}Z` };
});
const glow = candles.map((c, i) => `M${150 + i * 25 - 7} 14a7 7 0 1 0 14 0a7 7 0 1 0 -14 0Z`).join('');
// two notes of music
const notes = 'M66 96L66 70L80 66L80 92M66 70L80 66M330 120L330 96L342 92';
const heads = 'M60 98C58 92 70 92 68 98C66 102 60 102 60 98ZM74 94C72 88 84 88 82 94C80 98 74 98 74 94ZM324 122C322 116 334 116 332 122C330 126 324 126 324 122Z';

export default compose({
  title: 'The Dance',
  seed: 1206,
  washes: [
    { c: PAL.grey, o: 0.3, d: 'M30 270C120 262 290 262 376 270C372 280 290 284 200 284C120 284 32 280 30 270Z' },
    { c: PAL.ochre, o: 0.35, d: glow },
    { c: PAL.ochre, o: 1, d: ring },
    { c: PAL.paper, o: 1, d: candles.map((c) => `${c.wax}Z`).join('') },
    { c: PAL.red, o: 0.6, d: candles.map((c) => c.flame).join('') },
    { c: PAL.ochre, o: 1, d: candles.map((c) => c.flame).join('') },
  ],
  lines: [floor, chain, ring, ...candles.map((c) => c.wax)],
  fine: [...candles.map((c) => c.flame), notes],
  fills: `<path d="${heads}"/>`,
  parts: [
    place(
      cinderella({
        gown: true,
        hem: 'swish',
        mood: 'happy',
        look: 1,
        tilt: 6,
        arms: [C_ARMS.skirt[0], [[12, -80, 7], [24, -86, 6.5], [32, -96, 6.5], [35, -102, 6.5]]],
      }),
      'translate(150 272) scale(1.5)',
    ),
    place(
      prince({
        mood: 'happy',
        look: -1,
        tilt: -6,
        arms: [
          [[-18, -102, 10], [-28, -100, 9], [-36, -108, 9], [-38.5, -113, 9]],
          [[18, -102, 10], [30, -88, 9], [24, -72, 9], [20, -68, 9]],
        ],
      }),
      'translate(255 272) scale(1.35)',
    ),
    sparkles([
      [40, 150, 5],
      [360, 60, 5],
      [96, 40, 5],
      [362, 190, 4],
    ]),
  ],
});
