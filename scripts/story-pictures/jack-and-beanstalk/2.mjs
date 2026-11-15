import { PAL, hatch, tufts } from '../lib.mjs';
import { at, beans, compose, cow, jack, oldMan, place } from './characters.mjs';

// Jack and the Beanstalk, 2: on the road to market, a funny little old man with a long white beard
// and a tall, crooked red hat holds out his hand: five shiny magic beans! Jack stares at them, eyes
// wide, holding Milky-White's rope; the cow waits beside them.
const O = 'translate(62 280) scale(1.6)';
const J = 'translate(182 282) scale(1.55)';
const C = 'translate(322 284) scale(0.94)';
const hand = [40, -52];
const jHand = [30, -60];
const [hx, hy] = at(...hand, O);
const [rx, ry] = at(...jHand, J);
const [nx, ny] = at(-66, -58, C);

export default compose({
  title: 'Five magic beans',
  seed: 223,
  washes: [
    { c: PAL.green, o: 0.35, d: 'M0 226C100 216 300 220 400 226L400 300L0 300Z' },
    { c: PAL.ochre, o: 0.45, d: 'M0 266C120 258 280 260 400 266L400 300L0 300Z' },
    { c: PAL.sky, o: 0.25, d: 'M0 0L400 0L400 226C300 220 100 216 0 226Z' },
  ],
  fine: [tufts([[24, 232], [134, 236], [384, 236], [262, 238]], 8, 11), hatch(20, 292, 390, 292, 9, 8, 175, 4)],
  parts: [
    place(cow(), C),
    place(oldMan({ arms: [[[-13, -48, 7], [-18, -36, 6.5], [-20, -26, 6]], [[13, -48, 7], [26, -50, 6.5], hand.concat(6)]] }), O),
    place(beans(), `translate(${hx} ${hy - 6}) scale(1.5)`),
    place(
      jack({
        mood: 'wow',
        tilt: -8,
        arms: [
          [[-16, -84, 8], [-28, -76, 7.5], [-36, -68, 7]],
          [[16, -84, 8], [26, -72, 7.5], jHand.concat(7)],
        ],
      }),
      J,
    ),
    { fine: [`M${rx} ${ry}C${rx + 30} ${ry + 30} ${nx - 30} ${ny + 26} ${nx} ${ny}`] },
  ],
});
