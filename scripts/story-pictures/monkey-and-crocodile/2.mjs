import { PAL, hatch, tufts } from '../lib.mjs';
import { BRANCH_SEAT, M_POSE, at, compose, fruit, handOf, monkey, place, ripple, swimCroc, tree } from './characters.mjs';

// The Monkey and the Crocodile, 2: the monkey sits on a long branch of his rose-apple tree and drops
// rose-apples, plop, plop, plop, to his new friend the crocodile, who smiles up from the water.
const TT = 'translate(90 234) scale(0.9)';
const seat = at(BRANCH_SEAT[0], BRANCH_SEAT[1], TT);
const MT = `translate(${seat[0]} ${seat[1] + 1}) scale(1.3)`;
const hand = at(...handOf(M_POSE.drop, 1), MT);
// his open, smiling mouth (head point 40, 2, the head turned up 24 degrees) waits under the fruit
const CS = 0.92;
const CY = 250;
const mouthDx = CS * (40 * Math.cos(0.419) + 2 * Math.sin(0.419));
const CT = `translate(${Math.round(hand[0] + 4 + mouthDx)} ${CY}) scale(${-CS} ${CS})`;

// the bank under the tree, and the river
const bank = 'M0 232C40 230 90 232 130 236C150 238 160 246 166 256C172 268 170 284 176 300';
const bankFill = 'M0 232C40 230 90 232 130 236C150 238 160 246 166 256C172 268 170 284 176 300L0 300Z';
const river = 'M130 212C200 208 300 212 400 208L400 300L176 300C170 284 172 268 166 256C160 246 150 238 130 236Z';
// rose-apples falling from his hand towards the crocodile's smile
const mouthY = CY + CS * (-40 * Math.sin(0.419) + 2 * Math.cos(0.419));
const drops = [0, 1, 2].map((i) => {
  const y0 = hand[1] + 12;
  const y1 = mouthY - 5;
  return [Math.round((hand[0] + 1 + i * 1.5) * 10) / 10, Math.round((y0 + ((y1 - y0) * i) / 2) * 10) / 10, 1.6];
});
const motion = drops.slice(1).map(([x, y]) => `M${x - 3} ${y - 9}l0 -6M${x + 3} ${y - 9}l0 -6`).join('');

export default compose({
  title: 'Rose-apples for the crocodile',
  seed: 702,
  washes: [
    { c: PAL.sky, o: 0.5, d: river },
    { c: PAL.green, o: 0.4, d: bankFill },
  ],
  lines: [bank],
  fine: [
    motion,
    ripple(196, 232, 22),
    ripple(366, 228, 22),
    ripple(220, 280, 26),
    ripple(340, 282, 24),
    ripple(390, 262, 18),
    'M196 260C206 263 220 263 230 260M268 262C282 265 296 264 306 261',
    hatch(10, 262, 130, 262, 9, 6, 160, 4),
    tufts([[20, 232], [120, 236], [150, 246]], 9, 6),
  ],
  parts: [
    place(tree({ branch: true }), TT),
    place(swimCroc({ mood: 'talk', head: 'rotate(-24)', look: [1.2, -1.4], short: true }), CT),
    place(monkey({ mood: 'happy', pose: M_POSE.drop }), MT),
    ...drops.map(([x, y, s]) => place(fruit(s), `translate(${x} ${y})`)),
  ],
});
