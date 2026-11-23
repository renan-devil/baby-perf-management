import { PAL, rays, tufts } from '../lib.mjs';
import { boy, compose, dot, place, rabbit } from './characters.mjs';

// The Velveteen Rabbit, 5: on sunny days the Boy takes the rabbit into the garden and wheels him
// about in the wheelbarrow, under a bright sun, among the flowers.
const ground = 'M0 262C90 259 200 263 300 260C340 259 370 261 400 260';
// the wheelbarrow: a red tray, handles held by the Boy, a wheel at the front and a leg at the back
const tray = 'M180 196L304 190L290 236L198 240Z';
const rim = 'M178 196L306 189';
const handle = 'M166 196L186 214';
const frame = 'M196 238L300 248M214 239L206 262M200 262L212 262';
const wheel = dot(310, 248, 15);
const spokes = 'M310 236L310 260M298 248L322 248M302 240L318 256M318 240L302 256';
const tray2 = 'M244 192L244 238';
// flowers along the edge of the lawn
const flower = (x, y) => [0, 72, 144, 216, 288].map((a) => dot(x + Math.cos((a * Math.PI) / 180) * 4, y + Math.sin((a * Math.PI) / 180) * 4, 3.4)).join('');
const stems = 'M40 262L40 228M60 262L62 240M350 262L352 232M372 262L370 244';

export default compose({
  title: 'The Boy pushes the rabbit in the wheelbarrow',
  seed: 4205,
  washes: [
    { c: PAL.green, o: 0.38, d: 'M0 258C90 255 200 259 300 256C340 255 370 257 400 256L400 300L0 300Z' },
    { c: PAL.ochre, o: 0.85, d: dot(340, 54, 22) },
    { c: PAL.red, o: 0.75, d: tray },
    { c: PAL.slate, o: 0.5, d: wheel },
    { c: PAL.rose, o: 0.85, d: flower(40, 224) + flower(352, 228) },
    { c: PAL.ochre, o: 0.85, d: flower(62, 236) + flower(370, 240) },
  ],
  lines: [ground, tray, handle, frame, wheel],
  fine: [rim, spokes, tray2, dot(340, 54, 22), rays(340, 54, 28, 40, 11, 6), stems, tufts([[20, 262], [130, 262], [250, 262], [390, 260]], 9, 5)],
  parts: [place(rabbit({ mood: 'happy', look: [0, 0], upper: true }), 'translate(244 220) scale(1.0)'), place(boy({ mood: 'happy', hands: [38, -44] }), 'translate(108 262) scale(1.5)')],
});
