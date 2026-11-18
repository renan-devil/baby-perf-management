import { PAL } from '../lib.mjs';
import { C_ARMS, cinderella, compose, dot, mouse, place, pumpkin, sparkles } from './characters.mjs';

// Cinderella, 1 (cover): Cinderella stands in her shining ball gown of sky blue and silver, with her
// glass slippers peeping out under the hem, holding her skirt out and smiling. Swirls of pale sky shine and
// sparkles shine around her; the big orange pumpkin sits at her feet on one side and the little
// grey mouse on the other.
// a swirl of pale magic shine on each side of her
const shine = 'M150 40C104 70 90 130 120 196C96 140 106 82 150 40ZM250 40C296 70 310 130 280 196C304 140 294 82 250 40Z';
const floor = 'M40 272C140 268 270 268 370 272';

export default compose({
  title: 'Cinderella',
  seed: 1201,
  washes: [
    { c: PAL.sky, o: 0.5, d: shine },
    { c: PAL.grey, o: 0.3, d: 'M60 270C140 262 270 262 350 270C346 280 270 284 200 284C130 284 62 280 60 270Z' },
  ],
  lines: [floor],
  parts: [
    place(cinderella({ gown: true, mood: 'happy', arms: C_ARMS.skirt }), 'translate(200 270) scale(1.85)'),
    place(pumpkin(), 'translate(316 274) scale(0.82)'),
    place(mouse(), 'translate(96 270) scale(1.4)'),
    sparkles([
      [120, 70, 7],
      [282, 60, 8],
      [104, 160, 5],
      [300, 168, 6],
      [150, 30, 5],
      [252, 26, 5],
      [330, 110, 5],
      [76, 112, 5],
    ]),
    { glints: [dot(170, 64, 1.4), dot(236, 82, 1.2), dot(126, 210, 1.2), dot(272, 216, 1.2)] },
  ],
});
