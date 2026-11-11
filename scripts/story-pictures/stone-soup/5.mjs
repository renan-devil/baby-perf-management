import { PAL, hatch, transformPath } from '../lib.mjs';
import { compose, oval, place, steam, girl, traveller, woman } from './characters.mjs';

// Stone Soup, 5: everyone eats together at a long table in the village square. The old woman, the
// traveller and the little girl sit behind their bowls of soup and laugh; the girl waves her spoon.
const ground = 'M0 272C90 268 190 274 290 270C340 268 370 271 400 269';
const BACK = 182; // the far edge of the table top: the three sit just behind it

// the long table, seen a little from above
const top = `M14 ${BACK}L386 ${BACK}L396 202L4 202Z`;
const edge = 'M4 202L4 212L396 212L396 202';
const legs = 'M18 212L20 270M30 212L31 268M370 212L369 268M382 212L380 270';
const grain = 'M40 192l40 0M150 188l50 0M250 194l46 0M320 189l30 0';

// a bowl of golden soup (centre of its rim at 0,0) with a curl of steam
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
      { c: PAL.terracotta, o: 0.35, d: soup },
    ],
  };
}
// a round loaf of bread and the spoon the girl waves
const loaf = 'M-22 4C-26 -10 -14 -20 0 -20C14 -20 26 -10 22 4C14 9 -14 9 -22 4Z';
const loafCuts = 'M-12 -10q5 -5 10 -3M-2 -14q5 -5 10 -3M6 -6q5 -5 10 -3';

const W = `translate(74 ${BACK + 56 * 1.22}) scale(1.22)`;
const T = `translate(200 ${BACK + 60 * 1.1}) scale(1.1)`;
const G = `translate(322 ${BACK + 36 * 1.4}) scale(1.4)`;
const spoonG = 'M0 0L0 -26';
const spoonBowl = oval(0, -30, 4.5, 6);

export default compose({
  title: 'Soup for everyone',
  seed: 79,
  washes: [
    { c: PAL.ochre, o: 0.3, d: 'M0 268C90 264 190 270 290 266C340 264 370 267 400 265L400 296C300 300 100 298 0 296Z' },
    { c: PAL.terracotta, o: 0.55, d: `${top}M4 202L4 212L396 212L396 202Z` },
    { c: PAL.ochre, o: 0.45, d: top },
    { c: PAL.terracotta, o: 0.7, d: 'M16 212L22 212L24 268L18 270ZM366 212L372 212L371 268L366 268ZM28 212L33 212L33 266L29 266ZM378 212L384 212L382 268L377 270Z' },
  ],
  after: [
    { c: PAL.ochre, o: 0.95, d: transformPath(loaf, 'translate(140 194)') },
    { c: PAL.terracotta, o: 0.5, d: transformPath(loaf, 'translate(140 194)') },
    { c: PAL.grey, o: 0.9, d: transformPath(`${spoonBowl}`, 'translate(366 150) rotate(16)') },
  ],
  lines: [ground, top, edge, legs, transformPath(loaf, 'translate(140 194)')],
  fine: [grain, transformPath(loafCuts, 'translate(140 194)'), hatch(40, 284, 360, 286, 10, 8, 172, 4)],
  parts: [
    place(
      woman({
        mood: 'laugh',
        tilt: 4,
        upper: true,
        arms: [
          [[-17, -90, 9], [-24, -76, 8], [-24, -62, 8], [-18, -50, 8]],
          [[17, -90, 9], [24, -76, 8], [24, -62, 8], [18, -50, 8]],
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
    { lines: [transformPath(spoonG, 'translate(364 154) rotate(16)'), transformPath(spoonBowl, 'translate(366 150) rotate(16)')] },
    place(bowl(), 'translate(74 194)'),
    place(bowl(), 'translate(200 196)'),
    place(bowl(), 'translate(306 194)'),
    place(steam(2, 26), 'translate(74 182)'),
    place(steam(2, 26), 'translate(200 184)'),
    place(steam(2, 26), 'translate(306 182)'),
  ],
});
