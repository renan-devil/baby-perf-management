// Build a sandcastle: three towers with a red flag on top, a water moat, a red bucket and a spade.
import { PAL, hatch, paths, tufts } from '../story-pictures/lib.mjs';

// A crenellated top from x0 to x1 at height y: n merlons of height h with gaps between them.
function crenels(x0, x1, y, n, h) {
  const u = (x1 - x0) / (2 * n - 1);
  let d = `M${x0} ${y}`;
  for (let i = 0; i < n; i++) {
    const a = x0 + 2 * i * u;
    d += `L${a} ${y - h}L${a + u} ${y - h}L${a + u} ${y}`;
    if (i < n - 1) d += `L${a + 2 * u} ${y}`;
  }
  return d.replace(/(\d+\.\d)\d+/g, '$1');
}

// A tapered tower: sides from the bottom (width wb) up to the top (width wt), crenellated top.
function tower(cx, top, bottom, wt, wb, n, h) {
  const [l, r] = [cx - wt / 2, cx + wt / 2];
  return `M${cx - wb / 2} ${bottom}L${l} ${top}` + crenels(l, r, top, n, h).replace(/^M/, 'L') + `L${cx + wb / 2} ${bottom}`;
}

const leftTower = tower(103, 140, 238, 32, 40, 3, 12);
const rightTower = tower(217, 140, 238, 32, 40, 3, 12);
const wall = crenels(122, 198, 172, 4, 10);
// The tall middle tower stands behind the wall: its sides stop at the wall's top.
const topTower = 'M138 172L141 98' + crenels(141, 179, 98, 3, 12).replace(/^M/, 'L') + 'L182 172';
const base = 'M83 238C110 250 210 250 237 238';
const door = 'M149 245L149 228C149 212 171 212 171 228L171 245';
const windows =
  'M98 190L98 182C98 175 108 175 108 182L108 190ZM212 190L212 182C212 175 222 175 222 182L222 190ZM155 134L155 124C155 117 165 117 165 124L165 134Z';
const rings = 'M85 206C95 210 111 210 121 206M199 206C209 210 225 210 235 206M140 150C150 153 170 153 180 150';
const flag = 'M160 86L160 46M160 48C170 52 180 49 191 56C181 61 171 59 160 66';

// The moat: an oval of water around the castle (its back half is hidden behind the walls).
const moat = 'M83 214A118 32 0 0 0 42 238A118 32 0 0 0 278 238A118 32 0 0 0 237 214';
const bank = 'M34 250C50 270 100 282 160 282C220 282 268 272 284 254';
const ripples = 'M62 248q6-3 12 0M106 262q6-3 12 0M196 262q6-3 12 0M246 250q6-3 12 0M150 256q4-2 8 0';

// The castle and its moat are drawn around x = 160, then placed a little larger.
const C = 'translate(152 252) scale(1.08) translate(-160 -252)';

// The bucket, its handle flopped down in front.
const bucketRim = 'M288 214C288 206 344 206 344 214C344 222 288 222 288 214Z';
const bucket = 'M288 214L296 280C304 287 328 287 336 280L344 214';
const handle = 'M289 222C293 252 339 252 343 222';
const bucketBand = 'M291 236C302 241 330 241 341 236';

// The spade, drawn with its blade's top at (0,0) and the handle going up, then leant on the bucket.
const SP = 'translate(368 250) rotate(-26)';
const spadeHandle = 'M-2.5 -4L-2.5 -74M2.5 -4L2.5 -74M-10 -76L10 -76L10 -71L-10 -71Z';
const blade = 'M-12 0L12 0L13 22C13 31 6 35 0 37C-6 35 -13 31 -13 22ZM-4 0L-3 -6L3 -6L4 0';

export default {
  title: 'Build a sandcastle',
  seed: 257,
  washes: [
    // the beach
    { c: PAL.ochre, o: 0.3, d: 'M8 222C80 212 300 214 392 220L392 292C300 296 100 292 8 290Z' },
    // the castle in one piece, then its shady sides
    {
      c: PAL.ochre,
      o: 0.62,
      t: C,
      d: 'M86 128L120 128L124 238L82 238ZM200 128L234 128L238 238L196 238ZM120 164L200 164L200 244L120 244ZM141 86L179 86L182 174L138 174ZM82 236C110 252 210 252 238 236L238 240L82 240Z',
    },
    { c: PAL.terracotta, o: 0.28, t: C, d: 'M112 140L120 140L124 238L114 240ZM226 140L234 140L238 238L228 240ZM170 98L179 98L182 168L172 168Z' },
    { c: PAL.slate, o: 0.6, t: C, d: door + 'Z' + windows },
    // the moat
    { c: PAL.sky, o: 0.72, t: C, d: 'M84 214A118 32 0 0 0 42 238A118 32 0 0 0 278 238A118 32 0 0 0 236 214L236 238C210 250 110 250 84 238Z' },
    // the flag, the bucket, the spade
    { c: PAL.red, o: 0.85, t: C, d: 'M161 48C171 52 181 50 191 56C181 61 171 59 161 66Z' },
    { c: PAL.red, o: 0.75, d: 'M288 214C288 206 344 206 344 214L336 280C328 287 304 287 296 280Z' },
    { c: PAL.slate, o: 0.35, d: 'M290 214C292 208 340 208 342 214C340 220 292 220 290 214Z' },
    { c: PAL.green, o: 0.72, t: SP, d: 'M-12 0L12 0L13 22C13 31 6 35 0 37C-6 35 -13 31 -13 22Z' },
    { c: PAL.ochre, o: 0.55, t: SP, d: 'M-2.5 -4L2.5 -4L2.5 -74L-2.5 -74ZM-10 -76L10 -76L10 -71L-10 -71Z' },
  ],
  lines:
    paths([leftTower, rightTower, wall, topTower, base, door, flag, moat], C) +
    paths([bucketRim, bucket, handle]) +
    paths([spadeHandle, blade], SP),
  fine:
    paths(
      [
        windows,
        rings,
        ripples,
        bank,
        // grains of sand on the castle
        'M94 160l1 1M112 222l1 1M100 214l1 1M208 164l1 1M226 222l1 1M214 226l1 1M132 196l1 1M188 204l1 1M146 182l1 1M178 226l1 1M156 110l1 1M168 158l1 1M134 230l1 1M192 236l1 1',
      ],
      C,
    ) +
    paths([
    bucketBand,
    hatch(18, 284, 60, 288, 4, 6, 160, 6),
    hatch(240, 290, 300, 292, 4, 6, 160, 7),
    'M24 230l2 1M300 296l2 1M374 228l2 1M14 262l2 1',
    tufts([[20, 224], [382, 224]], 8, 4),
    ]),
};
