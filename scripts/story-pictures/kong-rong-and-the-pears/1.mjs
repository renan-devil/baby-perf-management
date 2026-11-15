import { PAL, hatch } from '../lib.mjs';
import { basket, compose, father, kongRong, place } from './characters.mjs';

// Kong Rong and the Pears, 1 (cover): Father has set the round basket of golden pears on the low
// table and holds out his hand: "you may choose first". Little Kong Rong, a hand on the table's edge,
// sniffs the sweet smell with his eyes shut. A round window with the autumn moon behind them.
const ground = 'M0 263C90 260 190 265 290 262C340 261 370 263 400 261';
const tableTop = 'M140 188L262 188L264 198L138 198Z';
const tableLegs = 'M150 198L150 262M145 198C145 230 147 250 151 262M252 198L252 262M257 198C257 230 255 250 251 262';
const window = 'M22 70C22 48 39 30 61 30C83 30 100 48 100 70C100 92 83 110 61 110C39 110 22 92 22 70Z';
const windowIn = 'M30 70C30 53 44 38 61 38C78 38 92 53 92 70C92 87 78 102 61 102C44 102 30 87 30 70Z';
const moon = 'M64 58C64 52 69 47 75 47C81 47 86 52 86 58C86 64 81 69 75 69C69 69 64 64 64 58Z';
const smell = 'M168 118c-5 -6 -10 4 -15 -1s-10 4 -15 -1M174 104c-6 -6 -12 4 -18 -1s-12 4 -18 -1';

export default compose({
  title: 'Kong Rong and the Pears',
  seed: 41,
  washes: [
    { c: PAL.ochre, o: 0.22, d: 'M0 232C100 228 300 234 400 230L400 290C300 294 100 292 0 290Z' },
    { c: PAL.sky, o: 0.45, d: windowIn },
    { c: PAL.slate, o: 0.22, d: windowIn },
    { c: PAL.ochre, o: 0.8, d: moon },
    { c: PAL.terracotta, o: 0.7, d: tableTop + 'M144 198L156 198L155 262L148 262ZM246 198L258 198L254 262L247 262Z' },
  ],
  lines: [ground, tableTop, tableLegs, window, windowIn],
  fine: [smell, hatch(10, 278, 390, 278, 12, 7, 165, 5), 'M61 30L61 38M61 102L61 110M22 70L30 70M92 70L100 70'],
  parts: [
    place(father({ look: [-1.2, 1] }), 'translate(330 262) scale(1.12)'),
    place(basket(), 'translate(200 150) scale(1.25)'),
    place(kongRong({ mood: 'shut', tilt: 8 }), 'translate(100 262) scale(1.35)'),
  ],
});
