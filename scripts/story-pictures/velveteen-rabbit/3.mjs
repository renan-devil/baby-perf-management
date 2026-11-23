import { PAL, hatch } from '../lib.mjs';
import { compose, place, rabbit, skinHorse } from './characters.mjs';

// The Velveteen Rabbit, 3: the old Skin Horse, brown and worn bald in patches, lies on the nursery
// rug beside the little rabbit and tells him, kindly and wisely, what it means to become Real.
const rug = 'M18 268C14 250 90 240 200 240C310 240 392 250 388 268C384 286 300 294 200 294C100 294 22 286 18 268Z';
const rugBand = 'M40 268C40 256 110 250 200 250C290 250 366 256 366 268C366 280 290 286 200 286C110 286 40 280 40 268Z';
// his words drift towards the rabbit
const talk = 'M110 172c-3 3 -3 8 0 11M103 168c-5 5 -5 14 0 19M96 164c-7 7 -7 20 0 27';

export default compose({
  title: 'The Skin Horse tells the rabbit what Real means',
  seed: 4203,
  washes: [
    { c: PAL.ochre, o: 0.3, d: 'M0 214C90 211 200 215 300 212C340 211 370 213 400 212L400 300L0 300Z' },
    { c: PAL.red, o: 0.4, d: rug },
    { c: PAL.ochre, o: 0.5, d: rugBand },
  ],
  lines: [rug],
  fine: [rugBand, talk, hatch(80, 278, 320, 278, 10, 5, 160, 6)],
  parts: [place(rabbit({ mood: 'look', look: [1.4, -0.6] }), 'translate(56 258) scale(1.22)'), place(skinHorse({ talking: true }), 'translate(254 252) scale(1.5)')],
});
