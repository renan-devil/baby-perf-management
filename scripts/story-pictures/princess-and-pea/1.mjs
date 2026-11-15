import { PAL, transformPath } from '../lib.mjs';
import { compose, pile, place, princess, star } from './characters.mjs';

// The Princess and the Pea, 1 (cover): at night, the princess sits wide awake on top of a very tall
// pile of colourful mattresses and quilts, her eyes wide and her mouth all wobbly: something is
// poking her! Far below, under the lowest mattress, peeps the tiny green pea. A moon and stars.
const P = pile({ n: 11, q: 3, w: 172, h: 10, seed: 2 });
const X = 250;
const PT = `translate(${X} 288)`;
const top = 288 + P.top;
// the night outside a tall arched window on the left: the moon and the stars
const win = 'M26 190L26 70C26 34 50 14 82 14C114 14 138 34 138 70L138 190Z';
const bars = 'M82 14L82 190M26 104L138 104';
const sill = 'M18 190L146 190L146 198L18 198Z';
const moon = 'M68 34C54 38 46 52 48 66C50 80 62 90 76 88C68 82 62 72 62 62C62 50 64 42 68 34Z';
const stars = [
  [112, 42, 4.5],
  [50, 128, 3.5],
  [118, 132, 4],
  [96, 72, 3],
  [66, 160, 3],
];
const starShapes = stars.map(([x, y, s]) => transformPath(star(s), `translate(${x} ${y})`)).join('');
const floor = 'M20 288C120 285 290 285 390 288';
// the pokes and wriggles: little jagged marks under her and wobble lines beside her
const pokes = `M${X - 46} ${top + 2}l-7 -6M${X + 46} ${top + 2}l7 -6M${X - 56} ${top - 30}q-5 5 0 10M${X - 62} ${top - 38}q-7 8 0 18M${X + 56} ${top - 30}q5 5 0 10M${X + 62} ${top - 38}q7 8 0 18`;

export default compose({
  title: 'The Princess and the Pea',
  seed: 811,
  washes: [
    { c: PAL.slate, o: 0.75, d: win },
    { c: PAL.sky, o: 0.5, d: win },
    { c: PAL.terracotta, o: 0.7, d: sill },
    { c: PAL.ochre, o: 1, d: moon },
    { c: PAL.grey, o: 0.3, d: 'M30 288C110 280 300 280 384 288C380 296 300 300 200 300C110 300 30 296 30 288Z' },
  ],
  lines: [floor, win, sill],
  fine: [moon, bars],
  whites: starShapes,
  once: `<path d="${pokes}"/>`,
  parts: [place(P.drawing, PT), place(princess({ mood: 'worried', sit: true, arms: [[[-12, -80, 7], [-22, -68, 6.5], [-30, -54, 6.5], [-33, -46, 6.5]], [[12, -80, 7], [22, -68, 6.5], [30, -54, 6.5], [33, -46, 6.5]]] }), `translate(${X + P.wob(13)} ${top}) scale(1.3)`)],
});
