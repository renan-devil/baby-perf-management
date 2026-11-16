import { PAL, hatch, tufts } from '../lib.mjs';
import { P_ARMS, ball, compose, frogHop, place, princess } from './characters.mjs';

// The Frog Prince, 4: without even a thank you, the princess runs off towards the castle, hugging her
// golden ball, and the little frog hops after her as fast as he can: "Wait! Wait for me!"
const ground = 'M0 272C90 269 200 274 300 271C340 270 370 272 400 271';
// the castle, far away on a hill on the left
const hill = 'M0 196C30 186 70 184 100 190C110 192 118 195 124 198';
const castle =
  'M18 190L18 132L40 132L40 190M18 132L16 124L42 124L40 132M22 124L22 118M30 124L30 118M38 124L38 118' +
  'M40 160L74 160L74 190M74 190L74 120L98 120L98 192M72 120L86 102L100 120M86 102L86 90L96 94L86 98' +
  'M50 190L50 176C50 168 64 168 64 176L64 190';
const windows = 'M27 146l0 8M83 134l0 8M57 166l0 0';
const dash = 'M226 210l16 0M222 222l22 0M226 234l14 0';
const calls = 'M286 196q-6 -6 -6 -14M276 204q-8 -2 -12 -8M296 192q0 -8 4 -12';

export default compose({
  title: 'Wait for me!',
  seed: 54,
  washes: [
    { c: PAL.green, o: 0.32, d: 'M0 268C90 265 200 270 300 267C340 266 370 268 400 267L400 300L0 300Z' },
    { c: PAL.green, o: 0.25, d: 'M0 196C30 186 70 184 100 190C130 196 160 220 180 268L0 268Z' },
    { c: PAL.grey, o: 0.45, d: 'M18 190L18 124L42 124L40 160L74 160L74 120L98 120L98 192Z' },
    { c: PAL.red, o: 0.7, d: 'M72 120L86 102L100 120Z' },
  ],
  lines: [ground, hill, castle],
  fine: [windows, dash, calls, hatch(14, 284, 384, 286, 12, 7, 165, 4), tufts([[24, 272], [270, 272], [392, 271]], 9, 5)],
  parts: [
    place(princess({ mood: 'happy', tilt: 8, arms: P_ARMS.hug, run: true }), 'translate(176 278) rotate(-12) scale(-1.4 1.4)'),
    place(ball(10), 'translate(152 170)'),
    place(frogHop({ mood: 'sad' }), 'translate(318 258) rotate(-10) scale(-1.5 1.5)'),
  ],
});
