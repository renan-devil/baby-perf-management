import { PAL, hatch } from '../lib.mjs';
import { coin, compose, dot, limb, merge, oval, place, shoe, shoemaker } from './characters.mjs';

// The Elves and the Shoemaker, 3: a fine lady in a hat with a long feather tries on the new shoes,
// twirls with delight, and pays the shoemaker with shiny coins: clink, clink, clink!
const floor = 'M0 272C90 269 200 274 300 271C340 270 370 272 400 271';

// The fine lady (feet at 0,0): sky-blue dress with a wide skirt, rose hat with a long ochre feather,
// one foot forward in her new shoe.
function lady() {
  const face = oval(0, -130, 11, 13);
  const hair = 'M-12 -130C-13 -139 -8 -143 0 -143C8 -143 13 -139 12 -130C8 -136 -8 -136 -12 -130Z';
  const curls = dot(-13, -124, 3.5) + dot(13, -124, 3.5) + dot(-12, -118, 3) + dot(12, -118, 3);
  const brim = oval(0, -143, 27, 5);
  const crown = 'M-14 -144C-15 -156 -8 -160 0 -160C8 -160 15 -156 14 -144';
  const feather = 'M8 -156C4 -174 -16 -188 -46 -184C-30 -178 -10 -170 8 -156Z';
  const rib = 'M8 -156C0 -170 -20 -180 -44 -183';
  const barbs = 'M-4 -170l-4 6M-14 -175l-4 6M-24 -179l-4 5M-34 -181l-3 4M0 -166l-6 -4M-10 -173l-6 -4';
  const bodice = 'M-8 -115C-14 -110 -14 -98 -12 -86M8 -115C14 -110 14 -98 12 -86';
  const skirt = 'M-12 -86C-24 -70 -36 -42 -42 -14C-24 -8 0 -12 8 -10C20 -12 30 -16 42 -18C36 -44 24 -70 12 -86';
  const frill = 'M-42 -14q4 4 8 1q4 4 8 1q4 4 8 1q4 4 8 1q4 3 8 0q4 3 8 -1q4 3 8 -2q4 2 8 -3q4 2 6 -3';
  const ankle = 'M8 -10L9 -4M14 -11L15 -4';
  const armL = limb([[-10, -110, 7], [-20, -98, 6], [-28, -86, 6], [-34, -76, 6]]);
  const armR = limb([[10, -110, 7], [24, -106, 6], [36, -104, 6], [46, -106, 6]]);
  const hands = dot(-34, -76, 3.6) + dot(46, -106, 3.6);
  return merge(
    {
      lines: [face, hair, curls, brim, crown, feather, bodice, skirt, armL, armR],
      fine: [rib, barbs, frill, ankle, hands, 'M-4 -117L-4 -113M4 -117L4 -113', 'M-13 -146C-5 -149 5 -149 13 -146', 'M-10 -60q-6 20 -8 40M6 -60q4 20 6 36'],
      washes: [
        { c: PAL.rose, o: 0.3, d: face },
        { c: PAL.terracotta, o: 0.7, d: hair + curls },
        { c: PAL.rose, o: 0.8, d: `${crown}Z${brim}` },
        { c: PAL.red, o: 0.8, d: 'M-14 -148C-5 -151 5 -151 14 -148L14 -144C5 -147 -5 -147 -14 -144Z' },
        { c: PAL.ochre, o: 0.85, d: feather },
        { c: PAL.sky, o: 0.8, d: `M-12 -86C-14 -98 -14 -110 -8 -115L8 -115C14 -110 14 -98 12 -86Z${skirt}Z` },
        { c: PAL.sky, o: 0.6, d: `${armL}Z${armR}Z` },
        { c: PAL.rose, o: 0.5, d: hands },
        { c: PAL.rose, o: 0.65, d: dot(-7, -125, 2.3) + dot(7, -125, 2.3) },
      ],
      fills: [],
    },
    // bright eyes, a happy smile
    {
      fine: ['M-4 -123q4 4 8 0', 'M0.4 -128c1.6 1 1.6 2.4 -0.4 2.8', 'M-7 -134l-2 -2M7 -134l2 -2'],
      fills: [dot(-4.5, -131, 1.7), dot(4.5, -131, 1.7)],
      glints: [dot(-5, -131.6, 0.5), dot(4, -131.6, 0.5)],
    },
    place(shoe({}), 'translate(6 1) scale(0.8)'),
  );
}

const coins = [
  [180, 134],
  [204, 128],
  [222, 148],
];

export default compose({
  title: 'The fine lady pays with shiny coins',
  seed: 63,
  washes: [{ c: PAL.ochre, o: 0.3, d: 'M0 270C100 267 200 272 300 269C340 268 370 270 400 269L400 294C300 296 100 295 0 294Z' }],
  lines: [floor],
  fine: [
    hatch(14, 284, 384, 286, 12, 8, 172, 4),
    // the arc of the falling coins and a little twirl of joy
    'M172 126l-6 -4M196 118l-3 -6M214 136l-2 -6',
    // sparkle marks by the coins
    'M232 132l6 -6M240 140l8 -2M226 126l1 -8',
  ],
  parts: [
    place(lady(), 'translate(108 272) scale(1.3)'),
    ...coins.map(([x, y]) => place(coin(6), `translate(${x} ${y})`)),
    place(merge(coin(6), place(coin(6), 'translate(9 -3)')), 'translate(236 168)'),
    place(
      shoemaker({
        mood: 'happy',
        tilt: -4,
        arms: [
          [[-20, -104, 10], [-34, -96, 9], [-44, -88, 9], [-52, -86, 9]],
          [[20, -104, 10], [25, -88, 9], [27, -72, 9], [26, -62, 9]],
        ],
      }),
      'translate(300 272) scale(1.15)',
    ),
  ],
});
