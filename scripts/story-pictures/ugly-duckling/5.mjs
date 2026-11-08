import { PAL, hatch, transformPath } from '../lib.mjs';
import { compose, duckling, hen, limb, place } from './characters.mjs';

// The Ugly Duckling, 5: in a little cottage, the cat with a curly tail and the fat hen look the
// duckling over, as if to say: can you purr? can you lay eggs?

// The cat (sitting, feet at 0,0, facing right), drawn here once
const cBody = 'M-22 0C-30 -20 -26 -50 -10 -60C0 -66 14 -62 18 -50C24 -32 26 -12 20 0Z';
const cHead = 'M-14 -62C-18 -78 -10 -90 4 -90C16 -90 24 -80 22 -68C20 -58 10 -54 2 -55C-6 -56 -12 -58 -14 -62Z';
const cEars = 'M-10 -84L-13 -101L-1 -89ZM10 -89L19 -101L20 -82Z';
const cLegs = 'M2 -38L3 -2M12 -38L12 -2M-2 0C-2 -4 7 -4 8 0M8 0C8 -4 17 -4 18 0';
const cTail = limb([[-18, -4, 9], [-36, -4, 8], [-50, -14, 7], [-50, -32, 6], [-38, -38, 5], [-30, -30, 4]]);
const cEyes = 'M1 -74C3 -78 8 -78 10 -74C8 -70 3 -70 1 -74ZM12 -74C14 -78 19 -78 21 -74C19 -70 14 -70 12 -74Z';
const cFace = 'M14 -66l3 3l3 -3M17 -63l0 3M17 -60c-2 2 -4 2 -6 0M17 -60c2 2 4 2 6 0M22 -65l12 -3M22 -62l12 1M0 -66l-10 -2M0 -63l-10 1M-2 -82q4 -3 8 -1M12 -83q4 -2 8 1';
const cStripes = 'M-20 -30l8 2M-22 -18l9 1M-18 -42l7 3M-46 -22l6 2M-44 -32l6 -1';
const CT = 'translate(84 250) scale(1.45)';

// a hand-drawn question mark (a mark, not a letter of text), top-left at 0,0
const ask = 'M0 6C0 -2 12 -2 12 6C12 12 6 12 6 19M6 25l0 1';

const window = 'M168 54L232 52L234 118L170 120ZM201 53L202 119M169 87L233 85';
const sill = 'M162 122L240 120';
const floor = 'M0 236C100 233 300 237 400 234';
const boards = 'M60 236L30 300M150 235L140 300M250 235L262 300M340 235L372 300';
const rug = 'M140 254C140 240 270 240 270 254C270 268 140 268 140 254Z';

export default compose({
  title: 'Can you purr? Can you lay eggs?',
  seed: 75,
  washes: [
    { c: PAL.ochre, o: 0.22, d: 'M0 0L400 0L400 236C300 237 100 233 0 236Z' },
    { c: PAL.sky, o: 0.55, d: 'M172 56L230 54L232 116L172 118Z' },
    { c: PAL.terracotta, o: 0.35, d: 'M0 236C100 233 300 237 400 234L400 300L0 300Z' },
    { c: PAL.red, o: 0.4, d: rug },
    { c: PAL.slate, o: 0.75, d: transformPath(`${cBody}${cHead}${cEars}${cTail}Z`, CT) },
    { c: PAL.ochre, o: 0.9, d: transformPath(cEyes, CT) },
    { c: PAL.rose, o: 0.7, d: transformPath('M14 -66l3 3l3 -3Z', CT) },
  ],
  lines: [floor, window, ...[cBody, cHead, cEars, cTail].map((d) => transformPath(d, CT))],
  fine: [
    sill,
    boards,
    rug,
    transformPath(ask, 'translate(150 74) rotate(-10)'),
    transformPath(ask, 'translate(268 84) rotate(10)'),
    ...[cLegs, cEyes, cFace, cStripes].map((d) => transformPath(d, CT)),
    hatch(150, 252, 260, 252, 6, 6, 90, 3),
  ],
  fills: `<path d="${transformPath('M7 -77L8 -74L7 -71L6 -74Z', CT)}"/><path d="${transformPath('M18 -77L19 -74L18 -71L17 -74Z', CT)}"/>`,
  parts: [
    place(duckling({ head: 6, legs: true }), 'translate(206 226) scale(-1.4 1.4)'),
    place(hen(), 'translate(324 252) scale(-1.45 1.45)'),
  ],
});
