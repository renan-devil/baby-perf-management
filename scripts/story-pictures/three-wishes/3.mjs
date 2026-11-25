import { PAL, hatch, rays } from '../lib.mjs';
import { arm, compose, dot, merge, oval, place, sausage, woodcutter } from './1.mjs';

// The Three Wishes, 3: "I wish I had a nice big sausage!" Whoosh! Plop! Down the chimney comes a long,
// fat sausage, straight into the pan over the fire. The woodcutter rubs his tummy and points; Fanchon
// throws her hands up to her cheeks.
//
// This file also draws Fanchon, the woodcutter's wife, once, for pictures 4 and 5.

// ---------------------------------------------------------------------------------------------
// Fanchon (feet at 0,0, about 126 tall, facing us): an ochre headscarf tied under her chin with a bow,
// a curl of terracotta hair, a round nose, a sky-blue dress and a white apron with a pocket.
// arms: two arm centrelines (from the shoulders at ±12, -86). mood: 'wow', 'cross', 'laugh', 'happy'.
// legs: false draws her only down to the waist (y = -62), for when she stands behind the table.
// nosey: something hangs from her nose (picture 4), so her chin, bow and neckline leave a gap for it,
// and her mouth and apron bib are hidden.
export const F_NOSE = [0, -98];
export const F_SCARF = 'M-6 -89C-14 -91 -19 -98 -19 -107C-19 -119 -10 -127 0 -127C10 -127 19 -119 19 -107C19 -98 14 -91 6 -89';
export const F_FACE = 'M-12 -104C-12 -94 -6 -89 0 -89C6 -89 12 -94 12 -104C12 -110 6 -114 0 -114C-6 -114 -12 -110 -12 -104Z';
export const F_FRINGE = 'M-11 -108C-9 -114 -3 -116 2 -114C6 -116 10 -113 11 -108C7 -111 3 -110 0 -110C-4 -112 -8 -111 -11 -108Z';
export const F_BOW = 'M0 -88L-9 -84L-8 -92ZM0 -88L9 -84L8 -92Z';
export const F_BODICE = 'M-12 -87C-15 -79 -15 -70 -13 -62L13 -62C15 -70 15 -79 12 -87C6 -90 -6 -90 -12 -87Z';
export const F_SKIRT = 'M-13 -62C-20 -44 -25 -22 -27 -4C-10 0 10 0 27 -4C25 -22 20 -44 13 -62';
export const F_APRON = 'M-10 -62C-12 -44 -15 -24 -16 -8C-6 -5 6 -5 16 -8C15 -24 12 -44 10 -62Z';
export const F_BIB = 'M-7 -86L7 -86L9 -62L-9 -62Z';
export const F_SHOES = 'M-14 -3C-16 2 -6 2 -5 -2M14 -3C16 2 6 2 5 -2';
export const F_ARMS = {
  hips: [
    [[-12, -86, 7], [-26, -76, 6.5], [-14, -64, 6]],
    [[12, -86, 7], [26, -76, 6.5], [14, -64, 6]],
  ],
  // hands flying up to her cheeks: oh!
  cheeks: [
    [[-12, -86, 7], [-25, -82, 6.5], [-18, -98, 6]],
    [[12, -86, 7], [25, -82, 6.5], [18, -98, 6]],
  ],
  // both arms flung up
  up: [
    [[-12, -86, 7], [-26, -96, 6.5], [-30, -116, 6]],
    [[12, -86, 7], [26, -96, 6.5], [30, -116, 6]],
  ],
};
export function fanchon({ mood = 'happy', arms = F_ARMS.hips, legs = true, look = [0, 0], nosey = false } = {}) {
  const face = nosey ? 'M-5 -89.4C-9 -91 -12 -96 -12 -104C-12 -110 -6 -114 0 -114C6 -114 12 -110 12 -104C12 -96 9 -91 8 -90.2' : F_FACE;
  const bow = nosey ? 'M-4 -87.5L-11 -84L-10 -92ZM9 -87.5L15 -84L14 -92Z' : F_BOW;
  const bodice = nosey ? 'M-4 -89.6C-8 -89.4 -10 -88 -12 -87C-15 -79 -15 -70 -13 -62L13 -62C15 -70 15 -79 12 -87C11 -88 10 -89 9 -89.4' : F_BODICE;
  const lines = [F_SCARF, face, bow, bodice];
  const fine = nosey ? ['M-13 -62L-22 -56M13 -62L22 -57'] : [F_BIB, 'M-13 -62L-22 -56M13 -62L22 -57', 'M-1 -100c-2 1 -2 3 1 3.5', 'M-3 -84l0 3M3 -84l0 3'];
  const washes = [
    { c: PAL.ochre, o: 0.78, d: `${F_SCARF}C11 -91 12 -96 12 -104C12 -110 6 -114 0 -114C-6 -114 -12 -110 -12 -104C-12 -96 -11 -91 -6 -89Z${bow}` },
    { c: PAL.terracotta, o: 0.8, d: F_FRINGE },
    { c: PAL.rose, o: 0.3, d: F_FACE },
    { c: PAL.rose, o: 0.6, d: dot(-7.5, -96, 2.4) + dot(7.5, -96, 2.4) + dot(0, -98.5, 2.2) },
    { c: PAL.sky, o: 0.7, d: F_BODICE },
  ];
  const whites = nosey ? [] : [F_BIB];
  const fills = [];
  const glints = [dot(-14, -112, 1), dot(-5, -122, 1), dot(7, -122, 1), dot(15, -110, 1), dot(-16, -100, 1), dot(16, -99, 1)];
  const [lx, ly] = look;
  const eyes = (r) => {
    fills.push(dot(-4.5 + lx, -103 + ly, r), dot(4.5 + lx, -103 + ly, r));
    glints.push(dot(-5 + lx, -103.6 + ly, 0.5), dot(4 + lx, -103.6 + ly, 0.5));
  };
  if (mood === 'wow') {
    eyes(2);
    fine.push('M-7.5 -108.5q2.5 -2 5 0M2.5 -108.5q2.5 -2 5 0');
    if (!nosey) fills.push(oval(0, -93, 2, 2.6));
  } else if (mood === 'cross') {
    eyes(1.7);
    fine.push('M-8 -108l6 2M8 -108l-6 2', 'M-3 -93q3 -2 6 0');
  } else if (mood === 'laugh') {
    fine.push('M-7 -103q2.5 -3 5 0M2 -103q2.5 -3 5 0');
    fills.push('M-4.5 -95C-3 -90 3 -90 4.5 -95C1.5 -94 -1.5 -94 -4.5 -95Z');
  } else {
    eyes(1.7);
    fine.push('M-3 -94q3 2.5 6 0');
  }
  const upper = merge({ lines, fine, washes, whites, fills, glints }, arm(arms[0], PAL.sky, 0.6, 3.6), arm(arms[1], PAL.sky, 0.6, 3.6));
  if (!legs) return upper;
  return merge(
    {
      lines: [F_SKIRT, F_SHOES],
      fine: [F_APRON, 'M3 -36l8 0l0 8l-8 0Z'],
      washes: [
        { c: PAL.sky, o: 0.62, d: `${F_SKIRT}Z` },
        { c: PAL.terracotta, o: 0.7, d: 'M-14 -3C-16 2 -6 2 -5 -2ZM14 -3C16 2 6 2 5 -2Z' },
      ],
      whites: [F_APRON],
    },
    upper,
  );
}

// ---------------------------------------------------------------------------------------------
// The fireplace (absolute), shared with pictures 4 and 5
export const floor = 'M0 264C80 262 160 266 240 263C300 261 350 264 400 263';
export const hearth = 'M144 263L144 124M296 263L296 124';
export const mantel = 'M130 124L310 124L310 112L130 112Z';
export const hood = 'M162 112L184 22L256 22L278 112';
export const opening = 'M160 263L160 168C160 138 280 138 280 168L280 263';
export const stones = 'M144 160l16 0M144 210l16 0M280 180l16 0M280 230l16 0M178 84l20 0M232 60l18 0M192 44l14 0M224 96l20 0';
export const logs = 'M190 258C200 252 238 252 250 258M196 262C210 256 232 256 244 262';
export const flames = 'M200 254C194 244 204 240 202 230C212 238 214 246 212 254M214 254C210 240 222 234 220 222C232 232 232 244 228 254M230 254C228 244 238 240 238 232C246 242 244 248 242 254';
export const trivet = 'M196 236L190 262M244 236L250 262';
export const pan = 'M190 228C192 242 248 242 250 228Z';
export const panHandle = 'M250 231L284 222L285 227L250 236';
export const fireplace = () => ({
  lines: [hearth, mantel, hood, opening, pan, panHandle],
  fine: [stones, logs, flames, trivet],
  washes: [
    { c: PAL.grey, o: 0.42, d: `M144 263L144 124L296 124L296 263L280 263L280 168C280 138 160 138 160 168L160 263Z${mantel}M162 112L184 22L256 22L278 112Z` },
    { c: PAL.slate, o: 0.3, d: `${opening}Z` },
    { c: PAL.slate, o: 0.35, d: 'M160 168C160 138 280 138 280 168L280 186C250 176 190 176 160 186Z' },
    { c: PAL.ochre, o: 0.6, d: mantel },
    { c: PAL.ochre, o: 0.7, d: 'M196 254C194 242 204 236 204 228C212 234 216 242 220 222C232 232 236 238 238 232C246 242 246 248 244 256Z' },
    { c: PAL.red, o: 0.5, d: 'M204 254C202 246 208 242 208 236C214 242 216 246 220 236C226 244 230 248 236 254Z' },
    { c: PAL.slate, o: 0.8, d: `${pan}${panHandle}Z` },
    { c: PAL.terracotta, o: 0.5, d: 'M188 256C200 250 238 250 252 256L248 264L192 264Z' },
  ],
});

const W = 'translate(82 264)';
const wArms = [
  // pointing up at the chimney
  [[-16, -84, 9], [-30, -100, 8], [-36, -124, 7]],
  // rubbing his tummy
  [[16, -84, 9], [22, -66, 8], [4, -58, 8]],
];
const F = 'translate(338 264) scale(1.04)';
// the sausage, dropping into the pan
const SAUSAGE = [
  [236, 226, 19],
  [234, 212, 21],
  [226, 192, 21],
  [214, 172, 21],
  [208, 152, 19],
];

export default compose({
  title: 'A sausage comes down the chimney',
  seed: 73,
  washes: [{ c: PAL.ochre, o: 0.32, d: `${floor}L400 290C300 296 100 296 0 290Z` }],
  lines: [floor],
  fine: [
    // whoosh down the chimney
    'M186 146C190 156 192 164 190 170M196 168C200 178 202 186 200 192M248 150C250 160 250 166 248 172',
    rays(242, 228, 14, 22, 5, 8, -150).split('M').slice(0, 4).join('M'),
    hatch(20, 278, 140, 278, 9, 6, 165, 3),
    hatch(270, 280, 390, 278, 8, 6, 165, 4),
  ],
  parts: [
    fireplace(),
    sausage(SAUSAGE),
    place(woodcutter({ mood: 'happy', arms: wArms, look: [1.8, -0.8] }), W),
    place(fanchon({ mood: 'wow', arms: F_ARMS.cheeks, look: [-1.6, 0.6] }), F),
  ],
});
