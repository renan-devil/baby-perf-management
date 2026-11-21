// See a puppet show: a little puppet theatre with red-and-white striped curtains drawn open, a
// scalloped top hung with bunting, and two hand puppets on the stage: a smiling fellow in a pointy hat
// and a friendly crocodile.
import { PAL, paths, transformPath } from '../story-pictures/lib.mjs';

const f = (n) => Math.round(n * 10) / 10;
const dot = (x, y, r, ry = r) => `M${f(x - r)} ${f(y)}a${r} ${ry} 0 1 0 ${f(2 * r)} 0a${r} ${ry} 0 1 0 ${f(-2 * r)} 0Z`;
const pt = (p) => `${f(p[0])} ${f(p[1])}`;

// The booth
const crest = 'M60 42C110 10 290 10 340 42Z';
const booth = 'M64 42L336 42L336 284L64 284Z';
const opening = 'M100 80L300 80L300 212L100 212Z';
const headerLine = 'M64 76L336 76';
const panelLines = 'M82 238L318 238L318 272L82 272Z';
const playboard = 'M86 208L314 208L316 224L84 224Z';
const star = (cx, cy, r) => {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const k = i % 2 ? r * 0.45 : r;
    d += `${i ? 'L' : 'M'}${f(cx + Math.cos(a) * k)} ${f(cy + Math.sin(a) * k)}`;
  }
  return `${d}Z`;
};
const stars = `${star(200, 255, 11)}${star(140, 255, 6)}${star(260, 255, 6)}${star(200, 27, 8)}`;

// Scalloped valance across the top of the stage
let valance = 'M96 70L304 70L304 84';
for (let i = 9; i > 0; i--) valance += `A11.6 9 0 0 1 ${f(96 + ((i - 1) * 208) / 9)} 84`;
valance += 'Z';

// Bunting strung across the header
const bez = (p, t) => {
  const u = 1 - t;
  return [0, 1].map((k) => u * u * u * p[0][k] + 3 * u * u * t * p[1][k] + 3 * u * t * t * p[2][k] + t * t * t * p[3][k]);
};
const stringPts = [[68, 46], [130, 64], [270, 64], [332, 46]];
const string = 'M68 46C130 64 270 64 332 46';
const flagColours = [PAL.red, PAL.ochre, PAL.green, PAL.sky];
const flags = [[], [], [], []];
for (let i = 0; i < 11; i++) {
  const t = 0.05 + i * 0.083;
  const a = bez(stringPts, t);
  const b = bez(stringPts, t + 0.058);
  flags[i % 4].push(`M${pt(a)}L${pt(b)}L${f((a[0] + b[0]) / 2)} ${f((a[1] + b[1]) / 2 + 11)}Z`);
}

// Curtains: each is gathered by a tie-back and drawn as folds, every other fold painted red.
const levels = [80, 116, 158, 186, 212];
const widths = [62, 40, 16, 24, 34];
const fold = (i, n, side) => levels.map((y, k) => [side < 0 ? 100 + (i / n) * widths[k] : 300 - (i / n) * widths[k], y]);
function curtain(side) {
  const n = 7;
  const red = [];
  let lines = '';
  for (let i = 0; i < n; i++) {
    const a = fold(i, n, side);
    const b = fold(i + 1, n, side);
    if (i % 2 === 0) red.push(`M${a.map(pt).join('L')}L${b.reverse().map(pt).join('L')}Z`);
    if (i > 0) lines += `M${a.map(pt).join('L')}`;
  }
  const outline = `M${side < 0 ? 100 : 300} 80L${fold(n, n, side).map(pt).join('L')}`;
  return { red: red.join(''), lines, outline };
}
const left = curtain(-1);
const right = curtain(1);
const tassel = 'M0 -6C6 -8 8 0 4 4L8 15L-4 15L-1 4C-6 0 -6 -6 0 -6Z';
const tassels = transformPath(tassel, 'translate(117 158)') + transformPath(tassel, 'translate(283 158) scale(-1 1)');

// The puppets are drawn small and placed on the stage.
const A = 'translate(-2 0) translate(200 104) scale(1.2) translate(-200 -84)';
const B = 'translate(0 0) translate(200 104) scale(1.2) translate(-200 -84)';
const inA = (d) => transformPath(d, A);
const inB = (d) => transformPath(d, B);

// The puppet in the pointy hat (left), waving
const head = dot(168, 130, 14);
const headLine = 'M155.9 123A14 14 0 1 0 180.1 123';
const hat = 'M152 119C158 108 165 98 174 88C178 98 182 106 186 117';
const hatShape = `${hat}Q168 125 152 119Z`;
const hatBrim = 'M150 118Q168 125 188 116';
const pompom = dot(175, 86, 4.5);
const hair = 'M155 134c-5 1 -6 7 -2 9M181 134c5 1 6 7 2 9';
const hairShape = 'M155 134c-5 1 -6 7 -2 9l4 -2ZM181 134c5 1 6 7 2 9l-4 -2Z';
const smile = 'M161 135Q168 142 176 135';
const ruff = 'M151 147l5 -5l4 5l4 -5l4 5l4 -5l4 5l4 -5l4 5l4 -5l2 3';
const tunic = 'M154 147C151 156 149 164 148 173M184 147C187 156 189 164 190 173';
const armL = 'M155 154C150 148 148 140 148 130M152 162C146 156 142 146 141 134';
const handL = dot(145, 126, 5);
const tunicShape = 'M154 147C151 156 149 164 148 174L190 174C189 164 187 156 184 147ZM155 154C150 148 148 140 148 130L141 134C142 146 146 156 152 162Z';

// The crocodile (right), smiling with its mouth open
const crocBody = 'M229 173C229 162 231 152 234 142M252 142C254 152 255 162 255 173';
const crocHead =
  'M258 142C262 128 260 116 252 110C252 102 244 98 238 102C234 98 226 100 226 108C218 110 204 112 196 114C190 115 188 122 192 126L238 132';
const crocJaw = 'M238 136L198 138C193 139 193 144 198 145C212 149 230 150 240 147C250 148 258 146 258 142';
const crocMouth = 'M192 126L238 132L238 136L198 138C194 138 191 132 192 126Z';
const teethTop = 'M196 126.6l2 4l2 -3.6l2 4l2 -3.6l2 4l2 -3.4l2 4l2 -3.2l2 4l2 -3';
const teethBottom = 'M201 137.8l2 -4l2 3.6l2 -4l2 3.6l2 -4l2 3.4l2 -4l2 3.2';
const crocEyes = `${dot(234, 106, 5.5)}${dot(247, 107, 5.5)}`;
const nostrils = 'M196 112q2 -3 5 -1M203 111q2 -3 5 -1';
const scales = 'M236 158q4 3 8 0M242 166q4 3 8 0M242 122q4 3 8 0M216 117q3 2 6 0';

export default {
  title: 'See a puppet show',
  seed: 227,
  washes: [
    { c: PAL.grey, o: 0.3, d: 'M50 286C100 278 300 278 350 286C330 296 70 296 50 286Z' },
    { c: PAL.sky, o: 0.62, d: `${booth}${opening}`, rule: 'evenodd' },
    { c: PAL.sky, o: 0.62, d: crest },
    { c: PAL.slate, o: 0.22, d: opening },
    { c: PAL.ochre, o: 0.85, d: `${playboard}${stars}` },
    { c: PAL.red, o: 0.85, d: valance },
    ...flags.map((list, i) => ({ c: flagColours[i], o: 0.85, d: list.join('') })),
    { c: PAL.red, o: 0.85, d: `${left.red}${right.red}` },
    { c: PAL.ochre, o: 0.9, d: tassels },
    // pointy-hat puppet
    { c: PAL.red, o: 0.85, d: inA(hatShape) },
    { c: PAL.ochre, o: 0.9, d: inA(`${pompom}${tunicShape}`) },
    { c: PAL.terracotta, o: 0.8, d: inA(hairShape) },
    { c: PAL.rose, o: 0.45, d: inA(`${head}${handL}`) },
    { c: PAL.rose, o: 0.8, d: inA(`${dot(159, 135, 3)}${dot(178, 135, 3)}`) },
    // crocodile
    { c: PAL.green, o: 0.88, d: inB(`${crocHead}Z${crocJaw}ZM229 174C229 162 231 152 234 142L252 142C254 152 255 162 255 174Z`) },
    { c: PAL.ochre, o: 0.4, d: inB('M231 173C231 164 233 156 236 148L244 152C241 160 239 166 239 173Z') },
    { c: PAL.red, o: 0.75, d: inB(crocMouth) },
  ],
  whites: `${inA(`M151 147l5 -5l4 5l4 -5l4 5l4 -5l4 5l4 -5l4 5l4 -5l2 3L185 150L151 150Z`)}${inB(`${crocEyes}${teethTop}${teethBottom}`)}`,
  lines:
    paths([crest, booth, opening, left.outline, right.outline, playboard, valance]) +
    paths([headLine, hat, hatBrim, tunic], A) +
    paths([crocBody, crocHead, crocJaw], B),
  fine:
    paths([headerLine, panelLines, stars, string, ...flags.flat(), left.lines, right.lines, tassels]) +
    paths([pompom, hair, smile, ruff, armL, handL], A) +
    paths([crocEyes, teethTop, teethBottom, nostrils, scales], B),
  fills: `<path d="${inA(`${dot(163, 128, 1.8)}${dot(173, 128, 1.8)}`)}${inB(`${dot(231.5, 107, 2.8)}${dot(244.5, 108, 2.8)}`)}"/>`,
  glints: `<path d="${inB(`${dot(230.8, 105.8, 0.9)}${dot(243.8, 106.8, 0.9)}`)}"/>`,
};
