import { PAL, hatch } from '../lib.mjs';
import { P_ARMS, S_ARMS, compose, distaff, merge, oldWoman, place, princess, spindle } from './characters.mjs';

// Picture 5: on her birthday the princess climbs the winding stair to the top of the old tower and
// finds, in a little room, an old woman spinning with a spindle.
const landing = 'M14 232L170 232';
const steps = 'M110 232L110 250L78 250L78 268L46 268L46 286L14 286';
const stepFronts = 'M110 250L170 250M78 268L140 268M46 286L110 286';
const towerWall = 'M14 232C6 180 10 120 30 70';
const arch = 'M176 232L176 118C176 58 386 58 386 118L386 232';
const archOuter = 'M164 232L164 116C164 44 396 44 396 116L396 232';
const roomFloor = 'M176 232L386 232';

// The old woman with her spindle and distaff, drawn as she sits (then mirrored to face the princess)
const SPIN = 'translate(284 232) scale(-1.45 1.45)';
const spinning = merge(
  place(distaff(), 'translate(-50 0) scale(0.72)'),
  oldWoman({ sit: true, look: 1, arms: S_ARMS.spin }),
  place(spindle({ thread: 4 }), 'translate(40 -44) scale(0.95)'),
  { fine: ['M-48 -80L-31 -73'] },
);

export default compose({
  title: 'The Old Woman Spinning',
  seed: 2505,
  washes: [
    { c: PAL.grey, o: 0.45, d: 'M14 232L170 232L170 250L110 250L110 268L78 268L78 286L14 286Z' },
    { c: PAL.grey, o: 0.22, d: 'M176 232L176 118C176 58 386 58 386 118L386 232Z' },
    { c: PAL.grey, o: 0.5, d: 'M164 232L164 116C164 44 396 44 396 116L396 232L386 232L386 118C386 58 176 58 176 118L176 232Z' },
  ],
  lines: [landing, steps, towerWall, arch, roomFloor],
  fine: [stepFronts, archOuter, hatch(190, 242, 380, 242, 7, 5, 160, 3)],
  parts: [
    place(princess({ mood: 'wow', look: 1, arms: P_ARMS.reach }), 'translate(112 232) scale(1.12)'),
    place(spinning, SPIN),
  ],
});
