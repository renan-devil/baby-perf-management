import { PAL, hatch } from '../lib.mjs';
import { bear, beetle, boarHead, compose, foxTail, hareEars, limb, limbFill, mitten, mittenInfo, mouseHead, oval, place } from './characters.mjs';

// The Mitten, 4: six friends are squashed inside and the mitten is stretched as tight as a drum, with
// ears, snouts, tails and paws poking out all over. Big Brown Bear pushes his nose into the cuff to
// squeeze in too, and the tiny Beetle is already on her way across the snow.
const k = 1.45;
const [mx, my] = [150, 258];
const MT = `translate(${mx} ${my}) scale(${k})`;
const { W, H, cy, cx1 } = mittenInfo(1);
const ex = (34 - W) / 2;
const rx = (34 + W) / 2 + 4;
const ry = H / 2;
/** A point on the edge of the mitten at angle deg (0 = right, -90 = top), in picture coordinates. */
const edge = (deg, out = 1) => {
  const a = (deg * Math.PI) / 180;
  return [Math.round(mx + (ex + Math.cos(a) * rx * out) * k), Math.round(my + (cy + Math.sin(a) * ry * out) * k)];
};
const ox = mx + cx1 * k;

// little dark holes in the knitting where things poke out
const [lx, ly] = edge(180, 0.96);
const [ux, uy] = edge(-148, 0.95);
const [bx, by] = edge(146, 0.95);
const [tx, ty] = edge(68, 0.94);
const holes = `${oval(lx, ly, 6, 9)}${oval(ux, uy, 7, 6)}${oval(bx, by, 6, 5)}${oval(tx, ty, 7, 5)}`;
// Froggy Frog's back foot, sticking out at the bottom left
const leg = [[bx, by, 8], [bx - 14, by + 6, 6], [bx - 24, by + 14, 4.5]];
const foot = `M${bx - 23} ${by + 11}L${bx - 34} ${by + 13}L${bx - 33} ${by + 20}L${bx - 22} ${by + 18}Z`;

const shade = 'M30 262C90 250 260 248 380 262C260 274 100 276 30 262Z';
const flakes = [[30, 30], [230, 22], [300, 60], [380, 34], [26, 110], [370, 120]].map(([x, y]) => `M${x - 2} ${y}l4 0M${x} ${y - 2}l0 4`).join('');

export default compose({
  title: 'Big Brown Bear squeezes in',
  seed: 64,
  washes: [
    { c: PAL.sky, o: 0.3, d: shade },
    { c: PAL.green, o: 0.78, d: `${limbFill(leg)}${foot}` },
  ],
  after: [{ c: PAL.ink, o: 0.6, d: holes }],
  lines: [limb(leg), foot],
  fine: [
    holes,
    // the bear's huffing and the effort lines behind him
    'M352 112q6 -4 12 0M358 102q6 -4 12 0',
    'M372 190l10 -2M374 202l10 1M370 214l9 4',
    hatch(250, 282, 360, 284, 5, 6, 170, 3),
    hatch(20, 280, 80, 284, 3, 6, 170, 9),
  ],
  once: flakes,
  parts: [
    place(mitten({ fat: 1, creak: true, seed: 9 }), MT),
    place(hareEars(), `translate(${mx - 13 * k} ${my - 128 * k}) rotate(-8) scale(1.4)`),
    place(boarHead(), `translate(${lx + 6} ${ly + 6}) scale(-1.25 1.25)`),
    place(mouseHead(), `translate(${ux - 2} ${uy}) rotate(-12) scale(-1.5 1.5)`),
    place(foxTail(), `translate(${tx} ${ty}) rotate(4) scale(1.35)`),
    place(bear({ mood: 'push' }), `translate(${ox + 100} 266) scale(-1.06 1.06) rotate(12)`),
    place(beetle(), 'translate(384 276) scale(-1.2 1.2)'),
  ],
});
