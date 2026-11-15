import { PAL } from '../lib.mjs';
import { bumpy, cloud, compose, giantWife, jack, place } from './characters.mjs';

// Jack and the Beanstalk, 5: up in the clouds, the enormous castle door has creaked open, and there
// stands a very, very big lady, the Giant's wife. She bends down and looks at little Jack, standing
// on the soft white cloud: "Goodness me, a little boy!"
const arch = 'M178 292L178 96C178 20 362 20 362 96L362 292';
const archFill = `${arch}Z`;
const wall = 'M150 300L150 0L400 0L400 300Z';
const leafD = 'M362 292L362 92C372 60 384 44 396 40L396 300Z';
const stones =
  'M154 60l20 0M154 130l20 0M154 200l20 0M154 262l20 0M164 60l0 70M166 200l0 62M168 130l0 70M166 0l0 60';
// soft cloud floor along the bottom, outside the door
const floor = bumpy(84, 300, 110, 22, 8, 1.25, -170);

export default compose({
  title: 'The giant lady',
  seed: 251,
  washes: [
    { c: PAL.sky, o: 0.32, d: 'M0 0L150 0L150 300L0 300Z' },
    { c: PAL.grey, o: 0.6, rule: 'evenodd', d: `${wall}${archFill}` },
    { c: PAL.slate, o: 0.32, d: archFill },
    { c: PAL.terracotta, o: 0.8, d: leafD },
    { c: PAL.ochre, o: 0.35, d: leafD },
  ],
  lines: ['M150 0L150 292', arch, leafD.replace('Z', '')],
  fine: [stones, 'M376 60L376 296M388 46L388 298', 'M170 292L370 292'],
  whites: floor,
  parts: [
    { lines: [floor] },
    cloud(70, 100, 50, 20, 7, 4),
    place(
      giantWife({
        mood: 'wowL',
        tilt: -16,
        arms: [
          [[-40, -160, 18], [-62, -132, 17], [-82, -110, 16]],
          [[40, -160, 18], [58, -130, 17], [66, -100, 16]],
        ],
      }),
      'translate(268 290) scale(1.02)',
    ),
    place(
      jack({
        mood: 'happy',
        tilt: 14,
        arms: [
          [[-16, -84, 8], [-24, -72, 7.5], [-26, -58, 7]],
          [[16, -84, 8], [30, -96, 7.5], [36, -114, 7]],
        ],
      }),
      'translate(92 282) scale(0.56)',
    ),
  ],
});
