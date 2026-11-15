import { PAL, hatch } from '../lib.mjs';
import { limb } from '../stone-soup/characters.mjs';
import { at, compose, dot, giant, goldenEgg, hen, jackHead, place, shine } from './characters.mjs';

// Jack and the Beanstalk, 6: the Giant sits at his huge table, his fork in his fist. "LAY!" he
// roars, pointing at his little brown hen, and plink! she lays an egg of pure, shining gold. From
// the big cold oven, Jack peeps out.
const G = 'translate(304 236) scale(1)';
const table = 'M150 206L400 206M150 206L150 226L400 226';
const tableFill = 'M150 206L400 206L400 226L150 226Z';
const legs = 'M164 226L164 300M184 226L184 300';
// the oven: a big brick oven with a round door, open
const oven = 'M8 300L8 132C8 120 18 114 30 114L118 114C130 114 138 120 138 132L138 300';
const mouth = 'M36 254L36 196C36 172 110 172 110 196L110 254Z';
const ovenDoor = 'M36 254L110 254L118 282L28 282Z';
const bricks = 'M8 150l30 0M60 150l40 0M120 150l18 0M8 290l20 0M120 290l18 0M24 132l0 18M84 132l0 18M8 272l20 0M118 272l20 0';
const fistR = [74, -104];
const [fx, fy] = at(fistR[0], fistR[1] + 40, G);
const fork = `M${fx} ${fy - 12}L${fx} ${fy - 50}M${fx - 7} ${fy - 50}L${fx + 7} ${fy - 50}M${fx - 7} ${fy - 50}L${fx - 7} ${fy - 62}M${fx} ${fy - 50}L${fx} ${fy - 64}M${fx + 7} ${fy - 50}L${fx + 7} ${fy - 62}`;
const [px, py] = at(-82, -146 + 40, G);
const finger = limb([[px - 8, py + 4, 8], [px - 20, py + 10, 7]]);
const J = 'translate(73 222) scale(1.15) rotate(-6)';

export default compose({
  title: 'The hen who lays golden eggs',
  seed: 263,
  washes: [
    { c: PAL.ochre, o: 0.22, d: 'M0 0L400 0L400 300L0 300Z' },
    { c: PAL.terracotta, o: 0.35, d: 'M0 290L400 290L400 300L0 300Z' },
    { c: PAL.grey, o: 0.6, rule: 'evenodd', d: `${oven}Z${mouth}` },
    { c: PAL.terracotta, o: 0.3, rule: 'evenodd', d: `${oven}Z${mouth}` },
    { c: PAL.slate, o: 0.55, d: mouth },
    { c: PAL.slate, o: 0.75, d: ovenDoor },
    { c: PAL.terracotta, o: 0.75, d: `${tableFill}M164 226L184 226L184 300L164 300Z` },
    { c: PAL.ochre, o: 0.4, d: tableFill },
  ],
  lines: [oven, mouth, ovenDoor, table, legs],
  fine: [bricks, hatch(200, 296, 390, 296, 6, 7, 170, 3), 'M44 268l66 0'],
  parts: [
    place(
      giant({
        mood: 'roar',
        seated: true,
        upper: true,
        tilt: -8,
        arms: [
          [[-48, -160, 22], [-70, -158, 20], [-82, -146, 19]],
          [[48, -160, 22], [70, -136, 20], fistR.concat(19)],
        ],
      }),
      G,
    ),
    { lines: [fork], washes: [{ c: PAL.grey, o: 0.8, d: `M${fx - 2} ${fy - 12}L${fx + 2} ${fy - 12}L${fx + 2} ${fy - 50}L${fx - 2} ${fy - 50}Z` }] },
    place(hen(), 'translate(198 206) scale(1.2)'),
    { lines: [finger], washes: [{ c: PAL.rose, o: 0.6, d: `${finger}Z` }] },
    place(goldenEgg(1.6), 'translate(164 206)'),
    place(shine(14), 'translate(164 194)'),
    place(jackHead({ mood: 'peep' }), J),
    { fine: [dot(52, 246, 5) + dot(96, 246, 5)], washes: [{ c: PAL.rose, o: 0.7, d: dot(52, 246, 5) + dot(96, 246, 5) }] },
  ],
});
