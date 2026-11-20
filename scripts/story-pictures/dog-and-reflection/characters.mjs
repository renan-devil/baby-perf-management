import { PAL, transformPath } from '../lib.mjs';

// The Dog and His Reflection: the Dog and his bone, drawn once here and placed in both pictures
// with a transform (place). The build only draws files named <n>.mjs, so this file is not a
// picture. The Dog faces right.

const f = (n) => Math.round(n * 10) / 10;

/** A round dot (eye, pupil, glint) as path data. */
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

// A part: { lines, fine, once, washes: [{c, o, d}], whites, fills, glints }, each a list.
const KEYS = ['lines', 'fine', 'once', 'washes', 'whites', 'fills', 'glints'];
const tr = (d, t) => (t ? transformPath(d, t) : d);

/** Places a part with an SVG transform string (applied to the coordinates themselves). */
export function place(part, t) {
  const out = {};
  for (const k of KEYS) out[k] = (part[k] ?? []).map((v) => (k === 'washes' ? { ...v, d: tr(v.d, t) } : tr(v, t)));
  return out;
}

/** Puts several parts together into one. */
export function merge(...parts) {
  const out = Object.fromEntries(KEYS.map((k) => [k, []]));
  for (const p of parts) for (const k of KEYS) out[k].push(...(p[k] ?? []));
  return out;
}

/** Joins placed parts with the scene's own shapes into the drawing that svg() takes. */
export function compose({ title, seed, parts = [] }) {
  const all = merge(...parts);
  const tags = (list) => list.map((d) => `<path d="${d}"/>`).join('');
  return {
    title,
    seed,
    washes: all.washes,
    whites: all.whites.join(''),
    lines: tags(all.lines),
    fine: tags(all.fine),
    once: tags(all.once),
    fills: tags(all.fills),
    glints: tags(all.glints),
  };
}

/**
 * Bends placed path data sideways like a reflection in moving water: every point moves along x by
 * amp · sin(y / wave + phase), more the further it is below the water line y0. Takes the absolute
 * path data that transformPath returns.
 */
export function wobble(d, { y0, amp = 3, wave = 5, phase = 0 }) {
  const tokens = d.match(/[a-zA-Z]|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g) ?? [];
  const out = [];
  for (let i = 0; i < tokens.length; ) {
    if (/[a-zA-Z]/.test(tokens[i])) {
      out.push(tokens[i]);
      // an arc keeps its radii, turn and flags; only its end point moves
      if (tokens[i++] === 'A') {
        out.push(...tokens.slice(i, i + 5));
        i += 5;
      }
      continue;
    }
    const x = Number(tokens[i]);
    const y = Number(tokens[i + 1]);
    const k = Math.min(1, Math.max(0, (y - y0) / 30));
    out.push(f(x + k * amp * Math.sin(y / wave + phase)), f(y));
    i += 2;
  }
  return out.join(' ');
}

// ---------------------------------------------------------------------------------------------
// The bone: big and paper-white with an ink outline, two round knobs at each end. Centre 0,0,
// lying along x, about 43 long.
const boneShape =
  'M-13 -2.8L13 -2.8C14 -8.5 21.5 -9.5 22 -4.6C22.4 -2 20.5 -0.6 19.4 0C20.5 0.6 22.4 2 22 4.6C21.5 9.5 14 8.5 13 2.8L-13 2.8C-14 8.5 -21.5 9.5 -22 4.6C-22.4 2 -20.5 0.6 -19.4 0C-20.5 -0.6 -22.4 -2 -22 -4.6C-21.5 -9.5 -14 -8.5 -13 -2.8Z';
const boneShade = 'M-12 1.2L12 1.2L13 2.8L-13 2.8ZM14.5 5.5C16 7.5 19.5 7.6 20.6 5.6C21 7.6 18 9 15.5 7.5ZM-14.5 5.5C-16 7.5 -19.5 7.6 -20.6 5.6C-21 7.6 -18 9 -15.5 7.5Z';
export function bone() {
  return {
    lines: [boneShape],
    fine: ['M-6 -0.5L4 -0.5'],
    whites: [boneShape],
    washes: [{ c: PAL.grey, o: 0.55, d: boneShade }],
  };
}

// ---------------------------------------------------------------------------------------------
// The Dog: a friendly scruffy ochre dog with a terracotta patch on his back, a floppy terracotta
// ear, a tuft of fur on his head and a red collar.

// His head, centre 0,0, facing right. mood: 'happy' (eyes closed in a smile, the bone in his
// mouth) or 'bark' (jaw dropped wide open, eye wide, no bone).
const skull = 'M-11 -2C-12 -12 -4 -16 4 -15C10 -14 13 -10 14 -8L23 -6C27 -5 27 1 23 2L13 4C9 9 -5 10 -9 5C-11 3 -11 0 -11 -2Z';
const skullBark = 'M13 1C9 8 -5 9 -9 5C-11 3 -12 0 -11 -2C-12 -12 -4 -16 4 -15C10 -14 13 -10 14 -8L23 -6C27 -5 27 0 23 0L13 1';
const jaw = 'M11 3L23 9C26 11 24 14 20 13L7 8';
const mouth = 'M13 1L23 0L24 8L11 3Z';
const tongue = 'M15 4C18 5 20 7 19 9.5C17 9.5 15 7 15 4Z';
const ear = 'M-4 -13C-11 -13 -15 -3 -12 7C-7 7 -5 -1 -2 -11Z';
const tuft = 'M-6 -13C-9 -16 -10 -19 -8 -21C-6 -18 -4 -17 -2 -16C-3 -19 -2 -22 1 -23C1 -20 2 -18 4 -15.5';
const nose = 'M22 -6.5C24.5 -7 26 -5.5 25.6 -4C25.2 -2.6 23 -2.6 22 -3.4Z';
const collar = 'M-12 1C-12 7 -8 11 -2 13L0 9C-4 8 -7 5 -8 1Z';
const BONE = 'translate(15 3) rotate(-4) scale(0.82)';

export function dogHead({ mood = 'happy' } = {}) {
  const base = {
    washes: [
      { c: PAL.terracotta, o: 0.85, d: ear },
      { c: PAL.red, o: 0.85, d: collar },
    ],
  };
  if (mood === 'happy') {
    return merge(
      {
        lines: [skull, ear, collar],
        fine: [tuft, 'M1 -6q3.5 -4 7 0', 'M-1 -10.5q3 -2 6 -1', 'M11 4q2 2 0 4'],
        washes: [
          { c: PAL.ochre, o: 0.8, d: `${skull}${tuft}Z` },
          { c: PAL.rose, o: 0.55, d: dot(5, 0, 2.4) },
          ...base.washes,
        ],
        fills: [nose],
      },
      place(bone(), BONE),
    );
  }
  return {
    lines: [skullBark, jaw, ear, collar],
    fine: [tuft, dot(4, -7, 2.5), 'M-1 -12q4 -3 9 -1'],
    washes: [
      { c: PAL.ochre, o: 0.8, d: `${skullBark}Z${jaw}Z${tuft}Z` },
      { c: PAL.red, o: 0.8, d: mouth },
      { c: PAL.rose, o: 0.9, d: tongue },
      ...base.washes,
    ],
    whites: [dot(4, -7, 2.5)],
    fills: [nose, dot(5, -6.6, 1.5)],
    glints: [dot(5.4, -7.2, 0.45)],
  };
}

// The whole Dog, body centre 0,0, feet on y = 32 (FEET). pose: 'trot' (legs in mid-stride, head
// up, bone in his mouth) or 'bark' (standing, leaning his head down over the water, barking).
export const FEET = 32;
const body =
  'M-28 -6C-30 -14 -18 -17 -2 -16C12 -15 20 -17 27 -12C33 -6 30 6 20 10C16 13 12 11 8 13C4 11 0 13 -4 11C-8 13 -12 11 -16 11C-26 9 -30 2 -28 -6Z';
const patch = 'M-19 -15C-11 -17 -1 -16 3 -12C1 -6 -9 -4 -15 -6C-20 -8 -21 -12 -19 -15Z';
const backFur = 'M-21 -15.5l-3 -4M-13 -16.5l-2 -4M-5 -16.5l-1 -4M-28 -2l-4 1M-28 3l-4 2';
const tail = limb([[-27, -8, 6], [-35, -18, 5], [-35, -31, 3.5]]);
const tailTip = 'M-35 -33l-3 -4M-34 -33l1 -5';
const LEGS = {
  trot: {
    far: [limb([[14, 4, 9], [11, 18, 7], [3, 29, 6.5]]), limb([[-22, 3, 10], [-31, 17, 7.5], [-39, 28, 6.5]])],
    near: [limb([[20, 3, 9], [27, 17, 7], [33, 31, 6.5]]), limb([[-17, 4, 10], [-12, 18, 7.5], [-10, 31, 6.5]])],
  },
  bark: {
    far: [limb([[13, 5, 9], [14, 19, 7], [15, 31, 6.5]]), limb([[-23, 4, 10], [-26, 18, 7.5], [-27, 31, 6.5]])],
    near: [limb([[20, 3, 9], [23, 17, 7], [26, 31, 6.5]]), limb([[-16, 5, 10], [-16, 18, 7.5], [-14, 31, 6.5]])],
  },
};
const NECK = {
  trot: {
    head: 'translate(35 -27) rotate(-4) scale(1.15)',
    wash: 'M14 -15C18 -24 22 -30 26 -34L40 -24C40 -16 34 -10 28 -8Z',
    line: 'M13 -15.5C17 -23 20 -28 23 -31',
  },
  bark: {
    head: 'translate(38 -17) rotate(40) scale(1.15)',
    wash: 'M14 -15C20 -22 26 -26 32 -28L42 -10C38 -6 32 -4 26 -4Z',
    line: 'M13 -15.5C19 -21 24 -24 28 -26',
  },
};

export function dog({ pose = 'trot' } = {}) {
  const legs = LEGS[pose];
  const neck = NECK[pose];
  const legShapes = (list) => list.map((l) => `${l}Z`).join('');
  return merge(
    {
      lines: [...legs.far, tail, body, ...legs.near, neck.line],
      fine: [backFur, tailTip, 'M-20 3C-23 -3 -17 -8 -10 -5', 'M22 -2l3 3M18 0l2 4'],
      washes: [
        { c: PAL.ochre, o: 0.8, d: `${body}${tail}Z${legShapes(legs.near)}${neck.wash}` },
        { c: PAL.ochre, o: 0.85, d: legShapes(legs.far) },
        { c: PAL.terracotta, o: 0.35, d: legShapes(legs.far) },
        { c: PAL.terracotta, o: 0.75, d: patch },
      ],
    },
    place(dogHead({ mood: pose === 'trot' ? 'happy' : 'bark' }), neck.head),
  );
}
