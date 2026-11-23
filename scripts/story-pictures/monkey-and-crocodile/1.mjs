import { PAL, rays } from '../lib.mjs';
import { BACK, M_POSE, compose, dot, monkey, place, ripple, swimCroc, tree } from './characters.mjs';

// The Monkey and the Crocodile, 1 (cover): the little monkey rides on the big green crocodile's back,
// waving, across the wide, wide river. His rose-apple tree is far behind on the bank.
const CT = 'translate(266 200) scale(1.3)';
const seat = BACK(-62);
const MT = `${CT} translate(${seat[0]} ${seat[1] + 2}) scale(1.25)`;

const bank = 'M0 112C40 108 80 110 120 107C132 106 142 106 150 106.5';
const bankFill = 'M0 112C40 108 80 110 120 107C132 106 142 106 150 106.5L156 112C120 114 60 116 0 117Z';
const river = 'M0 114C100 110 300 112 400 110L400 280C300 288 200 280 100 286C60 288 30 284 0 288Z';
const wake = 'M12 226C22 224 30 225 38 222M8 238C22 236 34 236 46 233';
const waterline = 'M56 213C90 212 120 214 160 213M262 214C290 215 320 213 350 214';

export default compose({
  title: 'The Monkey and the Crocodile',
  seed: 701,
  washes: [
    { c: PAL.sky, o: 0.5, d: river },
    { c: PAL.sky, o: 0.35, d: 'M0 190C120 186 260 192 400 188L400 276C300 284 200 276 100 282C60 284 30 280 0 284Z' },
    { c: PAL.green, o: 0.5, d: bankFill },
    { c: PAL.ochre, o: 0.65, d: dot(338, 54, 15) },
  ],
  lines: [bank],
  fine: [
    wake,
    waterline,
    dot(338, 54, 15),
    rays(338, 54, 20, 29, 9, 3),
    ripple(40, 150, 26),
    ripple(150, 136, 22),
    ripple(300, 140, 24),
    ripple(366, 168, 22),
    ripple(30, 256, 28),
    ripple(180, 262, 30),
    ripple(330, 256, 26),
  ],
  parts: [place(tree(), 'translate(70 110) scale(0.42)'), place(swimCroc({ mood: 'smile' }), CT), place(monkey({ mood: 'happy', pose: M_POSE.ride }), MT)],
});
