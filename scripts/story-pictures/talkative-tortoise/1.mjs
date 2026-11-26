import { PAL, hatch, tufts } from '../lib.mjs';
import { compose, goose, place, tortoise } from './characters.mjs';

// The Talkative Tortoise, cover: at the edge of her pond the tortoise chatters away, mouth wide
// open, while her two friends the white geese stand and listen patiently (one is nodding off).
const ground = 'M0 236C60 232 120 238 180 236C250 234 320 238 400 234';
const pondEdge = 'M120 256C150 246 250 244 300 254C330 262 320 280 280 286C220 294 150 292 120 282C100 274 104 262 120 256Z';
const ripples = 'M160 266c16 -3 34 -3 48 0M230 276c14 -2 26 -2 38 0M176 282c10 -1 20 -1 30 0';
// her chatter: loopy scribbles and little bursts flying from her open mouth
const chatter =
  'M196 172c4 -10 11 -10 9 0c-2 10 8 10 10 0c2 -10 10 -10 10 0' +
  'M200 144c4 -9 11 -9 9 0c-2 9 7 9 9 0' +
  'M200 208c4 -8 10 -8 8 0c-2 8 6 8 8 0';
const bursts = 'M190 166l6 -7M194 188l8 0M192 206l5 5';

const T = 'translate(84 238) scale(1.25)';

export default compose({
  title: 'The Talkative Tortoise',
  seed: 41,
  washes: [
    { c: PAL.green, o: 0.34, d: 'M0 232C60 228 120 234 180 232C250 230 320 234 400 230L400 300L0 300Z' },
    { c: PAL.sky, o: 0.7, d: pondEdge },
    { c: PAL.sky, o: 0.22, d: 'M70 70C84 44 140 40 168 54C196 38 250 46 254 72C258 92 220 100 190 94C160 104 100 100 84 90C72 84 66 78 70 70Z' },
  ],
  lines: [ground, pondEdge, chatter],
  fine: [
    ripples,
    bursts,
    hatch(20, 270, 100, 272, 6, 6, 160, 3),
    hatch(330, 272, 390, 268, 4, 6, 160, 4),
    tufts([[20, 234], [196, 236], [384, 234]], 9, 5),
  ],
  parts: [
    place(tortoise({ mouth: 'chat' }), T),
    place(goose({ sleepy: true }), 'translate(352 234) scale(-0.9 0.9)'),
    place(goose(), 'translate(276 240) scale(-1 1)'),
  ],
});
