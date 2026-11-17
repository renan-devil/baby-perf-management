import { hatch } from '../lib.mjs';
import { FLOOR, HEAD_IN_BED, boards, floorWash } from './6.mjs';
import { G_ARMS, bed, bunch, compose, girl, pillow, place, wolfHead } from './characters.mjs';

// Little Red Riding Hood, 7: she stands by the bed with her armful of flowers and looks at the
// strange "grandmother": "Oh, Grandmother, what big ears you have!"
const B = 'translate(156 268) scale(1.3)';

export default compose({
  title: 'What big ears you have!',
  seed: 119,
  washes: [floorWash],
  lines: [FLOOR.replace('258', '266').replace('258', '266')],
  fine: [boards, hatch(10, 280, 390, 284, 10, 6, 170, 9)],
  parts: [
    place(pillow(), B),
    place(bed({ quilt: 'wolf' }), B),
    place(wolfHead({ mouth: 'tuck', cap: true, glasses: true }), `${B} ${HEAD_IN_BED}`),
    place(bunch(), 'translate(302.6 166) rotate(-10)'),
    place(girl({ arms: G_ARMS.offer, mood: 'wow', tilt: -6 }), 'translate(352 270) scale(1.3)'),
  ],
});
