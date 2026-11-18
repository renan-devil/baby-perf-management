import { PAL, transformPath } from '../lib.mjs';
import { cinderella, clock, compose, moon, place, slipper, sparkles } from './characters.mjs';

// Cinderella, 7: the palace clock strikes twelve, both its hands pointing straight up. Cinderella
// runs down the palace stairs as fast as she can, her skirt flying, looking back in fright; behind
// her, on a step, one glass slipper is left shining. Through a tall window the moon is up.
const stairs = 'M0 180L104 180L104 198L160 198L160 216L216 216L216 234L272 234L272 252L328 252L328 270L400 270';
const stone = `${stairs}L400 300L0 300Z`;
// the outline is left open where her skirt sweeps over the steps
const stairsSeen = 'M0 180L104 180L104 198L160 198L160 216L182 216M236 234L272 234L272 252L328 252L328 270L400 270';
const nosings = 'M104 198L104 300M160 216L160 300M216 240L216 300M272 252L272 300M328 270L328 300';
// the tall night window with the moon and stars
const moonD = transformPath(moon, 'translate(334 58) scale(0.9)');
const win = 'M308 150L308 60C308 36 324 22 344 22C364 22 380 36 380 60L380 150Z';
const bars = 'M344 22L344 150M308 96L380 96';
const sill = 'M300 150L388 150L388 158L300 158Z';
// the clock's chime: little curved strokes round it
const chime = 'M126 40q8 -4 12 -12M134 64q10 0 16 -6M128 90q8 4 14 2';

export default compose({
  title: 'The Stroke of Midnight',
  seed: 1207,
  washes: [
    { c: PAL.grey, o: 0.4, d: stone },
    { c: PAL.rose, o: 0.25, d: stone },
    { c: PAL.slate, o: 0.75, d: `${win}${moonD}`, rule: 'evenodd' },
    { c: PAL.sky, o: 0.5, d: `${win}${moonD}`, rule: 'evenodd' },
    { c: PAL.terracotta, o: 0.7, d: sill },
    { c: PAL.ochre, o: 1, d: moonD },
  ],
  whites: ['M366 64l1.4 4.6l4.6 1.4l-4.6 1.4l-1.4 4.6l-1.4 -4.6l-4.6 -1.4l4.6 -1.4Z', 'M326 120l1.2 3.6l3.6 1.2l-3.6 1.2l-1.2 3.6l-1.2 -3.6l-3.6 -1.2l3.6 -1.2Z', 'M362 128l1 3l3 1l-3 1l-1 3l-1 -3l-3 -1l3 -1Z'].join(''),
  lines: [stairsSeen, win, sill],
  fine: [nosings, bars, moonD, chime],
  parts: [
    place(clock(48), 'translate(72 66)'),
    place(slipper(), 'translate(134 192)'),
    sparkles([[164, 168, 5], [112, 170, 4]]),
    place(
      cinderella({
        gown: true,
        hem: 'swish',
        mood: 'wow',
        look: -1,
        tilt: -10,
        arms: [
          [[-12, -80, 7], [-24, -78, 6.5], [-36, -82, 6.5], [-44, -86, 6.5]],
          [[12, -80, 7], [22, -70, 6.5], [32, -64, 6.5], [38, -66, 6.5]],
        ],
      }),
      'translate(246 234) rotate(10) scale(1.12)',
    ),
    { fine: ['M186 120l-16 0M182 140l-20 0M186 160l-14 0'] },
  ],
});
