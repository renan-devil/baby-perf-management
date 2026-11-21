import { PAL, rays, tufts } from '../lib.mjs';
import { HEAD_TOP, P_ARMS, compose, dot, headT, oval, pail, perrette, place } from './characters.mjs';

// The Milkmaid and Her Pail, 1 (cover): Perrette walks along the road to market, step, step, a pail of
// milk balanced on her head. She smiles at her daydream: a little cloud with a chick and a pig in it.
const PT = 'translate(212 266) scale(1.55)';
const TILT = 4;
const road = 'M0 256C100 250 220 258 300 252C340 249 372 251 400 250L400 276C300 282 120 278 0 288Z';
const roadEdges = 'M0 256C100 250 220 258 300 252C340 249 372 251 400 250M0 288C120 278 300 282 400 276';
const hill = 'M282 251C304 222 330 206 358 204C378 203 392 208 400 212';
// a little tree on the hill
const tree = 'M352 206C352 190 351 176 353 166M359 206C358 190 359 176 357 166';
const treeCrown = 'M336 168C324 160 330 142 344 142C348 130 368 130 372 142C386 144 388 162 376 168C372 178 344 178 336 168Z';

// The dream cloud, top left, with a fluffy chick and a round little pig in it
const cloud =
  'M38 104C18 104 12 82 28 72C22 52 44 38 62 46C70 28 100 26 112 42C126 30 152 38 152 58C170 62 172 88 156 96C156 112 136 118 122 110C110 122 82 122 72 112C60 118 44 116 38 104Z';
const chickBody = oval(64, 88, 10, 8.5);
const chickHead = 'M66 76C66 68 78 66 80 74C81 80 74 83 68 81';
const chickBeak = 'M80 73L87 75L80 77';
const chickBits = 'M60 96L58 103M66 96L67 103M56 86q4 4 9 1';
const pigBody = oval(116, 82, 19, 13);
const pigSnout = oval(136, 78, 4.5, 5);
const pigBits = 'M124 69L128 61L132 70M104 93L104 101M112 95L112 101M122 94L122 101M130 91L131 99M97 80c-6 -3 -6 4 -2 4c3 0 2 -6 -3 -6';

export default compose({
  title: 'The Milkmaid and Her Pail',
  seed: 211,
  washes: [
    { c: PAL.green, o: 0.38, d: 'M0 252C100 246 220 254 300 248C340 245 372 247 400 246L400 300L0 300Z' },
    { c: PAL.green, o: 0.28, d: `${hill}L400 250L282 251Z` },
    { c: PAL.ochre, o: 0.45, d: road },
    { c: PAL.ochre, o: 0.5, d: 'M352 206C352 190 351 176 353 166L357 166C359 176 358 190 359 206Z' },
    { c: PAL.green, o: 0.6, d: treeCrown },
    { c: PAL.ochre, o: 0.7, d: dot(362, 42, 14) },
    { c: PAL.sky, o: 0.3, d: cloud },
    { c: PAL.ochre, o: 0.75, d: `${chickBody}${chickHead}C64 80 64 78 66 76Z` },
    { c: PAL.terracotta, o: 0.8, d: `${chickBeak}Z` },
    { c: PAL.rose, o: 0.75, d: `${pigBody}${pigSnout}` },
  ],
  whites: dot(164, 108, 4.2) + dot(178, 116, 3),
  lines: [roadEdges, hill, tree, treeCrown, cloud],
  fine: [
    dot(362, 42, 14),
    rays(362, 42, 19, 28, 9, 4),
    chickBody,
    chickHead,
    chickBeak,
    chickBits,
    pigBody,
    pigSnout,
    pigBits,
    dot(164, 108, 4.2),
    dot(178, 116, 3),
    'M70 266c4 -2 8 -2 12 0M150 282c4 -2 8 -2 12 0M300 268c4 -2 8 -2 12 0',
    'M348 150c3 -4 7 -4 9 0M362 158c3 -4 7 -4 9 0',
    tufts([[18, 250], [120, 252], [290, 250], [390, 249]], 9, 5),
  ],
  fills: dot(74, 74, 1.4) + dot(127, 75, 1.4) + dot(134.5, 78, 0.9) + dot(137.5, 78, 0.9),
  parts: [place(perrette({ arms: P_ARMS.steady, legs: 'walk', tilt: TILT }), PT), place(pail(), `${PT} ${headT(TILT)} translate(0 ${HEAD_TOP})`)],
});
