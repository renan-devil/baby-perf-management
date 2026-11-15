import { PAL, hatch } from '../lib.mjs';
import { at, brush, compose, emperor, emperorSeatedOutline, maLiang, place } from './characters.mjs';
import { transformPath } from '../lib.mjs';

// Ma Liang and the Magic Paintbrush, 7: in his palace, the Emperor in his yellow robe sits on his
// golden throne and points at Ma Liang: "Paint me a mountain of gold!" Ma Liang thinks hard.
const E = 'translate(272 272) scale(1.08)';
const M = 'translate(86 280) scale(1.12)';
const hand = [24, -58];
const [hx, hy] = at(...hand, M);
const back = 'M196 250L196 96C196 66 226 52 272 52C318 52 348 66 348 96L348 250Z';
const panel = 'M212 236L212 102C212 80 236 70 272 70C308 70 332 80 332 102L332 236Z';
const seat = 'M186 236L358 236L362 262L182 262Z';
const armL = 'M186 236L186 190C186 182 198 182 198 190L198 236';
const armR = 'M346 236L346 190C346 182 358 182 358 190L358 236';
const step = 'M168 262L376 262L384 284L160 284Z';
// the throne's colours stop round the Emperor, so his yellow robe stays yellow
const hole = transformPath(emperorSeatedOutline(), E);
const pillar = 'M14 0L14 284M40 0L40 284';

export default compose({
  title: 'Before the Emperor',
  seed: 877,
  washes: [
    { c: PAL.ochre, o: 0.2, d: 'M0 0L400 0L400 284L0 284Z' },
    { c: PAL.red, o: 0.8, d: 'M14 0L40 0L40 284L14 284Z' },
    { c: PAL.terracotta, o: 0.45, d: 'M0 284L400 284L400 300L0 300Z' },
    { c: PAL.ochre, o: 0.9, d: back + hole, rule: 'evenodd' },
    { c: PAL.red, o: 0.75, d: panel + hole, rule: 'evenodd' },
    { c: PAL.ochre, o: 0.9, d: `${seat}${hole}`, rule: 'evenodd' },
    { c: PAL.ochre, o: 0.9, d: `${armL}Z${armR}Z` },
    { c: PAL.red, o: 0.7, d: step + hole, rule: 'evenodd' },
  ],
  lines: [back, seat, armL, armR, step, pillar],
  fine: [panel, 'M240 90q32 -20 64 0', hatch(60, 292, 150, 292, 3, 6, 175, 877), 'M10 284L400 284'],
  parts: [
    place(
      emperor({
        mood: 'greedy',
        seated: true,
        arms: [
          [[-22, -116, 14], [-48, -112, 13], [-74, -116, 12]],
          [[22, -116, 14], [34, -94, 14], [26, -76, 13]],
        ],
      }),
      E,
    ),
    place(
      maLiang({
        mood: 'think',
        tilt: -6,
        arms: [
          [[-16, -84, 8], [-24, -98, 7.5], [-8, -104, 7]],
          [[16, -84, 8], [22, -71, 7.5], [hand[0], hand[1], 7]],
        ],
      }),
      M,
    ),
    place(brush({ shine: false }), `translate(${hx} ${hy}) rotate(10) scale(1.2)`),
  ],
});
