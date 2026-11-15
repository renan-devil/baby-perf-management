import { PAL, rays } from '../lib.mjs';
import { Q_ARMS, compose, dot, place, prince, PC_ARMS, princess, queen } from './characters.mjs';

// The Princess and the Pea, 5: morning, the sun is up. At breakfast the princess sits on a stool by
// the little table (tea, a boiled egg, toast) and stretches, yawning a giant yawn, with heavy, tired
// eyes. The old Queen claps her hands and the Prince waves for joy: only a real princess could feel
// that pea! Both are smiling.
const floor = 'M14 272C120 269 290 269 390 272';
const sun = dot(200, 40, 16);
const sunRays = rays(200, 40, 22, 34, 12, 7);
// the stool she sits on (seat at y = 216)
const stool = 'M146 216L214 216L214 224L146 224Z';
const stoolLegs = 'M152 224L144 272M208 224L216 272M158 224L154 272M202 224L206 272';
// the little table with its cloth, and breakfast on it
const top = 'M224 206L306 206';
const cloth = 'M222 206L308 206L310 232C304 238 298 232 294 236C288 240 282 232 276 236C270 240 262 232 256 236C250 240 242 232 238 236C232 240 226 232 220 232Z';
const leg = 'M262 236L262 268M250 272C254 266 270 266 274 272';
const checks = 'M232 210l0 20M246 210l0 22M260 210l0 22M274 210l0 22M288 210l0 22M302 210l0 20M224 220L308 220';
const cup = 'M232 206L232 196C232 192 248 192 248 196L248 206ZM248 198C254 196 254 204 248 204';
const saucer = 'M226 206C228 210 252 210 254 206';
const steam = 'M236 188q-3 -5 0 -10q3 -5 0 -10M243 188q-3 -5 0 -10';
const eggCup = 'M272 206L268 200L284 200L280 206Z';
const egg = 'M268 200C268 186 284 186 284 200Z';
const toast = 'M290 206L290 194C290 188 304 188 304 194L304 206Z';

export default compose({
  title: 'Did You Sleep Well?',
  seed: 863,
  washes: [
    { c: PAL.ochre, o: 0.95, d: sun },
    { c: PAL.grey, o: 0.3, d: 'M20 270C110 262 300 262 386 270C384 280 300 284 200 284C110 284 22 280 20 270Z' },
    { c: PAL.terracotta, o: 0.8, d: `${stool}${'M222 232L302 232L302 236L222 236Z'}` },
    { c: PAL.terracotta, o: 0.8, d: 'M260 236L264 236L264 268L260 268Z' },
    { c: PAL.red, o: 0.35, d: cloth },
    { c: PAL.sky, o: 0.9, d: cup },
    { c: PAL.green, o: 0.85, d: eggCup },
    { c: PAL.ochre, o: 0.85, d: toast },
  ],
  whites: egg,
  lines: [floor, stool, stoolLegs, cloth, leg],
  fine: [sun, sunRays, checks, cup, saucer, steam, eggCup, egg, toast, top],
  parts: [
    place(queen({ mood: 'smile', tilt: 6, arms: Q_ARMS.folded }), 'translate(70 270) scale(1.12)'),
    place(
      princess({
        mood: 'tired',
        sit: true,
        tilt: -6,
        arms: [
          [[-12, -80, 7], [-24, -92, 6.5], [-30, -108, 6.5], [-30, -120, 6.5]],
          [[12, -80, 7], [24, -92, 6.5], [30, -108, 6.5], [30, -120, 6.5]],
        ],
      }),
      'translate(180 216) scale(1.3)',
    ),
    place(
      prince({
        mood: 'happy',
        look: -1,
        tilt: -6,
        arms: [PC_ARMS.down[0], [[18, -102, 10], [32, -112, 9], [38, -128, 9], [40, -140, 9]]],
      }),
      'translate(346 270) scale(1.1)',
    ),
  ],
});
