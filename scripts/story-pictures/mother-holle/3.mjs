import { PAL, rays, tufts } from '../lib.mjs';
import { cloud, compose, dot, flowers, loaf, marie, oven, place } from './characters.mjs';

// Mother Holle, 3: in the sunny meadow, Marie slides the golden loaves out of the big round oven
// with a long wooden paddle. Five are already cooling in a row on the grass; the sixth is coming out.
export const OT = 'translate(292 258) scale(1.1)';
const ground = 'M12 258C120 255 290 255 392 258';
const paddle = 'M112 201L232 197L232 202L112 206Z';
const blade = 'M228 193C240 191 262 191 268 194C270 199 270 203 268 207C262 210 240 210 228 207Z';

export default compose({
  title: 'Marie Takes the Bread out of the Oven',
  seed: 1403,
  washes: [
    { c: PAL.green, o: 0.45, d: 'M8 256C120 248 290 248 396 256L396 296C300 300 100 300 8 296Z' },
    { c: PAL.ochre, o: 0.9, d: dot(52, 56, 17) },
    { c: PAL.ochre, o: 0.7, d: `${paddle}${blade}` },
  ],
  lines: [ground, paddle, blade],
  fine: [
    rays(52, 56, 24, 36, 11, 3),
    tufts([[20, 258], [80, 258], [200, 258], [384, 258]], 9, 8),
  ],
  parts: [
    place(oven(), OT),
    place(
      marie({
        mood: 'happy',
        look: 1,
        arms: [
          [[-12, -80, 7], [-6, -62, 6.5], [8, -50, 6.5], [22, -45, 6.5]],
          [[12, -80, 7], [22, -66, 6.5], [30, -52, 6.5], [37, -44, 6.5]],
        ],
      }),
      'translate(104 258) scale(1.25)',
    ),
    place(loaf(), 'translate(248 190) scale(0.9)'),
    ...[150, 186, 222, 258, 294].map((x, i) => place(loaf(), `translate(${x} ${282 - (i % 2) * 2})`)),
    // steam rising from the fresh loaves
    { fine: ['M150 266q-4 -5 0 -10q4 -5 0 -10M222 264q-4 -5 0 -10q4 -5 0 -10M294 266q-4 -5 0 -10q4 -5 0 -10M246 177q-4 -5 0 -10q4 -5 0 -10'] },
    cloud(176, 62, 70),
    cloud(330, 44, 50),
    flowers([[30, 276], [60, 286], [92, 278], [340, 282], [372, 274], [24, 250], [380, 250]], 4),
  ],
});
