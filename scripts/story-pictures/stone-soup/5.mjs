import { PAL, hatch, transformPath } from '../lib.mjs';
import { compose, girl, oval, place, traveller, woman } from './characters.mjs';

// Stone Soup, 5: everyone eats together at a long table in the village square. The old woman, the
// traveller and the little girl sit behind their bowls of soup and laugh; the girl waves her spoon.
const ground = 'M0 272C90 268 190 274 290 270C340 268 370 271 400 269';
const BACK = 200; // the far edge of the table top: the three sit just behind it

// the long table, seen a little from above
const top = `M14 ${BACK}L386 ${BACK}L396 222L4 222Z`;
const edge = 'M4 222L4 232L396 232L396 222';
const legs = 'M18 232L20 270M30 232L31 268M370 232L369 268M382 232L380 270';
const grain = 'M30 216l30 0M160 206l40 0M250 214l40 0M340 207l24 0';

// a bowl of golden soup (centre of its rim at 0,0); bowlShape is cut out of the table's wash
const bowlShape = 'M-20 0C-19 14 19 14 20 0C20 -3 11 -5 0 -5C-11 -5 -20 -3 -20 0Z';
const BOWLS = ['translate(84 213) scale(1.2)', 'translate(206 215) scale(1.2)', 'translate(306 213) scale(1.2)'];
const holes = BOWLS.map((t) => transformPath(bowlShape, t)).join('');
function bowl() {
  const b = 'M-20 0C-19 14 19 14 20 0';
  const rim = oval(0, 0, 20, 5);
  const soup = oval(0, 0.6, 16, 3.4);
  return {
    lines: [b, rim],
    fine: [soup, 'M-12 7q4 3 8 3'],
    washes: [
      { c: PAL.sky, o: 0.75, d: `${b}C19 4 -19 4 -20 0Z` },
      { c: PAL.ochre, o: 0.95, d: soup },
    ],
  };
}
// a round loaf of bread and the spoon the girl waves
const loaf = 'M-22 4C-26 -10 -14 -20 0 -20C14 -20 26 -10 22 4C14 9 -14 9 -22 4Z';
const loafCuts = 'M-12 -10q5 -5 10 -3M-2 -14q5 -5 10 -3M6 -6q5 -5 10 -3';

const W = `translate(78 ${BACK + 56 * 1.45}) scale(1.45)`;
const T = `translate(200 ${BACK + 60 * 1.3}) scale(1.3)`;
const G = `translate(318 ${BACK + 36 * 1.65}) scale(1.65)`;
const spoonG = 'M0 0L0 -26';
const spoonBowl = oval(0, -30, 4.5, 6);

export default compose({
  title: 'Soup for everyone',
  seed: 79,
  washes: [
    { c: PAL.ochre, o: 0.3, d: 'M0 268C90 264 190 270 290 266C340 264 370 267 400 265L400 296C300 300 100 298 0 296Z' },
    { c: PAL.terracotta, o: 0.55, d: `${top}${holes}M4 222L4 232L396 232L396 222Z`, rule: 'evenodd' },
    { c: PAL.ochre, o: 0.45, d: `${top}${holes}`, rule: 'evenodd' },
    { c: PAL.terracotta, o: 0.7, d: 'M16 232L22 232L23 268L18 270ZM28 232L33 232L33 266L29 266ZM367 232L372 232L371 268L367 268ZM378 232L384 232L382 268L377 270Z' },
  ],
  after: [
    { c: PAL.ochre, o: 0.95, d: transformPath(loaf, 'translate(139 214) scale(1.15)') },
    { c: PAL.terracotta, o: 0.5, d: transformPath(loaf, 'translate(139 214) scale(1.15)') },
    { c: PAL.grey, o: 0.9, d: transformPath(`${spoonBowl}`, 'translate(370 124) rotate(16) scale(1.2)') },
  ],
  lines: [ground, top, edge, legs, transformPath(loaf, 'translate(139 214) scale(1.15)')],
  fine: [grain, transformPath(loafCuts, 'translate(139 214) scale(1.15)'), hatch(40, 284, 360, 286, 10, 8, 172, 4)],
  parts: [
    place(
      woman({
        mood: 'laugh',
        tilt: 4,
        upper: true,
        arms: [
          [[-17, -90, 9], [-27, -78, 8], [-28, -62, 8], [-20, -50, 8]],
          [[17, -90, 9], [27, -78, 8], [28, -62, 8], [20, -50, 8]],
        ],
      }),
      W,
    ),
    place(
      traveller({
        mood: 'laugh',
        tilt: -3,
        upper: true,
        arms: [
          [[-22, -108, 11], [-30, -92, 10], [-30, -74, 10], [-24, -58, 10]],
          [[22, -108, 11], [30, -92, 10], [30, -74, 10], [24, -58, 10]],
        ],
      }),
      T,
    ),
    place(
      girl({
        mood: 'laugh',
        tilt: -6,
        upper: true,
        arms: [
          [[-12, -62, 7], [-17, -52, 6.5], [-16, -42, 6.5], [-10, -34, 6.5]],
          [[12, -62, 7], [20, -66, 6.5], [26, -76, 6.5], [30, -84, 6.5]],
        ],
      }),
      G,
    ),
    { lines: [transformPath(spoonG, 'translate(370 124) rotate(16) scale(1.2)'), transformPath(spoonBowl, 'translate(370 124) rotate(16) scale(1.2)')] },
    ...BOWLS.map((t) => place(bowl(), t)),
  ],
});
