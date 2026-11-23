import { PAL, transformPath } from '../lib.mjs';
import { compose, dot, place, rabbit, sparkle } from './characters.mjs';

// The Velveteen Rabbit, 1 (cover): on Christmas morning the velveteen rabbit, white with brown spots
// and pink satin ears, sits at the top of the Boy's red stocking, with a sprig of holly tucked in.
const R = 'translate(196 194) scale(1.3)';
const cuff =
  'M136 164C150 158 168 166 184 160C200 156 220 164 236 158C248 156 258 160 266 166C270 176 268 188 264 198C248 202 232 196 216 200C198 204 178 198 160 202C150 202 142 200 136 198C132 188 132 174 136 164Z';
const leg = 'M150 201C150 220 152 236 150 248C148 256 132 260 112 262C92 264 80 272 82 282C84 292 100 294 124 292C170 290 214 286 238 276C252 268 254 252 252 236C251 222 250 210 250 199';
const legFill = `${leg}C230 196 200 202 180 200C168 200 158 202 150 201Z`;
const stripes = 'M151 222C180 218 220 220 251 218M152 240C180 236 220 238 252 236M100 266C96 274 96 284 104 292M238 276C230 266 226 256 228 246';
const fluff = 'M146 172c4 3 8 2 10 -1M170 182c4 3 8 2 10 -1M206 174c4 3 8 2 10 -1M236 184c4 3 8 2 10 -1M252 172c3 2 6 2 8 -1';
// his two front paws resting on the cuff
const paws = 'M172 164C170 156 180 152 186 158M206 158C212 152 222 156 220 164';
// holly: two spiky leaves and three red berries, tucked in at the right of the cuff
const leaf = 'M0 0Q4 -6 8 -4Q10 -10 15 -7Q19 -12 23 -8Q28 -9 33 0Q28 9 23 8Q19 12 15 7Q10 10 8 4Q4 6 0 0Z';
const vein = 'M2 0L30 0';
const L1 = 'translate(258 172) rotate(-40) scale(1.6)';
const L2 = 'translate(258 172) rotate(10) scale(1.5)';
const L3 = 'translate(256 174) rotate(-95) scale(1.35)';
const leaves = [L1, L2, L3].map((t) => transformPath(leaf, t)).join('');
const veins = [L1, L2, L3].map((t) => transformPath(vein, t)).join('');
const berries = dot(248, 170, 5) + dot(241, 178, 4.6) + dot(251, 180, 4.4);

export default compose({
  title: 'The velveteen rabbit in the Christmas stocking',
  seed: 4201,
  washes: [
    { c: PAL.red, o: 0.8, d: legFill },
    { c: PAL.grey, o: 0.15, d: cuff },
    { c: PAL.ochre, o: 0.14, d: 'M172 164C170 156 180 152 186 158L188 162ZM206 158C212 152 222 156 220 164L204 162Z' },
    { c: PAL.green, o: 0.85, d: leaves },
    { c: PAL.red, o: 0.95, d: berries },
  ],
  whites: dot(246.5, 168.5, 1.4) + dot(239.5, 176.5, 1.3),
  lines: [leg, cuff, leaves],
  fine: [paws, stripes, fluff, veins, berries, sparkle(76, 92, 9), sparkle(330, 70, 7), sparkle(318, 236, 8), sparkle(64, 210, 6), sparkle(110, 46, 5)],
  parts: [place(rabbit({ mood: 'happy', look: [0, 0], upper: true }), R)],
});
