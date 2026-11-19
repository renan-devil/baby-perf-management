import { BRANCH_AT, compose, cockerel, dogLeap, foxRunning, oak, place } from './characters.mjs';

// The Cockerel, the Dog and the Fox, 2: the Fox knocked at the "door" at the foot of the tree, and
// out jumps the Dog, barking WOOF! WOOF! The Fox runs off as fast as he can, his tail flying out
// behind him like a flag, while up on his branch the Cockerel laughs and laughs. Same oak and same
// characters as the cover (characters.mjs).

const f = (n) => Math.round(n * 10) / 10;

// the Cockerel, in the same spot as on the cover, leaning back with laughter
const CX = 290;
const C = `translate(${CX} ${f(BRANCH_AT(CX))}) rotate(-16) scale(1.45)`;
const laugh = 'M338 52l9 -3M336 64l9 3M334 40l7 -7M326 30l3 -9';

// the Dog bounding out of the hollow, and his barks
const D = 'translate(192 214) rotate(-20) scale(1.4)';
// two barks: a fan of short strokes from his open mouth, and a wider one beyond it
const fan = (cx, cy, r1, r2, angles) =>
  angles
    .map((a) => {
      const r = (a * Math.PI) / 180;
      return `M${f(cx + Math.cos(r) * r1)} ${f(cy + Math.sin(r) * r1)}L${f(cx + Math.cos(r) * r2)} ${f(cy + Math.sin(r) * r2)}`;
    })
    .join('');
const woof = fan(250, 176, 14, 25, [-56, -28, 0, 26]) + fan(250, 176, 32, 42, [-44, -18, 8]);
const kickUp = 'M150 252l-6 -6M160 256l-3 -8M136 258l-8 -3';

// the Fox running away to the right, with speed lines and puffs of dust at his heels
const F = 'translate(326 240) rotate(2) scale(1.2)';
const speed = 'M262 200L296 198M252 210L280 209M272 256L298 256M266 247L286 246';

export default compose({
  title: 'The Dog jumps out, and the Fox runs away',
  seed: 72,
  parts: [
    oak(),
    place(dogLeap(), D),
    { fine: [woof, kickUp] },
    { fine: [speed] },
    place(foxRunning(), F),
    place(cockerel({ mood: 'laugh' }), C),
    { fine: [laugh] },
  ],
});
