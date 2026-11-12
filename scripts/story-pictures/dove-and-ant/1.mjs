import { PAL, hatch, tufts } from '../lib.mjs';
import { ant, compose, dove, leaf, place } from './characters.mjs';

// The Dove and the Ant, 1 (cover): the little black ant has fallen into the blue river and kicks in
// the water; the white dove flies down low and drops a green leaf right next to her. Plop!
const river = 'M0 168C90 160 210 172 300 164C340 161 370 164 400 162L400 262C300 268 120 258 0 266Z';
const farBank = 'M0 168C90 160 210 172 300 164C340 161 370 164 400 162';
const nearBank = 'M0 266C120 258 300 268 400 262';
const trunk = 'M34 166C38 130 32 80 40 50M62 166C56 130 62 80 58 50';
const branch = 'M58 72C90 68 130 70 168 62M58 84C90 80 130 82 168 70';
const crown = 'M10 48C-4 38 4 18 24 18C34 4 70 4 80 18C96 16 104 32 96 44C104 58 88 70 72 64C60 74 32 72 24 62C10 64 2 56 10 48Z';
const twigLeaves = 'M168 62C176 54 186 54 190 60C182 66 174 66 168 64ZM132 72C134 62 142 58 148 62C144 70 138 72 132 72Z';
// ripples round the ant and the leaf, little splash drops, and the dotted path of the falling leaf
const ripples =
  'M200 236C214 246 262 246 280 234M190 244C210 256 266 256 292 242M112 222C100 230 106 238 122 240M286 220C298 226 300 234 290 240';
const waves = 'M30 200c8 -4 16 -4 24 0M80 226c8 -4 16 -4 24 0M300 196c8 -4 16 -4 24 0M330 236c8 -4 16 -4 24 0M60 246c8 -4 16 -4 24 0';
const drops = 'M296 196c-3 5 -3 8 0 9c3 -1 3 -4 0 -9ZM308 208c-2 4 -2 6 0 7c2 -1 2 -3 0 -7ZM206 196c-3 5 -3 8 0 9c3 -1 3 -4 0 -9ZM196 210c-2 4 -2 6 0 7c2 -1 2 -3 0 -7Z';
const fall = 'M200 130C186 148 170 172 158 204';

export default compose({
  title: 'The Dove and the Ant',
  seed: 83,
  washes: [
    { c: PAL.sky, o: 0.62, d: river },
    { c: PAL.green, o: 0.45, d: 'M0 166C90 158 210 170 300 162C340 159 370 162 400 160L400 146C300 150 100 142 0 150Z' },
    { c: PAL.green, o: 0.45, d: 'M0 264C120 256 300 266 400 260L400 292C300 298 100 296 0 294Z' },
    { c: PAL.green, o: 0.66, d: crown },
    { c: PAL.ochre, o: 0.55, d: 'M36 166C40 130 34 80 42 40L58 40C60 80 54 130 60 166Z' },
    { c: PAL.terracotta, o: 0.45, d: 'M58 73C90 69 130 71 168 63L168 69C130 81 90 79 58 83Z' },
    { c: PAL.green, o: 0.8, d: twigLeaves },
    { c: PAL.sky, o: 0.75, d: drops },
  ],
  lines: [farBank, nearBank, trunk, branch, crown],
  fine: [
    twigLeaves,
    ripples,
    waves,
    drops,
    hatch(44, 40, 56, 150, 7, 8, 110, 3),
    tufts([[16, 164], [92, 163], [250, 166], [360, 161], [40, 266], [200, 262], [370, 263]], 9, 8),
  ],
  once: `<path d="${fall}" stroke-dasharray="2 7"/>`,
  parts: [
    place(leaf(), 'translate(150 228) rotate(-6) scale(1.45)'),
    place(ant({ legs: 'kick' }), 'translate(244 238) rotate(-12) scale(1.75)'),
    place(dove({ wings: 'up' }), 'translate(262 116) rotate(-16) scale(1.45)'),
  ],
});
