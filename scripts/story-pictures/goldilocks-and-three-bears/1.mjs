import { PAL, hatch, transformPath, tufts } from '../lib.mjs';
import { compose, dot, goldilocks, place } from './characters.mjs';

// Goldilocks and the Three Bears, cover: in the woods, a little girl with golden curls and a posy of
// flowers peeps in at the open door of the bears' cottage, one hand on the door frame.
const ground = 'M0 252C80 249 160 254 240 252C310 250 360 253 400 251';

// The cottage: thatched roof, a chimney with a curl of smoke, a window and the open door.
const wall = 'M206 158L206 176M352 158L352 252';
const roof = 'M198 160C230 156 320 156 368 160L274 80Z';
const thatch = 'M226 140l10 10M246 120l12 14M270 100l12 16M290 118l10 12M312 132l8 10M332 146l6 8M250 146l6 6M300 146l6 8';
const chimney = 'M316 122L316 94L332 94L332 136';
const smoke = 'M324 88C318 80 330 74 324 66C318 58 330 52 326 44';
const doorway = 'M212 252L212 188C212 166 254 166 254 188L254 252';
const openDoor = 'M240 184L254 178L254 252L240 249Z';
const window = 'M290 182L334 182L334 216L290 216ZM312 182L312 216M290 199L334 199';
const box = 'M286 216L338 216L336 226L288 226Z';
const step = 'M206 252L260 252L256 260L210 260Z';
const flowersBox = dot(296, 211, 3.5) + dot(306, 209, 3.5) + dot(318, 211, 3.5) + dot(328, 209, 3.5);

// the whole cottage sits a little to the right of where it was drawn
const CT = 'translate(8 0)';
const C = (d) => transformPath(d, CT);

// Trees: a round oak on the left, the edge of another behind the cottage.
const trunk = 'M40 252C46 220 42 180 50 150M70 252C64 220 68 186 66 150M40 252C50 256 62 256 70 252';
const crown = 'M14 140C-4 122 6 92 30 90C34 64 70 54 88 70C110 62 132 82 120 104C136 118 124 146 100 144C86 154 60 152 50 146C34 154 20 150 14 140Z';
const crown2 = 'M372 160C360 150 362 128 376 124C376 104 400 98 410 104L410 160Z';
const trunk2 = 'M384 252L386 160M396 252L396 160';

// Her posy of flowers (held in her left hand)
const stems = 'M136 196L128 177M138 196L138 175M140 196L148 179';

export default compose({
  title: 'Goldilocks and the Three Bears',
  seed: 81,
  washes: [
    { c: PAL.green, o: 0.38, d: 'M0 248C80 245 160 250 240 248C310 246 360 249 400 247L400 290C300 294 100 292 0 290Z' },
    { c: PAL.green, o: 0.68, d: crown },
    { c: PAL.green, o: 0.35, d: 'M40 132C50 118 76 114 92 122C104 130 98 142 84 144C70 146 50 144 40 132Z' },
    { c: PAL.green, o: 0.6, d: crown2 },
    { c: PAL.ochre, o: 0.55, d: 'M42 250C46 220 44 180 50 152L66 152C66 186 64 220 68 250Z' },
    { c: PAL.ochre, o: 0.5, d: 'M384 252L386 160L396 160L396 252Z' },
    { c: PAL.ochre, o: 0.3, d: C('M206 158L352 158L352 252L206 252Z') },
    { c: PAL.ochre, o: 0.75, d: C(roof) },
    { c: PAL.terracotta, o: 0.35, d: C(roof) },
    { c: PAL.terracotta, o: 0.65, d: C('M316 122L316 94L332 94L332 136Z') },
    { c: PAL.slate, o: 0.8, d: C(`${doorway}Z`) },
    { c: PAL.ochre, o: 0.85, d: C(openDoor) },
    { c: PAL.sky, o: 0.6, d: C('M290 182L334 182L334 216L290 216Z') },
    { c: PAL.terracotta, o: 0.6, d: C(box) },
    { c: PAL.red, o: 0.8, d: C(flowersBox) },
    { c: PAL.grey, o: 0.5, d: C(step) },
    { c: PAL.red, o: 0.85, d: dot(128, 175, 4) + dot(148, 177, 4) },
    { c: PAL.ochre, o: 0.9, d: dot(138, 172, 4) },
  ],
  lines: [ground, ...[wall, roof, chimney, doorway, openDoor, window, box, step].map(C), trunk, crown, crown2, trunk2],
  fine: [
    ...[thatch, smoke, flowersBox, 'M243 216l4 0', 'M218 226l8 0M220 238l6 0'].map(C),
    stems,
    dot(128, 175, 4) + dot(148, 177, 4) + dot(138, 172, 4),
    'M28 112c3-5 8-5 10 0M70 80c3-5 8-5 10 0M100 104c3-5 8-5 10 0',
    hatch(24, 268, 200, 270, 9, 7, 168, 5),
    hatch(270, 268, 390, 268, 6, 7, 168, 7),
    tufts([[16, 251], [96, 252], [180, 253], [282, 252], [366, 252]], 9, 8),
  ],
  parts: [
    place(
      goldilocks({
        mood: 'peep',
        tilt: 8,
        arms: [
          [[-9, -64, 6], [-16, -54, 5], [-21, -44, 5], [-23, -38, 5]],
          [[9, -64, 6], [18, -60, 5], [27, -56, 5], [35, -53, 5]],
        ],
      }),
      'translate(160 252) rotate(10) scale(1.35)',
    ),
  ],
});
