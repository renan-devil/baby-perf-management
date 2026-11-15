import { PAL } from '../lib.mjs';
import { bedroomWindow, compose, pile, place, princess } from './characters.mjs';

// The Princess and the Pea, 1 (cover): at night, the princess sits wide awake on top of a very tall
// pile of colourful mattresses and quilts, her eyes wide and her mouth all wobbly: something is
// poking her! Far below, under the lowest mattress, peeps the tiny green pea. Through the window:
// the moon and the stars.
const P = pile({ n: 11, q: 3, w: 172, h: 10, seed: 2 });
const X = 250;
const PT = `translate(${X} 288)`;
const top = 288 + P.top;
const floor = 'M20 288C120 285 290 285 390 288';
// the pokes and wriggles: little jagged marks under her and wobble lines beside her
const pokes = `M${X - 46} ${top + 2}l-7 -6M${X + 46} ${top + 2}l7 -6M${X - 56} ${top - 30}q-5 5 0 10M${X - 62} ${top - 38}q-7 8 0 18M${X + 56} ${top - 30}q5 5 0 10M${X + 62} ${top - 38}q7 8 0 18`;

export default compose({
  title: 'The Princess and the Pea',
  seed: 811,
  washes: [
    { c: PAL.grey, o: 0.3, d: 'M30 288C110 280 300 280 384 288C380 296 300 300 200 300C110 300 30 296 30 288Z' },
  ],
  lines: [floor],
  once: `<path d="${pokes}"/>`,
  parts: [place(bedroomWindow(), 'translate(18 198)'), place(P.drawing, PT), place(princess({ mood: 'worried', sit: true, arms: [[[-12, -80, 7], [-22, -68, 6.5], [-30, -54, 6.5], [-33, -46, 6.5]], [[12, -80, 7], [22, -68, 6.5], [30, -54, 6.5], [33, -46, 6.5]]] }), `translate(${X + P.wob(13)} ${top}) scale(1.3)`)],
});
