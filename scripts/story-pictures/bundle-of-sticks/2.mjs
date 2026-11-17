import { PAL, hatch, tufts } from '../lib.mjs';

import { compose, crack, farmer, looseStick, place, snappedStick, son, snapHands, sonFrame, string } from './characters.mjs';

// The Bundle of Sticks, 2: the farmer has untied the red string, which lies on the ground by the
// spare sticks, and given each son just one stick. Crack! Crack! Crack! Each little stick snaps at
// once. The three brothers laugh, and the old farmer smiles.
const ground = 'M0 272C90 268 190 274 290 270C340 268 370 271 400 269';
const S = 1.12;

// each son holds his stick up over his head and snaps it in two: the break points up, with a burst round it
const SONS = [
  ['eldest', 178],
  ['middle', 262],
  ['youngest', 340],
];
const sonParts = SONS.flatMap(([who, x]) => {
  const fr = sonFrame(who);
  const top = fr.shoulders[0][1] - 6;
  const brk = [0, top - 50];
  const hands = snapHands(40).map(([hx, hy]) => [brk[0] + hx * 0.9, brk[1] + hy * 0.9]);
  const t = `translate(${x} 272) scale(${S})`;
  const k = `translate(${x} 272) scale(${S}) translate(${brk[0]} ${brk[1]})`;
  return [
    place(son(who, { mood: 'laugh', hands, bends: [-7, 7] }), t),
    place(snappedStick({ open: 40 }), `${k} scale(0.9)`),
    place(crack(), `${k}`),
  ];
});

export default compose({
  title: 'Crack! Crack! Crack!',
  seed: 43,
  washes: [
    { c: PAL.green, o: 0.4, d: 'M0 268C90 264 190 270 290 266C340 264 370 267 400 265L400 298C300 300 100 298 0 296Z' },
  ],
  lines: [ground],
  fine: [hatch(14, 286, 386, 288, 12, 7, 168, 4), tufts([[20, 270], [230, 272], [300, 271], [392, 269]], 9, 7)],
  parts: [
    place(looseStick(74), 'translate(96 280) rotate(-5)'),
    place(looseStick(70), 'translate(100 286) rotate(4)'),
    place(string(), 'translate(156 284) rotate(-6) scale(1.2)'),
    place(farmer({ mood: 'happy', hands: [[-32, -70], [40, -118]], bends: [10, 8], tilt: 6 }), `translate(64 272) scale(${S})`),
    ...sonParts,
  ],
});
