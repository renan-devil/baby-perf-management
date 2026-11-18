import { PAL } from '../lib.mjs';
import { S_ARMS, cinderella, compose, oval, place, sister } from './characters.mjs';

// Cinderella, 2: in her plain dress and patched apron, Cinderella brushes the hair of the stepsister
// in gold, who sits on a stool with her eyes shut, very pleased with herself. The stepsister in red
// stands with one hand on her hip and holds up a hand mirror, gazing at herself with haughty,
// heavy-lidded eyes.
const floor = 'M20 272C120 269 290 269 384 272';
// the stool (seat at y = 214)
// a wide cushioned stool: its ends and legs show on each side of her spreading skirt
const stoolEnds = 'M150 220L134 220C130 220 130 232 134 232L150 232M230 220L246 220C250 220 250 232 246 232L230 232';
const stoolLegs = 'M138 232L134 272M242 232L246 272';
// the hairbrush in Cinderella's raised hand: a wooden handle and a back with bristles underneath
const brushT = 'translate(150 117) rotate(-32)';
const brush = { lines: ['M-12 -2L6 -2L6 2L-12 2Z', 'M6 -5L26 -5C29 -5 29 3 26 3L6 3Z'], fine: ['M9 3l0 4M13 3l0 4M17 3l0 4M21 3l0 4M25 3l0 4'], washes: [{ c: PAL.terracotta, o: 0.85, d: 'M-12 -2L6 -2L6 2L-12 2ZM6 -5L26 -5C29 -5 29 3 26 3L6 3Z' }] };
// the hand mirror held by the sister in red (in her own coordinates): an ochre frame, sky glass
const glass = oval(36, -134, 8, 10);
const frame = oval(36, -134, 11, 13);
const mirror = {
  lines: [frame, 'M33 -121L31 -108'],
  fine: [glass],
  washes: [{ c: PAL.ochre, o: 1, d: `${frame}${glass}`, rule: 'evenodd' }, { c: PAL.sky, o: 0.9, d: glass }],
  glints: ['M32 -140C30 -136 30 -132 31 -129C32.4 -133 33 -137 32 -140Z'],
};

export default compose({
  title: 'Brushing Her Stepsister’s Hair',
  seed: 1202,
  washes: [
    { c: PAL.grey, o: 0.3, d: 'M30 270C120 262 290 262 376 270C372 280 290 284 200 284C120 284 32 280 30 270Z' },
    { c: PAL.rose, o: 0.9, d: 'M150 220L134 220C130 220 130 232 134 232L150 232ZM230 220L246 220C250 220 250 232 246 232L230 232Z' },
    { c: PAL.terracotta, o: 0.8, d: 'M136 232L140 232L136 272L132 272ZM240 232L244 232L248 272L244 272Z' },
  ],
  lines: [floor, stoolEnds, stoolLegs],
  parts: [
    place(
      cinderella({
        look: 1,
        arms: [
          [[-12, -80, 7], [-17, -68, 6.5], [-20, -56, 6.5], [-20, -50, 6.5]],
          [[12, -80, 7], [28, -86, 6.5], [38, -102, 6.5], [44, -113, 6.5]],
        ],
      }),
      'translate(88 270) scale(1.35)',
    ),
    place(brush, brushT),
    place(
      sister({
        who: 'gold',
        mood: 'smile',
        sit: true,
        tilt: 6,
        legs: [
          [[-9, 12, 6], [-10, 26, 5.5], [-10, 40, 5]],
          [[9, 12, 6], [10, 26, 5.5], [10, 40, 5]],
        ],
      }),
      'translate(190 212) scale(1.25)',
    ),
    place(
      sister({
        who: 'red',
        mood: 'proud',
        look: 1,
        arms: [S_ARMS.hips[0], [[13, -102, 7], [30, -94, 6.5], [33, -106, 6.5], [32, -112, 6.5]]],
      }),
      'translate(306 270) scale(1.22)',
    ),
    place(mirror, 'translate(306 270) scale(1.22)'),
    { fine: ['M374 92q4 -4 8 0M368 102l-6 2M376 78l2 -6'] },
  ],
});
