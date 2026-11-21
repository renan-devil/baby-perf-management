import { PAL, hatch } from '../lib.mjs';
import { K_ARMS, compose, flames, king, place, spinningWheel } from './characters.mjs';

// Picture 4: the King orders every spinning wheel in the kingdom onto a big bonfire in the castle
// yard.
const ground = 'M14 266C140 262 280 262 392 266';
const logs = 'M206 266L232 244L246 250L222 270ZM350 268L330 244L316 250L338 272ZM250 270L262 250L310 250L320 270Z';
const smoke = 'M284 76C276 64 292 56 284 44C278 34 290 26 288 16';
const sparks = 'M216 110l-4 -6M350 104l5 -6M240 72l-2 -6M326 60l3 -6';

export default compose({
  title: 'The Bonfire of Spinning Wheels',
  seed: 2404,
  washes: [
    { c: PAL.grey, o: 0.3, d: 'M14 266C140 262 280 262 392 266L392 284C280 288 140 288 12 284Z' },
    { c: PAL.terracotta, o: 0.7, d: logs },
    { c: PAL.grey, o: 0.35, d: 'M276 78C266 64 282 54 276 42C272 30 284 22 290 16C298 28 288 38 294 50C300 62 290 70 292 82Z' },
  ],
  lines: [ground, logs],
  fine: [smoke, sparks, hatch(24, 276, 390, 276, 10, 6, 160, 8)],
  parts: [
    place(flames(78, 175), 'translate(282 264)'),
    place(spinningWheel(), 'translate(242 258) rotate(-20) scale(0.9)'),
    place(spinningWheel(), 'translate(324 256) rotate(16) scale(-0.9 0.9)'),
    place(spinningWheel(), 'translate(284 226) rotate(-6) scale(0.8)'),
    place(king({ mood: 'happy', look: 1, arms: [K_ARMS.order[0], [[16, -92, 9], [32, -92, 8], [46, -96, 8], [56, -100, 8]]] }), 'translate(90 266) scale(1.3)'),
  ],
});
