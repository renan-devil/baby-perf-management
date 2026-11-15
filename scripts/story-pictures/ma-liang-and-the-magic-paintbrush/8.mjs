import { PAL, hatch, transformPath } from '../lib.mjs';
import { at, boat, boatSail, brush, compose, emperor, maLiang, place, sparkle, waves } from './characters.mjs';

// Ma Liang and the Magic Paintbrush, 8: on the palace terrace, Ma Liang paints the wide blue sea
// and a big boat with a red sail; far away shines the island with its mountain of gold, and the
// Emperor points at it, delighted.
const E = 'translate(62 280) scale(0.92)';
const M = 'translate(148 282) scale(1.02)';
const hand = [40, -86];
const [hx, hy] = at(...hand, M);
const terrace = 'M0 236L196 236L210 300L0 300Z';
const BOAT = 'translate(292 262) scale(0.72)';
// the sea stops round the red sail, so the sail stays red
const sailHole = transformPath(boatSail({ sail: 'flat' }), BOAT);
const sea = 'M190 162C260 158 330 158 400 162L400 300L206 300L194 236Z';
const island = 'M296 166C306 150 352 148 368 166Z';
const gold = 'M310 160L332 112L354 160Z';
const glitter = [sparkle(332, 104, 7), sparkle(306, 128, 5), sparkle(360, 130, 5)].join('');

export default compose({
  title: 'Painting the sea',
  seed: 888,
  washes: [
    { c: PAL.sky, o: 0.25, d: 'M0 0L400 0L400 236L0 236Z' },
    { c: PAL.sky, o: 0.85, d: sea + sailHole, rule: 'evenodd' },
    { c: PAL.slate, o: 0.25, d: sea + sailHole, rule: 'evenodd' },
    { c: PAL.green, o: 0.7, d: island },
    { c: PAL.ochre, o: 0.95, d: gold },
    { c: PAL.ochre, o: 0.95, d: glitter },
    { c: PAL.terracotta, o: 0.5, d: terrace },
    { c: PAL.red, o: 0.8, d: 'M0 0L18 0L18 236L0 236Z' },
  ],
  lines: [terrace, gold, island, 'M18 0L18 236'],
  fine: [
    glitter,
    'M318 146L332 120M340 150L346 132',
    waves(214, 400, 196, 4, 7),
    waves(212, 400, 290, 4, 6),
    waves(270, 400, 172, 3, 4),
    'M0 262L200 262M0 284L206 284',
    hatch(40, 248, 180, 248, 4, 5, 175, 888),
  ],
  parts: [
    place(boat({ sail: 'flat' }), BOAT),
    place(
      emperor({
        mood: 'greedy',
        arms: [
          [[-22, -116, 14], [-34, -96, 14], [-30, -78, 13]],
          [[22, -116, 13], [40, -128, 12], [58, -140, 11]],
        ],
      }),
      E,
    ),
    place(
      maLiang({
        mood: 'happy',
        tilt: 6,
        arms: [
          [[-16, -84, 8], [-24, -72, 7.5], [-22, -58, 7]],
          [[16, -84, 8], [30, -88, 7.5], [hand[0], hand[1], 7]],
        ],
      }),
      M,
    ),
    place(brush({ shine: false, wet: PAL.sky }), `translate(${hx} ${hy}) rotate(70) scale(1.25)`),
  ],
});
