import { PAL, hatch, rays } from '../lib.mjs';
import { compose, place, peterEars, tear } from './characters.mjs';

// The Tale of Peter Rabbit, 4: in the tool shed, Peter hides in a watering can full of water. Only his
// ears stick out, and he sneezes, "Kertyschoo!", with a splash. Flowerpots are stacked by the can.
const floor = 'M0 262C90 259 200 263 300 260C340 259 370 261 400 260';

// The shed's plank wall behind, and a shelf with one little pot
const planks = 'M40 60L40 130M40 170L40 258M110 40L110 110M300 30L300 100M300 150L300 256M370 50L370 140M370 180L370 258';
const shelf = 'M300 112L400 112M300 120L400 120M312 120L312 140L330 120';
const pot = (x, y, s = 1, flip = false) => {
  // upside down, the rim rests on the floor at y
  const P = (dx, dy) => `${x + dx * s} ${y + (flip ? -dy - 28 : dy) * s}`;
  return {
    body: `M${P(-11, -22)}L${P(11, -22)}L${P(8, 0)}L${P(-8, 0)}Z`,
    rim: `M${P(-13, -28)}L${P(13, -28)}L${P(13, -22)}L${P(-13, -22)}Z`,
  };
};
// flowerpots: one upside down on the floor with another standing on it, one beside them, one on the shelf
const POTS = [pot(60, 262, 1.4, true), pot(60, 223, 1.2), pot(104, 262, 1.2), pot(356, 112, 0.9)];
const potLines = POTS.map((p) => p.body + p.rim).join('');

// The watering can: a tall drum with an open top full of water, a side handle and a long spout
const drum = 'M140 152L140 252C140 264 264 264 264 252L264 152';
const rimTop = 'M140 152C140 140 264 140 264 152C264 164 140 164 140 152Z';
const water = 'M146 153C146 146 258 146 258 153C258 160 146 160 146 153Z';
const handle = 'M140 176C110 176 108 232 140 236M140 186C122 186 122 224 140 226';
const spout = 'M264 236L340 168M264 216L332 162';
const rose = 'M328 164L346 146L356 156L338 174Z';
const roseHoles = 'M340 154l2 2M345 150l2 2M348 158l2 2M343 162l2 2';
const bands = 'M140 200C140 210 264 210 264 200';
const dent = 'M176 228c4 6 10 8 16 6';

// The sneeze: a burst over the ears, ripples, flying drops
const burst = rays(204, 86, 56, 72, 11, 6, 12);
const ripples = 'M172 156c6 3 14 3 20 0M214 156c6 3 14 3 20 0';
const DROPS = [
  [138, 112, 8],
  [120, 138, 6],
  [270, 104, 8],
  [290, 132, 6],
  [252, 52, 6],
  [154, 56, 6],
];
const drops = DROPS.map(([x, y, h]) => tear(x, y, h)).join('');
const shake = 'M160 104l-8 -3M160 114l-9 0M248 104l8 -3M248 114l9 0';

export default compose({
  title: 'Peter hides in the watering can, and sneezes',
  seed: 84,
  washes: [
    { c: PAL.grey, o: 0.4, d: 'M0 258C90 255 200 259 300 256C340 255 370 257 400 256L400 300L0 300Z' },
    { c: PAL.ochre, o: 0.5, d: 'M300 112L400 112L400 120L300 120Z' },
    { c: PAL.terracotta, o: 0.75, d: potLines },
    { c: PAL.slate, o: 0.55, d: `${drum}Z${handle}Z${spout.replace('M264 216', 'L264 216')}Z${rose}` },
    { c: PAL.sky, o: 0.35, d: `${drum}Z` },
    { c: PAL.sky, o: 0.9, d: water },
    { c: PAL.sky, o: 0.9, d: drops },
  ],
  whites: 'M152 172C153 190 153 206 154 220L158 220C157 206 157 190 157 172Z',
  lines: [floor, drum, rimTop, handle, spout, rose, shelf, potLines],
  fine: [
    planks,
    roseHoles,
    bands,
    dent,
    burst,
    ripples,
    drops,
    shake,
    hatch(14, 280, 386, 282, 12, 6, 165, 3),
  ],
  parts: [place(peterEars({ ears: 0, spread: 26 }), 'translate(204 160) scale(2.1)')],
});
