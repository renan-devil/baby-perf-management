import { PAL, transformPath } from '../lib.mjs';

// The Fox and the Crow: the two characters shared by both pictures, drawn once here and placed in
// each picture with a transform (place). The build only draws files named <n>.mjs, so this file is
// not a picture. Both characters face right with their feet at y = 0; flip with scale(-1 1).

const f = (n) => Math.round(n * 10) / 10;

/** A round dot (eye, pupil, glint, cheese hole) as path data. */
export const dot = (x, y, r, ry = r) => `M${f(x - r)} ${f(y)}a${r} ${ry} 0 1 0 ${f(2 * r)} 0a${r} ${ry} 0 1 0 ${f(-2 * r)} 0Z`;

/** A smooth limb (leg, tail) along a centreline of [x, y, width] points, open at the root. */
export function limb(pts) {
  const n = pts.length;
  const side = (s) =>
    pts.map(([x, y, w], i) => {
      const a = pts[Math.max(0, i - 1)];
      const b = pts[Math.min(n - 1, i + 1)];
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
      return [x - (s * (b[1] - a[1]) * w) / 2 / l, y + (s * (b[0] - a[0]) * w) / 2 / l];
    });
  const curve = (P) =>
    P.slice(1)
      .map((p2, j) => {
        const p0 = P[Math.max(0, j - 1)];
        const p1 = P[j];
        const p3 = P[Math.min(P.length - 1, j + 2)];
        return `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
      })
      .join('');
  const L = side(1);
  const R = side(-1).reverse();
  const [ex, ey, ew] = pts[n - 1];
  const [px, py] = pts[n - 2];
  const k = (ew * 0.66) / Math.hypot(ex - px, ey - py);
  const cap = `C${f(L[n - 1][0] + (ex - px) * k)} ${f(L[n - 1][1] + (ey - py) * k)} ${f(R[0][0] + (ex - px) * k)} ${f(R[0][1] + (ey - py) * k)} ${f(R[0][0])} ${f(R[0][1])}`;
  return `M${f(L[0][0])} ${f(L[0][1])}${curve(L)}${cap}${curve(R)}`;
}

// A character: { lines: [d], fine: [d], washes: [{c, o, d}], whites: [d], fills: [d], glints: [d] }.
const tr = (d, t) => (t ? transformPath(d, t) : d);

/** Places a character with an SVG transform string (applied to the coordinates themselves). */
export function place(ch, t) {
  return {
    lines: (ch.lines ?? []).map((d) => tr(d, t)),
    fine: (ch.fine ?? []).map((d) => tr(d, t)),
    washes: (ch.washes ?? []).map((w) => ({ ...w, d: tr(w.d, t) })),
    whites: (ch.whites ?? []).map((d) => tr(d, t)),
    fills: (ch.fills ?? []).map((d) => tr(d, t)),
    glints: (ch.glints ?? []).map((d) => tr(d, t)),
  };
}

/** Joins placed characters with the scene's own shapes into the drawing that svg() takes. */
export function compose({ title, seed, washes = [], after = [], whites = '', lines = [], fine = [], once = '', fills = '', glints = '', parts = [] }) {
  const all = (k) => parts.flatMap((p) => p[k]);
  const pathTags = (list) => list.map((d) => `<path d="${d}"/>`).join('');
  return {
    title,
    seed,
    washes: [...washes, ...all('washes'), ...after],
    whites: [whites, ...all('whites')].filter(Boolean).join(''),
    lines: pathTags([...lines, ...all('lines')]),
    fine: pathTags([...fine, ...all('fine')]),
    once,
    fills: fills + pathTags(all('fills')),
    glints: glints + pathTags(all('glints')),
  };
}

// ---------------------------------------------------------------------------------------------
// The Crow: a glossy black bird perched with her chest puffed out, a big round cheese held in her
// long beak. Feet grip a branch at y = 0.
const cHead = 'M6 -78C5 -92 17 -100 28 -97C38 -94 42 -86 40 -76C38 -66 30 -61 21 -62C12 -63 6 -70 6 -78Z';
// the head's outline stays open where it meets the neck
const cHeadLine = 'M8 -67C4 -74 4 -82 7 -88C11 -96 20 -99 28 -97C38 -94 42 -86 40 -76C39 -70 37 -66 33 -63';
const cBody =
  'M9 -64C-8 -60 -20 -44 -22 -26C-23 -16 -26 -8 -34 6L-48 28L-39 25L-40 34L-30 23L-25 30L-14 4C-4 2 12 0 22 -8C34 -18 38 -40 32 -60';
const cWing = 'M4 -54C-10 -48 -18 -34 -20 -18L-31 12L-23 7L-21 16L-12 3C0 -6 12 -20 14 -36C15 -46 12 -52 4 -54';
const cWingMarks = 'M-6 -36l5 4l3 -6M-10 -24l5 4l3 -6M-14 -12l5 4l3 -6';
const cBeak = 'M38 -88C44 -90 50 -89 55 -85M39 -69C44 -68 49 -69 54 -71M40 -79L52 -78';
const cBeakFill = 'M38 -88C44 -90 50 -89 55 -85L54 -71C49 -69 44 -68 39 -69Z';
const cTuft = 'M15 -96L11 -105M21 -98L21 -108M27 -97L32 -105';
const cLegs = 'M4 -3L3 2M-4 4L3 2L9 5M14 -6L13 2M6 4L13 2L19 5';
const cEye = dot(27, -82, 4.6);
const cChest = 'M24 -56c4 2 6 6 6 10M20 -40c4 2 6 6 6 10M14 -26c3 2 5 5 5 8';
// The cheese: a big round wheel (face towards us) with holes; the beak clamps its left edge.
const cheese = dot(70, -78, 17);
// its thickness shows as a rim to the right
const cheeseRim = 'M72 -95C84 -97 95 -87 94 -75C93 -63 84 -58 74 -61';
const holes = [dot(72, -86, 3.4, 2.8), dot(62, -73, 2.6, 2.2), dot(77, -70, 2.2, 1.9), dot(80, -83, 1.6, 1.4), dot(66, -86, 1.4, 1.2)];

export function crow() {
  return {
    lines: [cBody, cHeadLine, cWing, cBeak, cheese, cheeseRim, cLegs],
    fine: [cWingMarks, cTuft, cEye, cChest, ...holes],
    washes: [
      { c: PAL.slate, o: 0.88, d: `${cHead}${cBody}Z` },
      { c: PAL.ink, o: 0.5, d: `${cHead}${cBody}Z` },
      { c: PAL.ink, o: 0.35, d: `${cWing}Z` },
      { c: PAL.grey, o: 0.85, d: cBeakFill },
      { c: PAL.ochre, o: 0.95, d: cheese },
      { c: PAL.ochre, o: 0.9, d: `${cheeseRim}A17 17 0 0 0 72 -95Z` },
      { c: PAL.terracotta, o: 0.3, d: `${cheeseRim}A17 17 0 0 0 72 -95Z` },
      { c: PAL.terracotta, o: 0.6, d: holes.join('') },
    ],
    whites: [cEye, 'M57 -86C59 -91 64 -94 69 -94C64 -91 61 -88 59 -84Z'],
    fills: [dot(28.5, -82, 2.6)],
    glints: [dot(29.3, -83.2, 0.9)],
  };
}

// ---------------------------------------------------------------------------------------------
// The Fox: a red fox sitting up with his big bushy tail on the ground, white chest and tail tip,
// head tipped back to look up, eyes closed in his sweetest smile.
const fBack = 'M10 -74C-6 -66 -22 -46 -27 -24C-30 -10 -24 0 -12 0L26 0';
const fChest = 'M30 -70C34 -52 30 -26 26 0';
const fHaunch = 'M-25 -18C-22 -36 -4 -40 3 -25C6 -14 2 -4 -4 0';
const fLegs = 'M12 -30L11 -1M20 -34L21 -1';
const fPaws = 'M5 0C5 -5 13 -5 14 -1M16 0C16 -5 24 -5 26 -1';
const fHead = 'M8 -84C4 -98 14 -110 28 -110C36 -110 42 -108 48 -112L60 -118C62 -114 60 -108 56 -104C50 -96 44 -86 36 -80C26 -72 12 -74 8 -84Z';
const fEars = 'M11 -98L2 -124L22 -108M22 -109L27 -133L37 -110';
const fInnerEars = 'M9 -102L5 -116L16 -107ZM26 -111L28 -124L33 -111Z';
const fCheek = 'M18 -79C28 -74 42 -84 54 -102C46 -94 38 -92 32 -92C24 -92 18 -87 18 -79Z';
const fSmile = 'M55 -105Q48 -97 36 -94M36 -94q-3 -2 -2 -5';
const fEye = 'M24 -101q5 -5 10 -1';
const fBrow = 'M24 -108q5 -3 9 0';
const fChestWhite = 'M30 -70C34 -56 32 -40 28 -26C22 -34 18 -48 18 -62C20 -66 24 -70 30 -70Z';
const fTail = limb([
  [-22, -8, 14],
  [-40, -6, 20],
  [-58, -8, 22],
  [-74, -18, 18],
  [-80, -32, 10],
]);
const fTailTip = 'M-72 -24C-78 -22 -84 -24 -87 -30C-86 -36 -82 -40 -78 -42C-76 -36 -74 -30 -72 -24Z';
const fTailMark = 'M-72 -24C-76 -30 -77 -36 -78 -41';
const fFur = 'M-12 -46l6 3M-18 -34l6 3M-40 -14l8 1M-56 -16l7 -1';

export function fox() {
  return {
    lines: [fTail, fBack, fChest, fHaunch, fLegs, fHead, fEars],
    fine: [fCheek, fSmile, fEye, fBrow, fFur, fTailMark, fPaws, 'M18 -60l4 3M20 -48l4 3'],
    washes: [
      { c: PAL.terracotta, o: 0.85, d: `${fBack}L30 -70Z${fHead}${fEars}Z${fTail}Z` },
      { c: PAL.red, o: 0.25, d: `${fHaunch}Z${fTail}Z` },
      { c: PAL.rose, o: 0.6, d: dot(20, -92, 3.5) },
      { c: PAL.ink, o: 0.55, d: `${fInnerEars}M5 0C5 -5 13 -5 14 -1ZM16 0C16 -5 24 -5 26 -1Z` },
    ],
    whites: [fChestWhite, fTailTip, fCheek],
    fills: [dot(59.5, -116.5, 2.8)],
  };
}
