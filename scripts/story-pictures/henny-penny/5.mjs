import { PAL, hatch, rays, tufts } from '../lib.mjs';
import { HENNY_HOLD, acorn, cocky, compose, ducky, goosey, henny, place } from './characters.mjs';

// Henny Penny, 5: back home in the farmyard, the birds laugh and laugh: Cocky Locky up on the fence,
// Goosey Loosey and Ducky Lucky sitting either side of Henny Penny, who holds out the little acorn
// that started it all. The characters are drawn in characters.mjs.

const f = (n) => Math.round(n * 10) / 10;
const G = 268; // where the birds sit
// the farmyard: a wooden fence along the back, with a gap in the middle (behind Henny Penny's comb)
const horizon = 'M0 184C80 180 160 186 240 182C310 179 360 183 400 181';
const posts = [18, 64, 110, 156, 250, 296, 342, 388];
const postsD = posts.map((x, i) => `M${x - 4} ${184 - (i % 2)}L${x - 3} ${128 + (i % 3)}L${x + 3} ${126 + (i % 2)}L${x + 4} 183`).join('');
const postsWash = posts.map((x, i) => `M${x - 4} ${184 - (i % 2)}L${x - 3} ${128 + (i % 3)}L${x + 3} ${126 + (i % 2)}L${x + 4} 183Z`).join('');
const rails = 'M0 142C60 141 120 143 162 141M244 140C300 142 350 140 400 141M0 162C60 161 120 163 162 162M244 161C300 162 350 160 400 162';
const railWash = 'M0 138L162 137L162 146L0 147ZM244 136L400 137L400 146L244 145ZM0 158L162 158L162 167L0 166ZM244 157L400 158L400 166L244 166Z';
const yard = 'M0 182C80 178 160 184 240 180C310 177 360 181 400 179L400 300L0 300Z';
const corn = [[132, 282], [146, 288], [284, 288], [300, 282], [34, 290], [378, 288]];
const cornD = corn.map(([x, y]) => `M${x - 2.5} ${y}C${x - 2.5} ${y - 3} ${x + 2.5} ${y - 3} ${x + 2.5} ${y}C${x + 2.5} ${y + 3} ${x - 2.5} ${y + 3} ${x - 2.5} ${y}Z`).join('');

const SUN = 'M306 62C306 36 346 36 346 62C346 88 306 88 306 62Z';

// Henny Penny in the middle, the acorn on the tip of her wing
const HS = 1.25;
const HX = 186;
const HY = G + 11 * HS;
const hold = [HX + HENNY_HOLD[0] * HS, HY + HENNY_HOLD[1] * HS];

export default compose({
  title: 'The birds laugh in the farmyard',
  seed: 59,
  parts: [
    {
      lines: [horizon, postsD, rails],
      fine: [hatch(20, 200, 380, 200, 9, 6, 160, 4), tufts([[200, 184], [392, 182]], 8, 6)],
      washes: [
        { c: PAL.ochre, o: 0.3, d: yard },
        { c: PAL.green, o: 0.2, d: yard },
        { c: PAL.terracotta, o: 0.35, d: postsWash + railWash },
        { c: PAL.grey, o: 0.4, d: postsWash + railWash },
        { c: PAL.ochre, o: 0.9, d: cornD },
      ],
    },
    { fine: [cornD] },
    // a happy sun, high on the right
    { washes: [{ c: PAL.ochre, o: 0.85, d: SUN }], lines: [SUN], fine: [rays(326, 62, 26, 40, 10, 8)] },
    place(cocky({ mood: 'laugh' }), 'translate(110 126) scale(1.05)'),
    place(goosey({ mood: 'laugh', legs: false }), `translate(60 ${G + 8 * 1.12}) scale(1.12)`),
    place(henny({ mood: 'laugh', holding: true, legs: false }), `translate(${HX} ${HY}) scale(${HS})`),
    place(acorn(), `translate(${f(hold[0])} ${f(hold[1])}) rotate(-10) scale(1.9)`),
    { fine: [`M${f(hold[0] - 12)} ${f(hold[1] - 20)}l-4 -6M${f(hold[0])} ${f(hold[1] - 24)}l0 -7M${f(hold[0] + 12)} ${f(hold[1] - 20)}l4 -6`] },
    place(ducky({ mood: 'laugh', legs: false }), `translate(350 ${G + 7 * 1.22}) scale(-1.22 1.22)`),
  ],
});
