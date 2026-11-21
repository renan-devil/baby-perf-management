import { PAL, hatch, paths, tufts } from '../story-pictures/lib.mjs';

// Sleep in a tent: a little tent in the grass at night, its door tied open on a warm torch glow.
const f1 = (n) => Math.round(n * 10) / 10;
const star = (x, y, s = 4) => `M${x - s} ${y}L${x + s} ${y}M${x} ${y - s}L${x} ${y + s}`;
const dot = (x, y, r = 1.6) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
/** A crescent moon of radius r around (cx, cy), lit side on the left. */
const crescent = (cx, cy, r) =>
  `M${f1(cx + r * 0.2)} ${f1(cy - r)}C${f1(cx - r * 0.95)} ${f1(cy - r * 0.7)} ${f1(cx - r * 0.95)} ${f1(cy + r * 0.7)} ${f1(cx + r * 0.2)} ${f1(cy + r)}C${f1(cx - r * 0.15)} ${f1(cy + r * 0.5)} ${f1(cx - r * 0.15)} ${f1(cy - r * 0.5)} ${f1(cx + r * 0.2)} ${f1(cy - r)}Z`;

const ground = 'M0 246C80 242 160 247 240 245C300 243 360 240 400 242';

// The tent, seen three-quarters on: a triangular front with a door, and its long side going back.
const front = 'M62 244L168 80L274 244';
const side = 'M168 80C218 84 268 89 318 96C340 140 362 182 384 224C348 231 310 238 274 244';
const seam = 'M172 86C220 92 268 98 312 104';
const pole = 'M168 80L167 60M167 60L186 65L168 71';
const ropes = 'M166 84C120 140 70 210 30 256M316 98C350 120 378 150 396 174';
const pegs = 'M26 252l8 8M392 170l6 8';

// The door, both flaps drawn back and tied
const door = 'M168 100C162 128 146 156 130 178C126 200 122 222 118 244L218 244C214 222 210 200 206 178C190 156 174 128 168 100Z';
const flaps = 'M164 104C150 132 132 158 114 178M126 184C118 204 108 224 102 244M172 104C186 132 204 158 222 178M210 184C218 204 228 224 234 244';
const ties = 'M114 176c6-2 14 0 18 4c-2 4-10 6-16 4M124 182l-6 9M128 183l1 9M222 176c-6-2-14 0-18 4c2 4 10 6 16 4M212 182l6 9M208 183l-1 9';

// Inside: a sleeping bag, and a torch lying on the floor, shining
const bag = 'M122 244C124 228 138 222 152 222C164 222 172 232 172 244';
const bagLines = 'M130 232C138 236 150 237 160 233M136 244C138 238 142 234 148 231';
const TORCH = 'translate(196 236) rotate(22) scale(1.2)';
const torch = 'M0 -5L24 -5L24 5L0 5ZM0 -5L-7 -9L-7 9L0 5';
const shine = 'M-12 -4l-9 -3M-12 3l-10 2M-10 -10l-6 -7M-10 10l-6 6M-6 -14l-1 -8';

// Sky outside the tent (the tent and its door stay out of the night wash)
const tentShape = 'M62 244L168 80L318 96L384 224L274 244Z';
const sky = 'M0 0L400 0L400 240C360 238 300 241 240 243C160 245 80 240 0 244Z';

export default {
  title: 'Sleep in a tent',
  seed: 601,
  washes: [
    { c: PAL.slate, o: 0.3, rule: 'evenodd', d: sky + tentShape },
    { c: PAL.green, o: 0.45, d: 'M0 242C80 238 160 243 240 241C300 239 360 236 400 238L400 300L0 300Z' },
    { c: PAL.slate, o: 0.18, d: 'M0 242C80 238 160 243 240 241C300 239 360 236 400 238L400 300L0 300Z' },
    { c: PAL.terracotta, o: 0.62, rule: 'evenodd', d: 'M62 244L168 80L274 244Z' + door },
    { c: PAL.terracotta, o: 0.7, d: 'M168 80L318 96L384 224L274 244Z' },
    { c: PAL.slate, o: 0.3, d: 'M170 84L316 98L382 224L276 242Z' },
    { c: PAL.ochre, o: 0.3, d: 'M168 112C150 140 110 190 96 244L240 244C226 190 186 140 168 112Z' },
    { c: PAL.ochre, o: 0.9, rule: 'evenodd', d: door + 'M122 244C124 228 138 222 152 222C164 222 172 232 172 244Z' },
    { c: PAL.ochre, o: 0.5, d: 'M92 256C108 244 140 240 168 240C200 240 232 244 246 256C224 268 192 272 168 272C140 272 108 268 92 256Z' },
    { c: PAL.sky, o: 0.8, d: 'M122 244C124 228 138 222 152 222C164 222 172 232 172 244Z' },
    { c: PAL.red, o: 0.7, t: TORCH, d: 'M0 -5L24 -5L24 5L0 5ZM0 -5L-7 -9L-7 9L0 5Z' },
    { c: PAL.red, o: 0.85, d: 'M167 61L186 65L168 71Z' },
    { c: PAL.ochre, o: 0.85, d: crescent(62, 58, 24) },
  ],
  lines: paths([ground, front, side, pole, door, flaps, bag]) + paths([torch], TORCH),
  fine:
    paths([shine], TORCH) +
    paths([
      seam,
      ropes,
      pegs,
      ties,
      bagLines,
      crescent(62, 58, 24),
      star(150, 30),
      star(250, 46, 3),
      star(340, 30, 4),
      star(374, 96, 3),
      star(112, 92, 3),
      hatch(286, 228, 368, 214, 7, 8, 64, 5),
      hatch(20, 276, 380, 280, 12, 6, 165, 8),
      tufts([[20, 246], [252, 246], [300, 242], [348, 240], [392, 242], [86, 268], [330, 282]], 9, 11),
    ]),
  fills: [dot(212, 22, 1.4), dot(300, 64, 1.3), dot(36, 120, 1.3), dot(386, 140, 1.2), dot(206, 60, 1.1)].map((d) => `<path d="${d}"/>`).join(''),
};
