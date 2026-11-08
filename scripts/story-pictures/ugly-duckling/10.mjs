import { PAL, rng, transformPath, tufts } from '../lib.mjs';
import { child, compose, place, swan, swanCut } from './characters.mjs';

// The Ugly Duckling, 10: on the lake three white swans bow their heads to the young swan in the
// middle (the duckling, grown at last), and children wave from the bank.
const SWANS = [
  { neck: 'bow', t: 'translate(112 176) scale(0.72)' },
  { neck: 'bow', t: 'translate(78 254) scale(0.95)' },
  { neck: 'bow', t: 'translate(332 254) scale(-0.95 0.95)' },
  { neck: 'up', t: 'translate(208 230) scale(1.02)', young: true },
];
const bank = 'M0 106C80 100 180 106 260 102C320 99 370 104 400 101';
// an apple tree in blossom on the bank, as in the garden of picture 9
const crown = 'M10 62C10 26 74 26 74 62C80 86 4 86 10 62Z';
const trunk = 'M40 104L42 76M42 88L30 78M42 84L54 74';
const blossoms = (() => {
  const r = rng(10);
  let d = '';
  for (let i = 0; i < 14; i++) {
    const a = r() * Math.PI * 2;
    const k = Math.sqrt(r()) * 28;
    const [x, y] = [42 + Math.cos(a) * k, 58 + Math.sin(a) * k * 0.7];
    d += `M${(x - 3).toFixed(1)} ${y.toFixed(1)}a3 3 0 1 0 6 0a3 3 0 1 0 -6 0Z`;
  }
  return d;
})();

const ripple = (x, y, w) => `M${x - w} ${y + 5}C${x - w / 2} ${y + 9} ${x + w / 2} ${y + 9} ${x + w} ${y + 4}`;
const ripples = ripple(78, 254, 66) + ripple(332, 254, 66) + ripple(208, 230, 70) + ripple(112, 176, 50) + 'M150 280C170 284 200 284 220 280M290 196C310 198 330 198 350 194';

export default compose({
  title: 'The beautiful swan',
  seed: 80,
  washes: [
    { c: PAL.green, o: 0.5, d: 'M0 80C80 72 180 78 260 74C320 70 370 76 400 72L400 110C300 114 100 114 0 112Z' },
    { c: PAL.sky, o: 0.45, rule: 'evenodd', d: `M0 110C100 114 300 112 400 108L400 300L0 300Z${SWANS.map((s) => transformPath(swanCut(s.neck), s.t)).join('')}` },
  ],
  after: [
    { c: PAL.green, o: 0.35, d: crown },
    { c: PAL.rose, o: 0.45, d: crown },
    { c: PAL.terracotta, o: 0.6, d: 'M38 104L38 76L45 76L44 104Z' },
    { c: PAL.rose, o: 0.9, d: blossoms },
  ],
  lines: [bank, crown, trunk],
  fine: [ripples, tufts([[100, 104], [150, 104], [250, 103], [300, 102]], 9, 4)],
  parts: [
    ...SWANS.map((s) => place(swan({ neck: s.neck, young: s.young }), s.t)),
    place(child({ pose: 'wave' }), 'translate(330 105) scale(0.72)'),
    place(child({ pose: 'wave' }), 'translate(372 104) scale(-0.64 0.64)'),
  ],
});
