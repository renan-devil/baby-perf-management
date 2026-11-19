import { PAL, rays, zed } from '../lib.mjs';
import { BRANCH_AT, compose, cockerel, dogAsleep, oak, place } from './characters.mjs';

// The Cockerel, the Dog and the Fox, 1 (cover): sunrise. On a high branch of the old oak the
// Cockerel throws back his head and crows, cock-a-doodle-doo! Down in the hollow at the foot of the
// trunk, the Dog is still curled up fast asleep. The characters are drawn in characters.mjs.

const f = (n) => Math.round(n * 10) / 10;

// the sun just coming up over the edge of the world, on the right
const SUN = [352, 262];
const sun = `M${SUN[0] - 24} ${SUN[1]}C${SUN[0] - 24} ${SUN[1] - 32} ${SUN[0] + 24} ${SUN[1] - 32} ${SUN[0] + 24} ${SUN[1]}Z`;
const sunRays = (() => {
  let d = '';
  for (let i = 0; i < 7; i++) {
    const a = Math.PI + ((i + 0.5) / 7) * Math.PI;
    const r1 = 30 + (i % 2) * 3;
    const r2 = 44 + (i % 2) * 6;
    d += `M${f(SUN[0] + Math.cos(a) * r1)} ${f(SUN[1] + Math.sin(a) * r1)}L${f(SUN[0] + Math.cos(a) * r2)} ${f(SUN[1] + Math.sin(a) * r2)}`;
  }
  return d;
})();
const glow = 'M286 262C290 232 318 214 352 214C384 214 400 230 400 240L400 262Z';

// the Cockerel on the branch, crowing up at the sky, with his song in curly marks
const CX = 290;
const C = `translate(${CX} ${f(BRANCH_AT(CX))}) rotate(-10) scale(1.45)`;
const song = 'M342 34C348 40 348 48 344 54M352 26C361 36 361 50 354 60M362 18C374 32 374 54 364 66';

// the Dog in the hollow
const D = 'translate(114 262) scale(1.2)';
const dogHole = 'M72 263C70 244 88 226 114 226C140 226 158 244 156 263Z';

export default compose({
  title: 'The Cockerel crows at sunrise',
  seed: 71,
  parts: [
    { washes: [{ c: PAL.rose, o: 0.3, d: glow }] },
    { washes: [{ c: PAL.ochre, o: 0.9, d: sun }], lines: [sun.replace(/Z$/, '')], fine: [sunRays] },
    oak({ hole: dogHole }),
    place(dogAsleep(), D),
    { fine: [zed(178, 226, 8), zed(194, 204, 10), zed(212, 180, 12)] },
    place(cockerel({ mood: 'crow' }), C),
    { fine: [song] },
  ],
});
