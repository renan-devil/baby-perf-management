import { PAL } from '../lib.mjs';
import { compose, dot, merge, nightingale, note, place, sparkle } from './characters.mjs';

// The Nightingale, 1 (cover): in the moonlight, at the edge of the forest, the little plain brown
// nightingale sits on a branch and sings with her beak wide open; notes float up into the night.
const B = 'translate(206 158) rotate(-14) scale(3.5)';
const sky = 'M40 40C90 14 250 10 340 26C384 40 392 120 380 176C370 220 330 246 250 252C160 258 70 246 40 210C20 170 18 70 40 40Z';
const moon = dot(334, 72, 27);
const branch = 'M0 236C60 222 120 212 180 208C220 205 260 204 300 210L302 216C262 212 222 213 182 216C122 222 64 234 0 250Z';
const twig = 'M118 216C126 200 136 190 150 184M240 206C252 196 262 190 276 188';
const leaf = (x, y, a) => `M${x} ${y}c6 -8 16 -9 22 -4c-6 8 -16 9 -22 4Z`;
const leaves = [leaf(148, 184), leaf(274, 188), leaf(60, 226), leaf(300, 210), leaf(196, 206)].map((d, i) => d);
const notes = merge(note(286, 102, 2), note(312, 146, 1.6), note(254, 66, 1.8), note(222, 36, 1.4));

export default compose({
  title: 'The nightingale sings in the moonlight',
  seed: 1201,
  washes: [
    { c: PAL.slate, o: 0.5, d: sky + moon, rule: 'evenodd' },
    { c: PAL.ochre, o: 0.35, d: moon },
    { c: PAL.terracotta, o: 0.6, d: branch },
    { c: PAL.slate, o: 0.35, d: branch },
    { c: PAL.green, o: 0.75, d: leaves.join('') },
  ],
  lines: [branch, twig],
  fine: [moon, ...leaves, sparkle(80, 70, 5), sparkle(120, 110, 3.5), sparkle(360, 190, 4), sparkle(60, 160, 3)],
  parts: [place(nightingale({ beak: 'open' }), B), notes],
});
