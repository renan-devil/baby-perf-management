import { PAL } from '../lib.mjs';
import { at, compose, cushion, messenger, place, sister, slipper, tear } from './characters.mjs';

// Cinderella, 8: the prince's messenger has come with the glass slipper on a red velvet cushion. The
// stepsister in red sits on a chair and pushes and squeezes with all her might, eyes screwed shut and
// teeth gritted, but her big foot is far too big: only her toes go in. Little strain marks and
// drops of sweat fly round her; the messenger watches, worried.
const floor = 'M10 272C120 269 290 269 392 272';
// the messenger holds the cushion out on the flat of his hand
const mT = 'translate(326 272) scale(1.2)';
const M_REACH = [
  [[-16, -92, 9], [-30, -80, 8], [-42, -68, 8], [-50, -62, 8]],
  [[16, -92, 9], [24, -78, 8], [26, -64, 8], [26, -58, 8]],
];
const [hx, hy] = at(-50, -62, mT);
const cx = hx - 16;
const cy = hy - 9;
const slT = `translate(${cx + 8} ${cy - 22}) scale(1.45)`;
// the sister sits on a chair (seat at y = 206); she kicks her right foot up into the slipper
const seatY = 206;
const sx = 160;
const sc = 1.3;
const [fx, fy] = at(-20, -4, slT);
const foot = [(fx - sx) / sc, (fy - seatY) / sc];
const chairEnds = `M${sx - 48} ${seatY + 12}L${sx - 58} ${seatY + 12}L${sx - 58} ${seatY + 22}L${sx - 48} ${seatY + 22}`;
const chairEnds2 = `M${sx + 46} ${seatY + 12}L${sx + 56} ${seatY + 12}L${sx + 56} ${seatY + 22}L${sx + 46} ${seatY + 22}`;
const chairLegs = `M${sx - 56} ${seatY + 22}L${sx - 58} 272M${sx + 54} ${seatY + 22}L${sx + 56} 272`;
const strain = `M${fx - 4} ${fy - 20}l-2 -9M${fx + 8} ${fy - 22}l2 -9M${fx + 22} ${fy - 16}l7 -6M${fx - 14} ${fy - 14}l-7 -6`;
const sweat = [tear(110, 70, 1.1), tear(206, 66, 1.1), tear(216, 90, 0.9)].join('');

export default compose({
  title: 'Far Too Big',
  seed: 1208,
  washes: [
    { c: PAL.grey, o: 0.3, d: 'M14 270C120 262 290 262 388 270C384 280 290 284 200 284C120 284 16 280 14 270Z' },
    { c: PAL.terracotta, o: 0.85, d: `${chairEnds}Z${chairEnds2}Z` },
    { c: PAL.sky, o: 1, d: sweat },
  ],
  lines: [floor, chairEnds, chairEnds2, chairLegs],
  fine: [strain, sweat, 'M100 84l-6 -4M224 76l6 -4'],
  parts: [
    place(messenger({ mood: 'worried', look: -1, arms: M_REACH }), mT),
    place(cushion(), `translate(${cx} ${cy}) scale(1.2)`),
    place(
      sister({
        who: 'red',
        mood: 'effort',
        tilt: 8,
        sit: true,
        legs: [
          [[-9, 12, 6], [-10, 22, 5.5], [-10, 28, 5]],
          [[9, 10, 6], [foot[0] * 0.55, foot[1] * 0.55 + 2, 5.5], foot.map((v) => Math.round(v * 10) / 10).concat(5)],
        ],
        bare: [false, true],
        arms: [
          [[-13, -102, 7], [-26, -88, 6.5], [-30, -72, 6.5], [-28, -62, 6.5]],
          [[13, -102, 7], [30, -100, 6.5], [38, -112, 6.5], [40, -122, 6.5]],
        ],
      }),
      `translate(${sx} ${seatY}) scale(${sc})`,
    ),
    place(slipper({ shine: false }), slT),
  ],
});
