import { PAL, hatch } from '../lib.mjs';
import { compose, dot, place, shoe, shoemaker, wife } from './characters.mjs';

// The Elves and the Shoemaker, 8: to thank the elves, the wife sits by the fire sewing two tiny coats,
// while the shoemaker makes two tiny pairs of shoes.
const floor = 'M0 272C90 269 200 274 300 271C340 270 370 272 400 271';

// the fireplace, with a holly sprig on the mantel
const chimneyBreast = 'M150 272L150 132M250 132L250 272';
const mantel = 'M136 120L264 120L264 132L136 132Z';
const opening = 'M166 272L166 196C166 172 234 172 234 196L234 272';
const bricks = 'M150 150l16 0M184 146l14 0M216 152l18 0M236 170l14 0M150 182l12 0M150 220l14 0M236 214l14 0M236 248l14 0M150 252l12 0';
const logs = 'M176 266C176 258 222 258 224 266C222 272 178 272 176 266ZM182 258L218 250';
const flames = 'M178 262C170 244 184 232 186 214C192 230 196 222 198 204C206 222 210 230 214 214C220 232 230 244 222 262Z';
const inner = 'M188 262C184 250 192 244 194 232C198 242 202 240 204 230C210 244 214 252 210 262Z';
const holly = 'M176 120C170 112 176 106 182 110C184 104 192 104 192 112C196 106 204 110 200 118';
const berries = dot(188, 116, 2.4) + dot(193, 113, 2.4) + dot(184, 113, 2.2);

// the wife on her chair, a tiny green coat in her lap, needle and thread pulled up (her coordinates)
const WT = 'translate(62 272) scale(1.1)';
const chair = 'M-28 -40L44 -40M-24 -40L-24 0M40 -40L40 0M-28 -40L-32 -118M-32 -118L-24 -118L-20 -44';
const coat = 'M26 -74L38 -74L44 -52L36 -52L34 -62L30 -62L28 -52L20 -52Z';
const thread = 'M34 -66C44 -80 46 -96 46 -108';
const needle = 'M46 -108L48 -116';

// the shoemaker on his stool facing the fire (mirrored), a tiny shoe in his hands
const ST = 'translate(342 272) scale(-1.1 1.1)';
const stool = 'M-24 -40L42 -40L40 -34L-22 -34ZM-18 -34L-22 0M36 -34L40 0';

export default compose({
  title: 'Tiny coats and tiny shoes',
  seed: 118,
  washes: [
    { c: PAL.ochre, o: 0.3, d: 'M0 270C100 267 200 272 300 269C340 268 370 270 400 269L400 294C300 296 100 295 0 294Z' },
    { c: PAL.ochre, o: 0.25, d: 'M70 210C70 130 130 90 200 90C270 90 330 130 330 210C330 250 300 272 200 272C100 272 70 250 70 210Z' },
    { c: PAL.terracotta, o: 0.4, d: `M150 272L150 132L250 132L250 272Z${opening}Z`, rule: 'evenodd' },
    { c: PAL.ochre, o: 0.7, d: mantel },
    { c: PAL.ink, o: 0.45, d: `${opening}Z` },
    { c: PAL.ochre, o: 0.95, d: flames },
    { c: PAL.red, o: 0.55, d: inner },
    { c: PAL.terracotta, o: 0.8, d: logs },
    { c: PAL.green, o: 0.85, d: `${holly}Z` },
    { c: PAL.red, o: 0.9, d: berries },
  ],
  lines: [floor, chimneyBreast, mantel, opening, flames, logs, holly],
  fine: [bricks, inner, berries, hatch(14, 284, 384, 286, 12, 8, 172, 4)],
  parts: [
    place({ lines: [chair], washes: [{ c: PAL.terracotta, o: 0.45, d: 'M-28 -40L44 -40L44 -36L-28 -36ZM-32 -118L-24 -118L-20 -44L-28 -40Z' }] }, WT),
    place(
      wife({
        mood: 'down',
        tilt: 8,
        seated: true,
        arms: [
          [[-18, -100, 9], [-16, -82, 8], [4, -70, 8], [22, -64, 8]],
          [[18, -100, 9], [30, -96, 8], [40, -102, 8], [46, -110, 8]],
        ],
      }),
      WT,
    ),
    place(
      { lines: [coat, needle], fine: [thread, 'M32 -74L32 -54'], washes: [{ c: PAL.green, o: 0.9, d: coat }], fills: [dot(31, -68, 0.9), dot(31, -62, 0.9)] },
      WT,
    ),
    place({ lines: [stool], washes: [{ c: PAL.ochre, o: 0.6, d: stool }] }, ST),
    place(
      shoemaker({
        mood: 'down',
        tilt: 8,
        seated: true,
        arms: [
          [[-20, -104, 10], [-18, -84, 9], [2, -72, 9], [20, -64, 9]],
          [[20, -104, 10], [30, -90, 9], [38, -78, 9], [36, -68, 9]],
        ],
      }),
      ST,
    ),
    place(shoe({}), `${ST} translate(16 -66) scale(0.5)`),
    // the finished tiny pairs, waiting on the floor
    place(shoe({}), 'translate(268 268) scale(0.45)'),
    place(shoe({}), 'translate(274 266) scale(0.45)'),
  ],
});
