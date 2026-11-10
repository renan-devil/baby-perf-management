import { PAL, hatch } from '../lib.mjs';
import { compose, dot, place, shoe, shoemaker, snowFlakes, wife } from './characters.mjs';

// The Elves and the Shoemaker, 10: on a snowy Christmas morning, the happy shoemaker and his wife wave
// from the open door of their warm little shop, a wreath above the door and a shoe for a sign.
const ground = 'M0 268C90 265 200 270 300 267C340 266 370 268 400 267';

const walls = 'M64 268L64 120M336 120L336 268';
const roof = 'M48 124L200 40L352 124Z';
const snowCap = 'M44 126C60 116 70 124 84 112C110 96 150 66 200 36C250 66 290 96 316 112C330 124 340 116 356 126C350 112 340 116 330 104L200 30L70 104C60 116 50 112 44 126Z';
const chimney = 'M276 82L276 46L300 46L300 96';
const smoke = 'M288 40C280 30 294 24 288 14C284 8 292 2 290 -4';
const door = 'M140 268L140 150C140 124 260 124 260 150L260 268';
const leaf = 'M260 150L276 158L276 264L260 268';
const step = 'M132 268L268 268L264 278L136 278Z';
const winL = 'M78 168L124 168L124 214L78 214ZM101 168L101 214M78 191L124 191';
const winR = 'M284 168L326 168L326 214L284 214ZM305 168L305 214M284 191L326 191';
const wreath = dot(268, 188, 7);
const wreathIn = dot(268, 188, 3.5);
const bow = 'M268 194L263 200L266 201ZM268 194L273 200L270 201Z';
const sign = 'M336 140L372 140M350 140L350 148M366 140L366 148';

export default compose({
  title: 'A happy Christmas morning',
  seed: 140,
  washes: [
    { c: PAL.slate, o: 0.18, d: 'M10 30C80 0 320 0 392 30C398 120 396 200 396 268L4 268C2 200 4 100 10 30Z' },
    { c: PAL.ochre, o: 0.3, d: `M64 124L336 124L336 268L64 268Z${door}Z`, rule: 'evenodd' },
    { c: PAL.terracotta, o: 0.7, d: roof },
    { c: PAL.slate, o: 0.45, d: 'M276 82L276 46L300 46L300 96Z' },
    { c: PAL.ochre, o: 0.42, d: `${door}Z` },
    { c: PAL.green, o: 0.55, d: `${leaf}Z` },
    { c: PAL.ochre, o: 0.8, d: 'M78 168L124 168L124 214L78 214ZM284 168L326 168L326 214L284 214Z' },
    { c: PAL.green, o: 0.9, d: `${wreath}${wreathIn}`, rule: 'evenodd' },
    { c: PAL.red, o: 0.9, d: bow },
    { c: PAL.sky, o: 0.25, d: 'M0 266C100 263 200 268 300 265C340 264 370 266 400 265L400 296C300 298 100 297 0 296Z' },
    { c: PAL.grey, o: 0.5, d: step },
  ],
  whites: `${snowCap}M76 214L126 214L126 220L76 220ZM282 214L328 214L328 220L282 220Z`,
  lines: [ground, walls, roof, chimney, door, leaf, wreath, bow, sign, 'M76 214L126 214M282 214L328 214'],
  fine: [
    snowCap,
    smoke,
    winL,
    winR,
    wreathIn,
    step,
    snowFlakes([[24, 50], [60, 90], [30, 150], [370, 60], [340, 30], [380, 120], [120, 40], [230, 18], [372, 210], [20, 220], [48, 196], [160, 76]], 3),
    hatch(20, 282, 380, 284, 10, 8, 172, 6),
  ],
  parts: [
    place(shoe({}), 'translate(340 166) scale(0.9)'),
    place(
      shoemaker({
        mood: 'shut',
        arms: [
          [[-20, -104, 10], [-25, -88, 9], [-27, -72, 9], [-26, -62, 9]],
          [[20, -104, 10], [32, -112, 9], [36, -126, 9], [36, -140, 9]],
        ],
      }),
      'translate(176 268) scale(0.84)',
    ),
    place(
      wife({
        mood: 'shut',
        arms: [
          [[-18, -100, 9], [-23, -86, 8], [-25, -72, 8], [-24, -64, 8]],
          [[18, -100, 9], [30, -108, 8], [34, -122, 8], [34, -136, 8]],
        ],
      }),
      'translate(226 268) scale(0.84)',
    ),
  ],
});
