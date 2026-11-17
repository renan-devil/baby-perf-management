import { PAL, hatch } from '../lib.mjs';
import { bed, compose, pillow, place, wardrobe, wolfHead, windowFrame } from './characters.mjs';

// Little Red Riding Hood, 6: the wolf lies in Grandmother's bed in her frilly nightcap and her round
// glasses, the quilt pulled right up to his nose. Inside the wardrobe, Grandmother peeps out through
// the crack and keeps as still as a mouse. Shhh.
export const FLOOR = 'M0 258L400 258';
export const floorWash = { c: PAL.ochre, o: 0.35, d: 'M0 258L400 258L400 300L0 300Z' };
export const boards = 'M40 270l60 0M150 282l70 0M260 268l60 0M330 288l50 0M20 292l50 0';
const B = 'translate(150 260) scale(1.12)';
export const HEAD_IN_BED = 'translate(-56 -74) rotate(-14) scale(1.1)';

export default compose({
  title: 'A wolf in a nightcap',
  seed: 117,
  washes: [floorWash],
  lines: [FLOOR],
  fine: [boards, hatch(10, 276, 390, 280, 10, 6, 170, 9)],
  parts: [
    place(windowFrame(), 'translate(160 86) scale(0.9)'),
    place(pillow(), B),
    place(bed({ quilt: 'wolf' }), B),
    place(wolfHead({ mouth: 'tuck', cap: true, glasses: true }), `${B} ${HEAD_IN_BED}`),
    place(wardrobe({ peep: true }), 'translate(334 260) scale(1.05)'),
  ],
});
