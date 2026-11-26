import { PAL } from '../lib.mjs';
import { compose, dick, place } from './1.mjs';

// Dick Whittington, 2: Dick has arrived in London. He stands in the street and looks down, puzzled:
// no gold at all, only brown, squelchy mud up to his ankles. Two old house fronts behind him and a
// cartwheel leaning by the door.
const street = 'M10 214C120 211 280 212 390 214';

// a narrow timbered house, bottom left at (0,0), w wide and h tall to the eaves
function house(w, h, roof = 'left') {
  const wall = `M0 0L0 ${-h}L${w} ${-h}L${w} 0`;
  const r = roof === 'left' ? `M-6 ${-h}L${w * 0.45} ${-h - 34}L${w + 6} ${-h}Z` : `M-6 ${-h}L${w * 0.55} ${-h - 34}L${w + 6} ${-h}Z`;
  const beams = `M0 ${-h * 0.5}L${w} ${-h * 0.5}M${w * 0.5} ${-h}L${w * 0.5} ${-h * 0.5}M0 ${-h}L${w * 0.5} ${-h * 0.5}L${w} ${-h}`;
  const win = `M${w * 0.18} ${-h * 0.36}L${w * 0.42} ${-h * 0.36}L${w * 0.42} ${-h * 0.16}L${w * 0.18} ${-h * 0.16}Z`;
  const door = `M${w * 0.56} 0L${w * 0.56} ${-h * 0.38}C${w * 0.6} ${-h * 0.44} ${w * 0.8} ${-h * 0.44} ${w * 0.84} ${-h * 0.38}L${w * 0.84} 0`;
  return {
    lines: [wall, r],
    fine: [beams, win, door, `M${w * 0.3} ${-h * 0.36}L${w * 0.3} ${-h * 0.16}`],
    washes: [
      { c: PAL.ochre, o: 0.35, d: `${wall}Z` },
      { c: PAL.terracotta, o: 0.7, d: r },
      { c: PAL.sky, o: 0.6, d: win },
      { c: PAL.terracotta, o: 0.45, d: `${door}Z` },
      { c: PAL.grey, o: 0.4, d: `${door}Z` },
    ],
  };
}

function wheel() {
  const rim = 'M-26 0C-26 -15 -15 -26 0 -26C15 -26 26 -15 26 0C26 15 15 26 0 26C-15 26 -26 15 -26 0Z';
  const inner = 'M-21 0C-21 -12 -12 -21 0 -21C12 -21 21 -12 21 0C21 12 12 21 0 21C-12 21 -21 12 -21 0Z';
  let spokes = '';
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    spokes += `M${(Math.cos(a) * 4).toFixed(1)} ${(Math.sin(a) * 4).toFixed(1)}L${(Math.cos(a) * 21).toFixed(1)} ${(Math.sin(a) * 21).toFixed(1)}`;
  }
  return {
    lines: [rim],
    fine: [inner, spokes, 'M-4 0C-4 -2 -2 -4 0 -4C2 -4 4 -2 4 0C4 2 2 4 0 4C-2 4 -4 2 -4 0Z'],
    washes: [{ c: PAL.ochre, o: 0.6, d: `${rim}${inner}`, rule: 'evenodd' }, { c: PAL.terracotta, o: 0.4, d: `${rim}${inner}`, rule: 'evenodd' }],
  };
}

const mud = 'M24 216C110 213 290 213 376 216C390 230 382 248 390 260C382 274 340 282 280 280C200 286 120 284 60 278C30 274 20 262 26 250C18 238 20 226 24 216Z';
const puddles = 'M120 262C120 254 160 250 190 252C200 258 170 266 140 268C128 268 120 266 120 262ZM250 270C256 264 300 262 320 266C326 272 296 276 270 276C256 276 248 274 250 270Z';
const ankles = 'M174 254C170 246 180 240 190 242C196 238 206 240 208 246C210 252 204 256 196 256C188 258 178 258 174 254Z' +
  'M212 254C210 246 220 240 230 242C236 238 246 240 248 246C250 252 244 256 236 256C228 258 216 258 212 254Z';
const D = 'translate(211 254) scale(1.5)';

export default compose({
  title: 'No gold, only mud',
  seed: 223,
  washes: [
    { c: PAL.terracotta, o: 0.65, d: mud },
    { c: PAL.grey, o: 0.55, d: mud },
    { c: PAL.ink, o: 0.1, d: mud },
    { c: PAL.terracotta, o: 0.5, d: puddles },
    { c: PAL.ink, o: 0.15, d: puddles },
  ],
  after: [
    { c: PAL.terracotta, o: 0.85, d: ankles },
    { c: PAL.grey, o: 0.6, d: ankles },
  ],
  lines: [street, 'M174 254C170 246 180 240 190 242C196 238 206 240 208 246', 'M212 254C210 246 220 240 230 242C236 238 246 240 248 246'],
  fine: [
    // mud splashes on his shins
    'M190 226l2 4M196 232l-1 3M228 228l-2 4M234 222l1 3',
    'M40 240c8 -3 16 -3 22 0M330 236c8 -3 16 -3 22 0M70 270c6 -2 12 -2 18 0M350 262c6 -2 10 -2 14 0M100 230c6 -2 10 -2 14 0',
    // squelch splashes
    'M166 236l-6 -8M160 244l-9 -3M256 236l6 -8M262 244l9 -3M170 228l-2 -6M252 228l2 -6',
  ],
  fills: '<path d="M150 238a2.5 2 0 1 0 5 0a2.5 2 0 1 0 -5 0ZM272 240a2.5 2 0 1 0 5 0a2.5 2 0 1 0 -5 0ZM160 226a2 1.6 0 1 0 4 0a2 1.6 0 1 0 -4 0Z"/>',
  parts: [
    place(house(70, 120), 'translate(14 214)'),
    place(house(66, 104, 'right'), 'translate(318 214)'),
    place(wheel(), 'translate(108 188) scale(1)'),
    place(
      dick({
        mood: 'puzzled',
        tilt: 10,
        look: [0.6, 1.6],
        feet: false,
        arms: [
          [[-17, -40, 8], [-27, -30, 7.5], [-37, -26, 7.5], [-44, -30, 7.5]],
          [[17, -40, 8], [27, -30, 7.5], [37, -26, 7.5], [44, -30, 7.5]],
        ],
      }),
      D,
    ),
  ],
});
