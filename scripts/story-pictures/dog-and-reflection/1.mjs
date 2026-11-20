import { PAL, hatch, rays, tufts } from '../lib.mjs';
import { FEET, compose, dog, place } from './characters.mjs';

// The Dog and His Reflection, 1 (cover): very pleased with himself, the Dog trots home along the
// road with the butcher's big bone held tight in his mouth. The Dog is drawn in characters.mjs.

const f = (n) => Math.round(n * 10) / 10;

// the road, winding away to the little village on the hill behind
// (the far edge stops behind the Dog, so it does not show through him)
const road = 'M0 238C40 235 80 234 110 234M268 230C310 224 350 216 380 206M0 290C120 284 260 282 400 266';
const roadWash = 'M0 238C90 232 200 236 290 226C330 222 360 214 380 206L400 204L400 266C260 282 120 284 0 290Z';
const hill = 'M0 214C40 200 90 192 140 196M300 210C330 196 370 190 400 192';
const field =
  'M0 238C90 232 200 236 290 226C330 222 360 214 380 206L400 204L400 192C370 190 330 196 300 210C260 214 200 212 140 196C90 192 40 200 0 214ZM0 290C120 284 260 282 400 266L400 300L0 300Z';

// the village where the butcher lives, small on the hill on the left
const houses = 'M40 205L40 186L52 176L64 186L64 203M36 188L52 172L68 188M70 202L70 190L80 182L90 190L90 200M66 192L80 178L94 192';
const roofs = 'M36 188L52 172L68 188L64 186L52 176L40 186ZM66 192L80 178L94 192L90 190L80 182L70 190Z';
const walls = 'M40 205L40 186L52 176L64 186L64 203ZM70 202L70 190L80 182L90 190L90 200Z';
const windows = 'M48 192l0 6l6 0l0 -6zM77 192l0 5l5 0l0 -5z';

// the sun, high on the right
const SUN = [338, 62];
const sun = `M${SUN[0] - 18} ${SUN[1]}a18 18 0 1 0 36 0a18 18 0 1 0 -36 0Z`;

// the Dog, trotting to the right along the road
const DX = 196;
const DY = 256;
const S = 1.9;
const D = `translate(${DX} ${f(DY - FEET * S)}) scale(${S})`;
// trot, trot: little dust puffs behind his heels, and two birds over the village
const puffs = 'M92 250c-4 -6 2 -10 6 -6c2 -6 10 -4 9 2M72 258c-3 -4 1 -8 5 -5c2 -4 8 -3 7 2';
const birds = 'M96 150q6 -6 12 0M84 166q6 -6 12 0';

export default compose({
  title: 'The Dog trots home with his bone',
  seed: 81,
  parts: [
    {
      washes: [
        { c: PAL.green, o: 0.4, d: field },
        { c: PAL.ochre, o: 0.4, d: roadWash },
        { c: PAL.grey, o: 0.3, d: roadWash },
        { c: PAL.ochre, o: 0.9, d: sun },
        { c: PAL.terracotta, o: 0.85, d: roofs },
        { c: PAL.paper, o: 1, d: walls },
      ],
      lines: [road],
      fine: [
        hill,
        houses,
        windows,
        sun,
        rays(SUN[0], SUN[1], 24, 34, 10, 4),
        hatch(30, 266, 140, 264, 5, 5, 150, 5),
        hatch(270, 262, 380, 254, 5, 5, 150, 6),
        tufts([[20, 236], [320, 222], [370, 208], [30, 296], [370, 290]], 9, 7),
        puffs,
        birds,
      ],
    },
    place(dog({ pose: 'trot' }), D),
  ],
});
