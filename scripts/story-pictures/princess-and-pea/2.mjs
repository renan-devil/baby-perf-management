import { PAL, rng } from '../lib.mjs';
import { K_ARMS, candle, compose, king, place, princess } from './characters.mjs';

// The Princess and the Pea, 2: on a stormy night (dark storm clouds, a flash of lightning, pouring rain), the
// old King opens the castle door himself, holding up a candle, and stares in surprise: on the
// doorstep stands a girl soaked from head to toe, water dripping from her hair, her nose and her dress.
const wall = 'M0 262L0 40L22 40L22 26L50 26L50 40L84 40L84 26L112 26L112 40L146 40L146 26L174 26L174 40L208 40L208 26L236 26L236 262';
const arch = 'M74 262L74 120C74 82 100 62 132 62C164 62 190 82 190 120L190 262';
const archStones = 'M74 120L60 116M82 92L68 80M104 70L96 56M132 62L132 48M160 70L168 56M182 92L196 80M190 120L204 116';
const stones =
  'M0 80L60 80M24 80L24 118M0 118L60 118M40 118L40 158M0 158L62 158M18 158L18 200M0 200L62 200M44 200L44 240M0 240L64 240' +
  'M204 80L236 80M210 118L236 118M222 118L222 158M206 158L236 158M212 200L236 200M222 200L222 240M206 240L236 240M40 40L40 80M180 40L180 80M120 40L120 54';
// the door, swung open towards us on its hinges
const door = 'M74 262L74 120L44 132L44 278Z';
const planks = 'M64 124L64 270M54 128L54 274';
const hinges = 'M74 150L50 158M74 236L50 246';
const step = 'M58 262L350 262C356 268 354 276 346 278L52 278C46 276 50 268 58 262Z';
const puddle = 'M250 284C250 276 300 274 340 278C366 280 368 290 340 292C300 294 252 292 250 284Z';
// the storm: a dark sky over on the right, with a zigzag of lightning
const sky = 'M236 0L400 0L400 92C380 104 356 96 340 88C322 100 296 98 282 86C266 96 246 92 236 84Z';
const bolt = 'M372 6L354 36L366 38L348 64L360 66L340 96L374 58L362 56L380 30L368 28L388 6Z';
// the rain, falling slantwise outside, but not over the girl
const r = rng(29);
let rain = '';
for (let i = 0; i < 120; i++) {
  const x = 244 + r() * 150;
  const y = 8 + r() * 230;
  if (x > 268 && x < 344 && y > 108) continue;
  if (x > 300 && x < 372 && y < 156 && Math.abs((x - 335) * 0.6 + (y - 80) * 0.3) < 26) continue;
  rain += `M${x.toFixed(1)} ${y.toFixed(1)}l-4 12`;
}
const cloud = 'M240 84C246 92 266 96 282 86C296 98 322 100 340 88C356 96 380 104 400 92';
const splash = 'M262 276l-4 -5M268 276l1 -6M330 278l3 -6M338 278l6 -4M290 290l-6 2M344 288l6 1';

export default compose({
  title: 'A Knock at the Door',
  seed: 823,
  washes: [
    { c: PAL.slate, o: 0.85, rule: 'evenodd', d: `${sky}${bolt}` },
    { c: PAL.sky, o: 0.45, rule: 'evenodd', d: `${sky}${bolt}` },
    { c: PAL.grey, o: 0.65, rule: 'evenodd', d: `${wall}Z${arch}Z` },
    // the warm candlelight round the candle
    { c: PAL.ochre, o: 0.35, d: 'M176 120C176 96 224 96 224 120C224 146 176 146 176 120Z' },
    { c: PAL.terracotta, o: 0.85, d: door },
    { c: PAL.grey, o: 0.5, d: step },
    { c: PAL.sky, o: 0.8, d: puddle },
    { c: PAL.ochre, o: 1, d: bolt },
  ],
  lines: [wall, arch, door, step],
  fine: [cloud, archStones, stones, planks, hinges, bolt, puddle, splash],
  once: `<path d="${rain}"/>`,
  parts: [
    place(
      king({
        mood: 'wow',
        look: 1,
        arms: [K_ARMS.down[0], [[22, -104, 11], [38, -96, 10], [54, -100, 10], [64, -108, 10]]],
      }),
      'translate(128 266) scale(1.12)',
    ),
    place(candle(), 'translate(200 147) scale(1.1)'),
    place(princess({ mood: 'worried', look: -1, wet: true, tiara: false, tilt: -4 }), 'translate(306 270) scale(1.3)'),
  ],
});
