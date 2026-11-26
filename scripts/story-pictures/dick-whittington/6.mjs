import { PAL } from '../lib.mjs';
import { captain, catSit, compose, dick, place } from './1.mjs';

// Dick Whittington, 6: at the quay, with tears in his eyes, Dick hands his cat to the captain of the
// big sailing ship that is about to sail away.
const quay = 'M10 262L300 262L300 286';
const quayStones = 'M10 274L300 274M60 262L60 274M130 274L130 286M190 262L190 274M250 274L250 286';
const water = 'M300 248c10 -3 20 3 30 0s20 3 30 0s20 3 34 0';

// the ship, its bow at the left (x 300) and its stern cut off by the edge of the picture
const hull = 'M300 186C318 188 360 186 404 180L404 244C370 248 336 246 318 238C308 222 302 204 300 186Z';
const band = 'M304 204C330 206 370 204 404 200';
const masts = 'M346 186L346 26M302 188L286 172';
const sail1 = 'M322 46C330 44 362 44 370 46C374 70 374 94 370 112C360 114 332 114 322 112C318 94 318 70 322 46Z';
const sail2 = 'M324 122C332 120 360 120 368 122C372 138 372 156 368 172C358 174 334 174 324 172C320 156 320 138 324 122Z';
const flag = 'M346 26L366 30L346 36Z';
const ports = 'M318 214a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0ZM344 214a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0ZM370 213a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0Z';

const D = 'translate(84 262) scale(1.3)';
const C = 'translate(250 262) scale(1.3)';

export default compose({
  title: 'Goodbye, little cat',
  seed: 263,
  washes: [
    { c: PAL.sky, o: 0.7, d: 'M300 246C330 242 370 244 400 244L400 290L300 290Z' },
    { c: PAL.grey, o: 0.6, d: 'M10 262L300 262L300 288L10 288Z' },
    { c: PAL.terracotta, o: 0.75, d: hull },
    { c: PAL.ink, o: 0.18, d: hull },
    { c: PAL.ochre, o: 0.8, d: 'M304 204C330 206 370 204 404 200L404 194C370 198 330 200 302 197Z' },
    { c: PAL.ochre, o: 0.3, d: sail1 + sail2 },
    { c: PAL.red, o: 0.85, d: flag },
  ],
  lines: [quay, hull, masts, sail1, sail2],
  fine: [quayStones, water, band, flag, ports, 'M330 46L330 112M362 46L362 112M332 122L332 172M360 122L360 172', 'M346 26L322 46M346 26L370 46'],
  parts: [
    place(
      dick({
        mood: 'sad',
        look: [1.2, 0],
        arms: [
          [[-17, -40, 8], [-4, -26, 7.5], [16, -20, 7.5], [38, -20, 7.5]],
          [[17, -40, 8], [28, -34, 7.5], [38, -32, 7.5], [46, -32, 7.5]],
        ],
      }),
      D,
    ),
    // a tear on his cheek
    { lines: [], fine: ['M90 131C87.5 135 87 138 90 139C93 138 92.5 135 90 131Z'], washes: [{ c: PAL.sky, o: 0.95, d: 'M90 131C87.5 135 87 138 90 139C93 138 92.5 135 90 131Z' }] },
    place(catSit({ mood: 'happy', tail: 'down', look: [-1, 0] }), 'translate(160 192) scale(1.05)'),
    place(
      captain({
        mood: 'smile',
        arms: [
          [[-22, -94, 9], [-36, -84, 8.5], [-50, -72, 8.5]],
          [[22, -94, 9], [29, -80, 8.5], [32, -66, 8.5], [33, -58, 8.5]],
        ],
      }),
      C,
    ),
  ],
});
