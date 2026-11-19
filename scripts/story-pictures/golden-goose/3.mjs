import { PAL, hatch, zed } from '../lib.mjs';
import { GIRL_HEAD, HANS_ARMS, HANS_LEGS, at, burst, compose, dot, from, girl, goose, hans, place, reach, sparkles } from './characters.mjs';

// The Golden Goose, 3: night at the inn. Hans sleeps on a stool, the golden goose sleeps on the table,
// and the innkeeper's eldest daughter has crept up to pluck a golden feather: her hand is stuck fast!
const H = 'translate(84 282) scale(1.4)';
const G = 'translate(222 182) scale(-1.15 1.15)';
const D = 'translate(326 282) scale(1.42)';
const floor = 'M0 282C90 279 200 284 300 281C340 280 370 282 400 281';

// The table (top 180..192), the stool under Hans, the candle and the window with the moon.
const tableTop = 'M146 180L300 180L300 192L146 192Z';
const tableLegs = 'M156 192L158 280M168 192L170 280M282 192L280 280M292 192L290 280M156 230L292 230';
const stool = 'M52 220L118 220L118 228L52 228ZM58 228L54 282M112 228L116 282';
const candle = 'M160 180L160 158L170 158L170 180M156 180C156 176 174 176 174 180';
const flame = 'M165 154C161 150 162 144 165 138C168 144 169 150 165 154Z';
const win = 'M170 14L270 14L270 98L170 98ZM220 14L220 98M170 56L270 56';
const sill = 'M164 98L276 98L276 106L164 106Z';
const moon = 'M196 24C186 28 184 44 194 50C188 42 190 30 196 24Z';

// The daughter's hand lands on the goose's back.
const [hx, hy] = at(G, -24, -26);
const [lx, ly] = from(D, hx, hy);
const girlArms = [reach(-9, -78, lx, ly, 7), [[9, -80, 6.5], [20, -86, 6], [24, -100, 5.5]]];
const [fx, fy] = at(D, ...GIRL_HEAD);

export default compose({
  title: 'The innkeeper’s daughter is stuck to the golden goose',
  seed: 73,
  washes: [
    { c: PAL.slate, o: 0.22, d: 'M10 30C40 0 360 0 392 30C410 120 404 250 392 284L8 284C-4 240 -4 100 10 30Z' },
    { c: PAL.slate, o: 0.75, d: 'M170 14L270 14L270 98L170 98Z' },
    { c: PAL.ochre, o: 0.9, d: moon },
    { c: PAL.ochre, o: 0.28, d: dot(165, 150, 40) },
    { c: PAL.ochre, o: 0.5, d: 'M164 98L276 98L276 106L164 106Z' },
    { c: PAL.terracotta, o: 0.55, d: tableTop + 'M156 192L158 280L168 280L168 192ZM282 192L280 280L290 280L292 192ZM52 220L118 220L118 228L52 228Z' },
    { c: PAL.ochre, o: 0.4, d: tableTop },
    { c: PAL.paper, o: 1, d: 'M160 180L160 158L170 158L170 180Z' },
    { c: PAL.ochre, o: 0.95, d: flame },
    { c: PAL.red, o: 0.45, d: 'M165 150C163 148 163 146 165 143C167 146 167 148 165 150Z' },
  ],
  lines: [floor, tableTop, tableLegs, stool, win, sill],
  fine: [
    candle,
    flame,
    moon,
    'M242 28l0 6M239 31l6 0M254 78l0 5M251.5 80.5l5 0M188 76l0 5M185.5 78.5l5 0',
    zed(116, 112, 9),
    zed(130, 92, 12),
    zed(148, 68, 15),
    hatch(20, 292, 380, 294, 12, 7, 165, 4),
    // surprise marks round the stuck hand and above her head
    burst(hx, hy, 10, 22, 8, 5, 200),
    `M${fx - 4} ${fy - 50}l-3 -14M${fx + 8} ${fy - 52}l2 -14M${fx + 18} ${fy - 46}l7 -11`,
  ],
  parts: [
    place(hans({ mood: 'asleep', tilt: 14, arms: HANS_ARMS.lap, legs: HANS_LEGS.sit }), H),
    place(goose({ mood: 'asleep' }), G),
    place(sparkles([[200, 134, 5], [262, 130, 4.5]]), ''),
    place(girl({ mood: 'wow', dress: PAL.green, tilt: -6, arms: girlArms }), D),
  ],
});
