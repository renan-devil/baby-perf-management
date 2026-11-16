import { PAL, hatch, paths, rays, transformPath, tufts } from '../lib.mjs';
import { M, R, buttonAt, f, pt, ring } from './1.mjs';

// How the Rhinoceros Got His Skin, 3: the heatwave. The Rhinoceros has unbuttoned his skin and left
// it lying flat on the sand (three buttons, empty eye hole), with the Parsee man's hat beside it,
// while he bathes in the cool sea, pink without his skin, blowing bubbles.

// ---- his empty skin, flat on the sand: his own outline, squashed (rhinoceros coordinates) ----
const KT = 'translate(118 262) rotate(-3) scale(1.12 0.5)';
const skinLines = [R.back, R.head, R.horn, R.horn2, R.ear, R.frontLeg, R.backLeg, R.tail];
// the open edges along the tummy, where the buttons are undone
const flap = 'M-40 -22C-20 -19 3 -19 23 -22M-38 -15C-18 -11 4 -11 22 -15';
const crumple = 'M-30 -60C-24 -50 -26 -40 -20 -34M6 -66C10 -56 8 -46 12 -38M50 -52q4 4 2 10';
const eyeHole = R.eye;
// the buttons stay round: place them where the squashed tummy is
const buttons = buttonAt.map(([x, y]) => {
  const [bx, by] = pt(x, y + 7, KT);
  return ring(f(bx), f(by), 3);
});

// ---- the Rhinoceros in the sea: only what is above the water (y < -46) ----
const BT = 'translate(262 228) scale(1.12)';
const head = 'M40 -70C52 -62 64 -52 76 -44C80 -42 83 -41 86 -40';
const back = 'M-60 -40C-60 -68 -44 -80 -20 -80C0 -80 12 -88 26 -86C34 -84 38 -76 40 -70';
const bathWash = 'M-60 -40C-60 -68 -44 -82 -20 -82C0 -82 12 -90 26 -88C30 -88 33 -86 35 -84C34 -90 36 -96 40 -100C45 -94 46 -86 44 -76L40 -70C52 -62 64 -52 76 -44C80 -42 83 -41 86 -40Z';
const water = 'M-74 -40q6 -4 12 0q6 4 12 0q6 -4 12 0q6 4 12 0q6 -4 12 0q6 4 12 0q6 -4 12 0q6 4 12 0q6 -4 12 0q6 4 12 0q6 -4 12 0q6 4 12 0q6 -4 12 0q6 4 12 0';
const bubbles = ring(98, -54, 3) + ring(106, -64, 4) + ring(100, -76, 2.5) + ring(110, -82, 3);
const splash = 'M-66 -52l-6 -6M-70 -44l-8 -2M80 -54l4 -6';
const happy = 'M53 -47Q58 -52 63 -47';

// ---- the Parsee man's hat, left on the sand ----
const HT = 'translate(250 262) rotate(-8) scale(0.95)';
const hatOnSand = [M.hat.replace('Z', ''), M.brim].map((d) => transformPath(d, 'translate(0 92)'));
const hatWash = transformPath(M.hatWash, 'translate(0 92)');

// sun and heat
const heat = 'M70 96c-4 -6 4 -10 0 -16c-4 -6 4 -10 0 -16M106 88c-4 -6 4 -10 0 -16c-4 -6 4 -10 0 -16M292 92c-4 -6 4 -10 0 -16c-4 -6 4 -10 0 -16M326 84c-4 -6 4 -10 0 -16';
const sea = 'M8 112C80 110 160 113 230 110C300 108 360 111 392 110';
const waves = 'M30 128q8 -4 16 0M120 136q8 -4 16 0M200 124q8 -4 16 0M262 140q8 -4 16 0M60 170q8 -4 16 0';
const shore = 'M8 206C80 200 160 208 240 204C300 201 350 206 392 204';

export default {
  title: 'Heatwave',
  seed: 73,
  washes: [
    { c: PAL.sky, o: 0.6, d: 'M8 112C80 110 160 113 230 110C300 108 360 111 392 110L392 206C300 210 120 200 8 208Z' },
    { c: PAL.ochre, o: 0.42, d: 'M8 206C120 200 300 208 392 204L394 290C300 294 140 286 8 292Z' },
    { c: PAL.ochre, o: 0.75, d: 'M172 56C172 34 216 34 216 56C216 78 172 78 172 56Z' },
    { c: PAL.terracotta, o: 0.35, d: 'M178 56C178 40 210 40 210 56C210 72 178 72 178 56Z' },
    { c: PAL.grey, o: 0.62, t: KT, d: R.bodyWash },
    { c: PAL.slate, o: 0.3, t: KT, d: 'M-38 -15C-18 -11 4 -11 22 -15L23 -22C3 -19 -20 -19 -40 -22Z' },
    { c: PAL.ochre, o: 0.4, t: KT, d: R.hornWash },
    { c: PAL.ochre, o: 0.9, d: buttons.join('') },
    { c: PAL.rose, o: 0.7, t: BT, d: bathWash },
    { c: PAL.ochre, o: 0.4, t: BT, d: R.hornWash },
    { c: PAL.ochre, o: 0.85, t: HT, d: hatWash },
  ],
  whites: transformPath(bubbles, BT),
  lines: paths(skinLines, KT) + paths([back, head, R.horn, R.horn2, R.ear], BT) + paths(hatOnSand, HT),
  fine:
    paths([flap, crumple, eyeHole], KT) +
    paths(buttons) +
    paths([water, splash, bubbles, R.earIn, happy], BT) +
    paths([transformPath(M.hatBand, 'translate(0 92)')], HT) +
    paths([sea, shore, waves, heat, tufts([[24, 262], [380, 258]], 8, 7), hatch(30, 280, 370, 278, 12, 6, 165, 9)]),
  once: paths([rays(194, 56, 30, 46, 14, 5)]),
  fills: `<path d="${transformPath(eyeHole, KT)}" fill-opacity="0.5"/>`,
};
