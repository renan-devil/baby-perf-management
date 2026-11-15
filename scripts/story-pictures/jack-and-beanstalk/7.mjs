import { PAL, hatch, zed } from '../lib.mjs';
import { compose, giant, hen, jack, place } from './characters.mjs';

// Jack and the Beanstalk, 7: the Giant has fallen asleep in his big armchair, snoring so loudly
// that the plates rattle (z z z). Jack tiptoes away on the tips of his toes, the little brown hen
// tucked under his arm.
const C = 'translate(290 278) scale(0.98)';
// the armchair (in the Giant's coordinates): a tall back and two fat arms
const back = 'M-92 -60L-92 -214C-92 -252 92 -252 92 -214L92 -60';
// the Giant hides the middle of the back: leave his head and shoulders out of its wash
const hole = 'M-60 -60L-60 -112C-60 -128 -46 -130 -32 -130C-42 -166 -22 -196 4 -196C30 -196 46 -168 36 -130C48 -130 60 -128 60 -112L60 -40Z';
const armL = 'M-112 0L-112 -96C-112 -110 -76 -110 -76 -96L-76 0';
const armR = 'M112 0L112 -96C112 -110 76 -110 76 -96L76 0';
const chair = { lines: [back, armL, armR], washes: [{ c: PAL.green, o: 0.7, rule: 'evenodd', d: `${back}Z${hole}` }, { c: PAL.green, o: 0.7, d: `${armL}Z${armR}Z` }, { c: PAL.slate, o: 0.25, rule: 'evenodd', d: `${back}Z${hole}` }] };

export default compose({
  title: 'The Giant snores',
  seed: 271,
  washes: [
    { c: PAL.ochre, o: 0.22, d: 'M0 0L400 0L400 300L0 300Z' },
    { c: PAL.terracotta, o: 0.35, d: 'M0 286L400 286L400 300L0 300Z' },
  ],
  fine: [zed(330, 66, 11), zed(350, 40, 15), zed(372, 8, 18), hatch(10, 294, 390, 294, 9, 7, 170, 3)],
  parts: [
    place(chair, C),
    place(
      giant({
        mood: 'sleep',
        seated: true,
        tilt: 14,
        arms: [
          [[-48, -160, 22], [-74, -134, 20], [-90, -110, 19]],
          [[48, -160, 22], [74, -134, 20], [90, -110, 19]],
        ],
      }),
      C,
    ),
    place(
      jack({
        mood: 'hush',
        tilt: -6,
        arms: [
          [[-16, -84, 8], [-30, -80, 7.5], [-36, -70, 7]],
          [[16, -84, 8], [28, -80, 7.5], [40, -86, 7]],
        ],
        legs: [
          { pts: [[-8, -47, 10], [-16, -28, 9.5], [-22, -12, 9]], dir: -1 },
          { pts: [[8, -47, 10], [18, -30, 9.5], [26, -22, 9]], dir: 1 },
        ],
      }),
      'translate(96 280) scale(1.2)',
    ),
    place(hen(), 'translate(58 206) scale(-1.05 1.05)'),
  ],
});
