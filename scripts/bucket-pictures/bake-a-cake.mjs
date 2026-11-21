import { PAL, hatch, paths } from '../story-pictures/lib.mjs';

// Bake a cake: a pink-iced layer cake with a cherry on its stand, the mixing bowl and spoon, and a cracked egg.
const f1 = (n) => Math.round(n * 10) / 10;
const dot = (x, y, r = 1.6) => `M${f1(x - r)} ${f1(y)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
const ellipse = (cx, cy, rx, ry) => `M${cx - rx} ${cy}C${cx - rx} ${f1(cy - ry * 1.33)} ${cx + rx} ${f1(cy - ry * 1.33)} ${cx + rx} ${cy}C${cx + rx} ${f1(cy + ry * 1.33)} ${cx - rx} ${f1(cy + ry * 1.33)} ${cx - rx} ${cy}Z`;

const table = 'M0 258C130 256 270 259 400 257';

// The cake stand
// (the back of the plate is hidden behind the cake)
const plate = 'M72 192C62 193 52 197 52 204C52 219 244 219 244 204C244 197 234 193 224 192';
const plateShape = 'M52 204C52 197 62 193 72 192L72 198C72 212 224 212 224 198L224 192C234 193 244 197 244 204C244 219 52 219 52 204Z';
const stem = 'M138 214C140 226 140 238 130 248M158 214C156 226 156 238 166 248';
const foot = 'M112 252C112 244 184 244 184 252C184 258 112 258 112 252Z';

// The cake: two sponges with jam between, pink icing on top dripping down the sides
const [cx, top, bottom, rx, ry] = [148, 114, 198, 76, 14];
const front = (x) => top + ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2)); // front edge of the top
const topEdge = `M${cx - rx + 4} ${top + 2}C${cx - rx + 10} ${top + ry + 4} ${cx + rx - 10} ${top + ry + 4} ${cx + rx - 4} ${top + 2}`;
const cakeSides = `M${cx - rx} ${top}L${cx - rx} ${bottom}C${cx - rx} ${bottom + 14} ${cx + rx} ${bottom + 14} ${cx + rx} ${bottom}L${cx + rx} ${top}`;
const jam = `M${cx - rx} 156C${cx - rx + 8} 172 ${cx + rx - 8} 172 ${cx + rx} 156M${cx - rx} 162C${cx - rx + 8} 178 ${cx + rx - 8} 178 ${cx + rx} 162`;
const drips = [
  [84, 16],
  [104, 9],
  [124, 24],
  [148, 13],
  [170, 27],
  [192, 11],
  [210, 19],
];
// the dripping lower edge of the icing, from left to right
let icingEdge = '';
for (const [x, d] of drips) {
  const y = f1(front(x) + 5);
  icingEdge += `C${x - 12} ${y} ${x - 7} ${y} ${x - 6} ${y}C${x - 6} ${f1(y + d + 6)} ${x + 6} ${f1(y + d + 6)} ${x + 6} ${y}`;
}
icingEdge += `C${cx + rx - 4} ${f1(front(cx + rx - 4) + 5)} ${cx + rx + 2} ${f1(front(cx + rx) + 10)} ${cx + rx + 2} ${f1(front(cx + rx) + 10)}`;
const edgeStart = `${cx - rx - 2} ${f1(front(cx - rx) + 10)}`;
const icingShape = `M${cx - rx - 2} ${top}L${edgeStart}${icingEdge}L${cx + rx + 2} ${top}C${cx + rx + 2} ${f1(top - ry * 1.4)} ${cx - rx - 2} ${f1(top - ry * 1.4)} ${cx - rx - 2} ${top}Z`;
// the sponge shows below the icing
const sponge = `M${edgeStart}${icingEdge}L${cx + rx} ${bottom}C${cx + rx} ${bottom + 14} ${cx - rx} ${bottom + 14} ${cx - rx} ${bottom}Z`;
const crumbs = 'M90 182l4 -1M120 190l3 1M178 186l4 0M206 178l3 2M100 140l3 0M196 146l3 -1';
const sprinkles = 'M118 106l6 -2M134 116l5 2M164 104l6 1M180 114l5 -3M126 98l4 3M176 96l-4 3';

// The cherry on top
const cherry = 'M141 96C141 86 158 86 158 96C158 106 141 106 141 96Z';
const cherryStem = 'M151 87C152 76 158 68 166 64M160 70C166 64 174 66 176 70C170 74 164 74 160 70Z';

// The mixing bowl with batter and a wooden spoon in it
const rim = ellipse(318, 194, 62, 12);
const batter = 'M264 196C268 188 300 186 318 186C340 186 368 188 372 196C366 202 340 205 318 205C296 205 270 202 264 196Z';
const bowl = 'M256 196C258 232 284 256 318 256C352 256 378 232 380 196';
const bands = 'M262 222C288 236 348 236 374 222M266 230C292 244 344 244 370 230';
const spoon = 'M302 194L360 106C362 100 372 102 370 110L314 198';
const batterOnSpoon = 'M318 172C322 178 320 184 316 186';

// A cracked eggshell, one half standing up, the other on its side
const EGG = 'translate(-60 -66) scale(1.26)';
const shellA = 'M198 238l5 -6l4 5l5 -7l5 6l4 -5l5 6C226 252 220 258 212 258C204 258 198 250 198 238Z';
const shellB = 'M232 252C226 242 230 230 242 228C252 226 260 236 258 246l-6 -1l3 6l-7 0l3 5l-8 -2Z';

export default {
  title: 'Bake a cake',
  seed: 641,
  washes: [
    { c: PAL.ochre, o: 0.32, d: 'M0 256C130 254 270 257 400 255L400 300L0 300Z' },
    { c: PAL.sky, o: 0.55, d: plateShape + foot + 'M138 214C140 226 140 238 130 248L166 248C156 238 156 226 158 214Z' },
    { c: PAL.ochre, o: 0.6, d: sponge },
    { c: PAL.red, o: 0.75, d: `M${cx - rx} 156C${cx - rx + 8} 172 ${cx + rx - 8} 172 ${cx + rx} 156L${cx + rx} 162C${cx + rx - 8} 178 ${cx - rx + 8} 178 ${cx - rx} 162Z` },
    { c: PAL.rose, o: 0.75, d: icingShape },
    { c: PAL.red, o: 0.92, d: cherry },
    { c: PAL.green, o: 0.75, d: 'M160 70C166 64 174 66 176 70C170 74 164 74 160 70Z' },
    { c: PAL.terracotta, o: 0.55, d: `${bowl}C378 182 258 182 256 196Z` },
    { c: PAL.ochre, o: 0.75, d: batter },
    { c: PAL.ochre, o: 0.6, d: 'M302 194L360 106C362 100 372 102 370 110L314 198Z' },
    { c: PAL.terracotta, o: 0.4, d: 'M302 194L360 106C362 100 372 102 370 110L314 198Z' },
    { c: PAL.terracotta, o: 0.32, t: EGG, d: shellA + shellB },
    { c: PAL.sky, o: 0.8, d: 'M116 104l7 -2l1 3l-7 2ZM163 103l6 1l-1 3l-6 -1ZM180 113l5 -3l2 2l-5 3Z' },
    { c: PAL.green, o: 0.8, d: 'M134 115l5 2l-1 3l-5 -2ZM176 95l-4 3l2 2l4 -3Z' },
    { c: PAL.ochre, o: 0.9, d: 'M126 97l4 3l-2 2l-4 -3Z' },
  ],
  whites: 'M262 222C288 236 348 236 374 222L370 230C344 244 292 244 266 230Z',
  lines: paths([table, plate, stem, foot, cakeSides, icingShape, cherry, rim, bowl, spoon]) + paths([shellA, shellB], EGG),
  fine: paths([
    jam,
    topEdge,
    crumbs,
    sprinkles,
    cherryStem,
    'M150 90c2 -2 4 -2 5 0',
    batter,
    bands,
    batterOnSpoon,
    hatch(20, 276, 380, 280, 10, 7, 168, 21),
  ]) + paths(['M206 246l3 -2M244 238l4 2'], EGG),
  glints: `<path d="${dot(146, 92, 2)}"/>`,
};
