import { PAL } from '../lib.mjs';
import { at, beetle, compose, place, thumbelina } from './characters.mjs';

// Thumbelina, 4: a big shiny beetle flies off with Thumbelina held tight in his front legs, high
// above the stream.
const BT = 'translate(144 138) rotate(-6) scale(1.36)';
const TH = 'translate(262 244) rotate(6) scale(1.22)';
// the front legs reach from the beetle's chest round Thumbelina's waist (in the beetle's own units)
const [wl, wy] = at(-17, -50, TH);
const [wr] = at(17, -50, TH);
const inv = (() => {
  const a = (6 * Math.PI) / 180;
  return ([x, y]) => {
    const [u, v] = [(x - 144) / 1.36, (y - 138) / 1.36];
    return [u * Math.cos(a) - v * Math.sin(a), u * Math.sin(a) + v * Math.cos(a)].map((n) => Math.round(n * 10) / 10);
  };
})();
const toBt = inv;
const [lx, ly] = toBt([wl, wy]);
const [rx, ry] = toBt([wr, wy]);
const front = `M28 18L46 30L${lx} ${ly}L${lx + 8} ${ly + 4}M18 24L36 46L${rx - 4} ${ry + 2}L${rx + 4} ${ry - 2}`;
const stream = 'M0 276C70 270 130 290 210 287C290 284 340 274 400 278L400 290C340 286 290 298 210 299C150 300 70 288 0 292Z';
const banks = 'M0 276C70 270 130 290 210 287C290 284 340 274 400 278';
const cloud = 'M300 64C296 52 310 44 320 50C326 40 344 42 346 54C358 54 360 68 348 70C334 72 312 72 304 70C296 70 294 66 300 64Z';
const whoosh = 'M40 92l-30 -4M44 112l-36 0M40 132l-28 4';

export default compose({
  title: 'The beetle carries her off',
  seed: 104,
  washes: [
    { c: PAL.sky, o: 0.6, d: stream },
    { c: PAL.green, o: 0.4, d: 'M0 268C70 262 130 282 210 279C290 276 340 266 400 270L400 278C340 274 290 284 210 287C130 290 70 270 0 276Z' },
    { c: PAL.sky, o: 0.25, d: cloud },
  ],
  lines: [banks, cloud],
  fine: [whoosh, 'M150 293q10 -3 20 0M300 285q10 -3 20 0', 'M258 256l-4 8M270 256l4 8'],
  parts: [
    place(beetle({ front }), BT),
    place(thumbelina({ arms: 'up', mood: 'wow' }), TH),
  ],
});
