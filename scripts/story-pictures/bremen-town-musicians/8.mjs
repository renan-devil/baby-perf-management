import { PAL, tufts } from '../lib.mjs';
import { cat, compose, dog, donkey, note, place, rooster } from './characters.mjs';

// The Bremen Town Musicians, 8: at the robbers' window the four friends stand on each other's backs
// (Donkey, Dog, Cat and Rooster on top) and sing as loudly as they can.
const ground = 'M0 284C100 280 300 286 400 282';
const wall = 'M262 300L262 0';
const win = 'M290 110L380 110L380 214L290 214Z';
const winBars = 'M335 110L335 214M290 162L380 162';
const sill = 'M282 214L388 214L390 224L280 224Z';
const stones = 'M276 60l14 0M300 80l16 0M350 70l16 0M272 250l16 0M320 246l14 0M362 262l16 0M276 150l10 0';
const moon = 'M20 34C20 22 30 14 40 14C32 20 30 28 32 36C34 46 42 52 52 52C46 58 38 60 32 58C24 56 20 46 20 34Z';
// loud sound marks spreading from the four open mouths
const sound =
  'M232 204q8 4 10 12M238 194q14 6 16 22M188 160q8 0 10 8M192 150q14 0 18 14M172 132q6 -2 10 4M176 122q10 -4 16 6M190 40q8 -4 14 2M194 28q12 -8 22 2';
const notes = [note(84, 120, 1, -10), note(72, 80, 0.9, 8), note(110, 40, 1.1, -6), note(230, 70, 0.9, 10)];

export default compose({
  title: 'Hee-haw! Woof! Miaow! Cock-a-doodle-doo!',
  seed: 68,
  washes: [
    { c: PAL.slate, o: 0.45, d: 'M0 0L262 0L262 300L0 300Z' },
    { c: PAL.ochre, o: 0.8, d: moon },
    { c: PAL.terracotta, o: 0.55, d: `M262 300L262 0L400 0L400 300Z${win}`, rule: 'evenodd' },
    { c: PAL.slate, o: 0.3, d: `M262 300L262 0L400 0L400 300Z${win}`, rule: 'evenodd' },
    { c: PAL.ochre, o: 0.75, d: win },
    { c: PAL.terracotta, o: 0.8, d: sill },
    { c: PAL.green, o: 0.3, d: `${ground}L400 300L0 300Z` },
  ],
  lines: [ground, wall, win, sill, moon],
  fine: [winBars, stones, sound, ...notes.flatMap((n) => n.fine), 'M70 20l0 8M66 24l8 0M220 120l0 6M217 123l6 0', tufts([[30, 284], [240, 284], [380, 284]], 9, 2)],
  fills: notes.flatMap((n) => n.fills).map((d) => `<path d="${d}"/>`).join(''),
  parts: [
    place(donkey({ mouth: 'open' }), 'translate(146 286) scale(0.8)'),
    place(dog({ mouth: 'open' }), 'translate(124 213) scale(0.8)'),
    place(cat({ mouth: 'open' }), 'translate(118 166) scale(0.8)'),
    place(rooster({ pose: 'crow' }), 'translate(143 123) scale(0.66)'),
  ],
});
