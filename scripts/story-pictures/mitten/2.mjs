import { PAL, hatch } from '../lib.mjs';
import { compose, frog, mitten, mittenInfo, mouseHead, place } from './characters.mjs';

// The Mitten, 2: the red mitten lies in the snow and Squeaky Mouse peeks out of it, her paws on the
// cuff, while Froggy Frog comes hopping up through the snow to ask if he can come in.
const MT = 'translate(150 240) scale(1.8)';
const { cx1, cy } = mittenInfo(0);
const [ox, oy] = [150 + cx1 * 1.8, 240 + cy * 1.8]; // the opening of the mitten

const snow = 'M0 172C20 170 34 171 46 172M300 174C340 170 370 172 400 168';
const shade = 'M60 246C100 234 220 232 280 242C230 254 110 256 60 246Z' + 'M0 174C20 172 34 173 46 174L46 184C30 186 14 186 0 186ZM300 176C340 172 370 174 400 170L400 182C370 184 330 186 300 188Z' + 'M300 262C330 256 370 256 396 262C370 268 330 268 300 262Z';
// two small snowy firs far away
const firs = 'M336 172L346 146L356 172M341 160L351 160M366 171L373 154L380 171';
const firFill = 'M336 172L346 146L356 172ZM366 171L373 154L380 171Z';
// the frog's hops: a dotted arc over the snow behind him
const hops = [[398, 258], [396, 250]].map(([x, y]) => `M${x} ${y}l1.5 0`).join('');
const flakes = [[40, 40], [130, 30], [220, 60], [300, 26], [370, 70], [90, 110], [340, 140], [200, 120]].map(([x, y]) => `M${x - 2.5} ${y}l5 0M${x} ${y - 2.5}l0 5`).join('');

export default compose({
  title: 'Who lives in the mitten?',
  seed: 62,
  washes: [
    { c: PAL.sky, o: 0.3, d: shade },
    { c: PAL.green, o: 0.5, d: firFill },
  ],
  lines: [snow],
  fine: [firs, hatch(300, 268, 380, 266, 5, 6, 170, 3), hatch(20, 262, 90, 266, 4, 6, 170, 8), 'M380 262l-5 -2M384 270l-6 2M392 264l-1 -6'],
  once: hops + flakes,
  parts: [place(mitten({ fat: 0 }), MT), place(mouseHead(), `translate(${ox + 12} ${oy - 4}) scale(2.3)`), place(frog(), 'translate(338 240) scale(-1.7 1.7) rotate(-26)')],
});
