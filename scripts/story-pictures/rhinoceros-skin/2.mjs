import { PAL, hatch, paths, tufts } from '../lib.mjs';
import { R, S, cake, palm, palmAt, parsee, pt, rhino } from './1.mjs';

// How the Rhinoceros Got His Skin, 2: "How!" The Rhinoceros has spiked the cake on his horn and
// knocked the stove over, while the Parsee man watches from the top of his palm tree.

// the Rhinoceros, his horn hidden under the cake except for its tip
const RT = 'translate(108 256) scale(1.32)';
const rh = rhino(RT, { look: [1.6, -1], skip: ['horn'] });
const hornLow = 'M77 -43C78 -48 79 -52 80 -56M91 -35C92 -42 92 -48 92 -54';
const hornTip = 'M83 -77C85 -83 88 -89 92 -96C93 -89 93 -83 93 -77';
// the cake, speared on his horn (rhinoceros coordinates)
const KR = 'translate(87 -53) rotate(-10) scale(0.72)';
const KT = `${RT} ${KR}`;
const ck = cake(KT);
const crumbsFall = 'M100 -50l1 4M104 -44l1 4M74 -52l-1 4';
const munch = 'M100 -22l7 -1M99 -16l7 2';

// the stove, knocked over on its side, with a puff of smoke
const ST = 'translate(248 256) rotate(58 24 0)';
const smoke = 'M280 192c-6 -4 -2 -12 4 -10c0 -8 10 -8 11 -2c6 -3 11 3 7 8M292 172c-4 -3 -1 -9 3 -8c1 -6 8 -5 8 0';
const clang = 'M246 210l-6 -6M242 222l-8 -2M270 200l2 -8M282 204l6 -6';

// the palm tree (mirrored, leaning left) with the Parsee man clinging near the top
const PT = 'translate(334 256) scale(-1.12 1.12)';
const [hx, hy] = palmAt(66);
const [mx, my] = pt(hx, hy, PT);
const MT = `translate(${mx} ${my}) rotate(-4) scale(0.62)`;
const pa = palm(PT, { gap: [62, 134] });
const man = parsee(MT, { arms: 'hug' });

const beach = 'M8 258C90 254 180 260 260 256C320 253 360 257 392 255';
const sea = 'M8 128C60 126 120 129 160 128';

export default {
  title: 'How!',
  seed: 72,
  washes: [
    { c: PAL.sky, o: 0.45, d: 'M8 128C80 126 150 130 230 127C300 124 360 128 392 126L392 176C300 180 120 172 8 178Z' },
    { c: PAL.ochre, o: 0.35, d: 'M8 176C120 170 300 178 392 174L394 290C300 294 140 286 8 292Z' },
    ...pa.washes,
    ...rh.washes,
    { c: PAL.ochre, o: 0.4, t: RT, d: R.hornWash },
    { c: PAL.slate, o: 0.6, t: ST, d: S.wash },
    { c: PAL.grey, o: 0.45, d: smoke },
    ...ck.washes,
    ...man.washes,
  ],
  whites: rh.whites,
  lines:
    pa.lines +
    rh.lines +
    paths([hornLow], RT) +
    ck.lines +
    paths([hornTip], RT) +
    paths([S.box, S.top, S.legs, S.pipe], ST) +
    man.lines +
    paths([beach]),
  fine:
    pa.fine +
    rh.fine +
    paths([crumbsFall, munch], RT) +
    ck.fine +
    paths([S.door], ST) +
    man.fine +
    paths([sea, smoke, clang, tufts([[24, 258], [210, 258], [384, 255]], 8, 6), hatch(30, 276, 370, 274, 12, 6, 165, 8)]),
  once: man.once,
  fills: rh.fills + man.fills + ck.fills + paths(['M240 252l3 -3l3 3l-3 2ZM252 254l2 -3l3 2l-2 2Z']),
  glints: man.glints,
};
