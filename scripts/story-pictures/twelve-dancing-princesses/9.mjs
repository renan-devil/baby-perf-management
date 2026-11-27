import { PAL, hatch, zed } from '../lib.mjs';
import { P_ARMS, S_ARMS, at, bedEnd, chair, compose, merge, place, princess, sole, soldier, youngest } from './characters.mjs';

// Picture 9: at dawn the princesses tiptoe back to bed, very tired, holding their worn-out shoes,
// past the soldier on his chair. Snorrre... he is only pretending: one eye is peeping!
const S = 'translate(78 266) scale(1.22)';

/** A princess carrying her worn-out shoes in both hands. */
function carrying(ch, t, k) {
  const [hx, hy] = at(38 * k, -72 * k, t);
  return merge(
    place(ch, t),
    { fine: [`M${hx} ${hy + 3}L${hx - 3} ${hy + 10}M${hx + 1} ${hy + 3}L${hx + 6} ${hy + 10}`] },
    place(sole(), `translate(${hx - 3} ${hy + 20}) rotate(6) scale(0.48)`),
    place(sole(), `translate(${hx + 7} ${hy + 21}) rotate(-8) scale(0.48)`),
  );
}
const win = 'M300 124L300 78C300 48 360 48 360 78L360 124Z';
const sun = 'M314 124C314 108 346 108 346 124Z';
const tiptoe = (x) => `M${x - 26} 256q4 -5 8 0M${x - 34} 248q4 -5 8 0`;

export default compose({
  title: 'Back to Bed',
  seed: 4109,
  washes: [
    { c: PAL.grey, o: 0.3, d: 'M20 266C60 258 360 258 390 266C360 274 60 274 20 266Z' },
    { c: PAL.sky, o: 0.45, d: win },
    { c: PAL.ochre, o: 0.9, d: sun },
    { c: PAL.rose, o: 0.3, d: 'M300 124L300 104L360 104L360 124Z' },
  ],
  lines: ['M14 266L388 266', win],
  fine: [sun, 'M330 50L330 124M300 92L360 92', zed(118, 96, 9), zed(138, 72, 12), zed(162, 42, 15), tiptoe(162), tiptoe(226), tiptoe(288), hatch(20, 274, 380, 274, 11, 6, 180, 15)],
  parts: [
    place(chair({ gap: 32 }), S),
    place(soldier({ sit: true, mood: 'peek', arms: S_ARMS.fold }), S),
    carrying(youngest({ mood: 'asleep', arms: P_ARMS.carry }), 'translate(178 266) scale(1.02)', 0.86),
    carrying(princess({ who: 'sister', dress: PAL.green, hair: PAL.slate, mood: 'asleep', arms: P_ARMS.carry }), 'translate(240 266) scale(0.98)', 1),
    carrying(princess({ who: 'eldest', mood: 'happy', look: -1, arms: P_ARMS.carry }), 'translate(302 266) scale(1.02)', 1),
    place(bedEnd({ quilt: PAL.rose, empty: true }), 'translate(366 266) scale(0.95)'),
  ],
});
