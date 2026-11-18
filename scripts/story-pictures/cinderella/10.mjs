import { PAL } from '../lib.mjs';
import { at, cinderella, compose, heart, place, prince, sister, sparkles } from './characters.mjs';

// Cinderella, 10: all is forgiven. Cinderella, in her silver and blue gown again, puts her arms
// round her two stepsisters, who lean in close with their eyes shut, smiling at last. The prince
// stands beside them and smiles, and little hearts float up above them all.
const floor = 'M14 272C120 269 290 269 390 272';
const cx = 184;
const cs = 1.32;
const redT = 'translate(98 270) rotate(9) scale(1.12)';
const goldT = 'translate(268 270) rotate(-9) scale(1.12)';
// Cinderella's hands rest on her sisters' near shoulders
const local = ([x, y]) => [Math.round(((x - cx) / cs) * 10) / 10, Math.round(((y - 270) / cs) * 10) / 10];
const [lx, ly] = local(at(14, -100, redT));
const [rx, ry] = local(at(-14, -100, goldT));
const hearts = [heart(120, 40, 8), heart(186, 22, 10), heart(250, 44, 7), heart(330, 52, 6)].join('');

export default compose({
  title: 'Happy Ever After',
  seed: 1210,
  washes: [
    { c: PAL.grey, o: 0.3, d: 'M24 270C120 262 290 262 380 270C376 280 290 284 200 284C120 284 26 280 24 270Z' },
    { c: PAL.rose, o: 0.95, d: hearts },
    { c: PAL.red, o: 0.35, d: hearts },
  ],
  fine: [hearts],
  lines: [floor],
  parts: [
    place(sister({ who: 'red', mood: 'smile', tilt: 4, arms: [[[-13, -102, 7], [-18, -88, 6.5], [-20, -74, 6.5], [-20, -68, 6.5]], [[13, -102, 7], [24, -90, 6.5], [32, -80, 6.5], [38, -74, 6.5]]] }), redT),
    place(sister({ who: 'gold', mood: 'smile', tilt: -4, arms: [[[-13, -102, 7], [-24, -90, 6.5], [-32, -80, 6.5], [-38, -74, 6.5]], [[13, -102, 7], [18, -88, 6.5], [20, -74, 6.5], [20, -68, 6.5]]] }), goldT),
    place(
      cinderella({
        gown: true,
        mood: 'smile',
        arms: [
          [[-12, -80, 7], [(lx - 12) / 2 - 4, (ly - 80) / 2 - 2, 6.5], [lx, ly, 6.5]],
          [[12, -80, 7], [(rx + 12) / 2 + 4, (ry - 80) / 2 - 2, 6.5], [rx, ry, 6.5]],
        ],
      }),
      `translate(${cx} 270) scale(${cs})`,
    ),
    place(prince({ mood: 'happy', look: -1, tilt: -5 }), 'translate(344 270) scale(1.1)'),
    sparkles([
      [40, 120, 5],
      [384, 120, 4],
      [156, 60, 4],
    ]),
  ],
});
