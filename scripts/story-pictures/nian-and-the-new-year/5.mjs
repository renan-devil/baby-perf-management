import { PAL, hatch } from '../lib.mjs';
import { ARMS, compose, dumpling, lantern, merge, oval, person, place, right } from './characters.mjs';

// Nian and the First New Year, 5: New Year at home. The grandmother, a little girl in red and the
// old man in his red coat sit together behind a table full of dumplings, under two glowing red
// lanterns, with a red paper diamond on the wall behind them.
const top = 'M34 206L366 206L384 228L16 228Z';
const front = 'M16 228L384 228L384 240L16 240Z';
const diamond = 'M200 30L228 58L200 86L172 58Z';
const legs = 'M34 240L34 290M366 240L366 290M60 240L60 278M340 240L340 278';

// a plate of dumplings (centre of the plate at 0,0)
const plate = (n) => {
  const rim = oval(0, 0, 40, 9);
  const ds = [];
  const xs = n === 3 ? [-20, 0, 20] : [-27, -9, 9, 27];
  xs.forEach((x, i) => ds.push(place(dumpling(1.5), `translate(${x} ${i % 2 ? 2 : -1})`)));
  return merge({ lines: [rim], washes: [{ c: PAL.sky, o: 0.55, d: rim }] }, ...ds);
};
const bowl = (x, y) => ({
  lines: [`M${x - 12} ${y}C${x - 10} ${y + 12} ${x + 10} ${y + 12} ${x + 12} ${y}Z`],
  fine: [`M${x + 4} ${y - 2}L${x + 22} ${y - 18}M${x + 8} ${y - 1}L${x + 26} ${y - 15}`],
  washes: [{ c: PAL.sky, o: 0.6, d: `M${x - 12} ${y}C${x - 10} ${y + 12} ${x + 10} ${y + 12} ${x + 12} ${y}Z` }],
});

export default compose({
  title: 'Xīn nián kuài lè!',
  seed: 259,
  washes: [
    { c: PAL.ochre, o: 0.2, d: 'M0 0L400 0L400 300L0 300Z' },
    { c: PAL.terracotta, o: 0.65, d: top },
    { c: PAL.terracotta, o: 0.85, d: `${front}M30 240L38 240L38 290L30 290ZM362 240L370 240L370 290L362 290Z` },
  ],
  lines: [top, front, legs],
  fine: [hatch(40, 236, 360, 236, 10, 6, 0, 3), 'M190 196c-5 -7 5 -10 0 -17M210 196c-5 -7 5 -10 0 -17M94 198c-4 -6 4 -8 0 -14M306 198c-4 -6 4 -8 0 -14'],
  parts: [
    { lines: [diamond], washes: [{ c: PAL.red, o: 0.85, d: diamond }] },
    place(lantern(18, { string: 26 }), 'translate(46 -4)'),
    place(lantern(18, { string: 26 }), 'translate(354 -4)'),
    place(person({ who: 'granny', mood: 'laugh', arms: [ARMS.table, right(ARMS.wave)], cut: true }), 'translate(96 279) scale(1.3)'),
    place(person({ who: 'child', mood: 'laugh', arms: [ARMS.wave, right(ARMS.wave)], cut: true }), 'translate(200 266) scale(1.05)'),
    place(person({ who: 'oldman', red: true, mood: 'content', arms: [ARMS.table, right(ARMS.table)], cut: true }), 'translate(304 279) scale(1.3)'),
    place(plate(4), 'translate(200 216)'),
    place(plate(3), 'translate(100 218)'),
    place(plate(3), 'translate(300 218)'),
    bowl(40, 216),
    bowl(354, 216),
  ].map((p) => ({ lines: [], fine: [], washes: [], whites: [], fills: [], glints: [], ...p })),
});
