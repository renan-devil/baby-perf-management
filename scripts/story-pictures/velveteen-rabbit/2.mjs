import { PAL } from '../lib.mjs';
import { clockworkMouse, compose, dot, place, rabbit } from './characters.mjs';

// The Velveteen Rabbit, 2: on the floor of the toy cupboard, the proud clockwork mouse, key in his
// back, sticks his nose in the air and turns away from the shy little rabbit.
const floor = 'M0 258C90 255 200 259 300 256C340 255 370 257 400 256';
const boards = 'M0 278C100 275 220 279 400 276M120 258L117 277M262 257L264 276';
// the cupboard: its back wall and a shelf above, with a toy block and a ball on it
const wall = 'M30 256L30 40M370 256L370 40';
const shelf = 'M30 92L370 92M30 102L370 102';
const block = 'M60 92L60 62L90 62L90 92M60 62L70 54L100 54L90 62M100 54L100 84L90 92';
const ball = dot(330, 74, 17);
const ballBand = 'M314 70C324 78 338 78 346 68';

export default compose({
  title: 'The proud clockwork mouse',
  seed: 4202,
  washes: [
    { c: PAL.ochre, o: 0.38, d: 'M0 256C90 253 200 257 300 254C340 253 370 255 400 254L400 300L0 300Z' },
    { c: PAL.ochre, o: 0.12, d: 'M30 40L370 40L370 256L30 256Z' },
    { c: PAL.terracotta, o: 0.4, d: 'M30 92L370 92L370 102L30 102Z' },
    { c: PAL.sky, o: 0.7, d: 'M60 92L60 62L90 62L90 92ZM60 62L70 54L100 54L90 62Z' },
    { c: PAL.green, o: 0.6, d: 'M100 54L100 84L90 92L90 62Z' },
    { c: PAL.red, o: 0.75, d: ball },
  ],
  lines: [floor, wall, shelf, block, ball],
  fine: [boards, ballBand],
  parts: [place(rabbit({ mood: 'look', look: [1.4, -0.4] }), 'translate(122 264) scale(1.3)'), place(clockworkMouse(), 'translate(262 260) scale(1.7)')],
});
