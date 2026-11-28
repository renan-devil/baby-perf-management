import { PAL, hatch, transformPath, zed } from "../lib.mjs";
import {
  A_LEGS,
  aladdin,
  compose,
  lamp,
  place,
  sorcerer,
} from "./characters.mjs";

// Aladdin and the Magic Lamp, 10: the sorcerer has drunk his warm milk with the sleeping powder and
// snores in his big chair, z z z, his hat slipping off. On tiptoe, Aladdin quietly takes the lamp
// back out of his pocket.
const floor = "M20 288C110 285 250 289 380 286";
const S = "translate(146 288) scale(1.05)";
// the big armchair (in the sorcerer's coordinates): only the parts that show round him
const chairBack =
  "M-66 -84C-72 -130 -60 -170 -24 -178M66 -84C72 -130 60 -170 24 -178";
const chairArms =
  "M-36 -62C-56 -64 -74 -70 -76 -84C-78 -98 -62 -100 -56 -90C-52 -82 -46 -78 -36 -78M36 -62C56 -64 74 -70 76 -84C78 -98 62 -100 56 -90C52 -82 46 -78 36 -78";
const chairSides =
  "M-36 -62L-66 -62L-66 -6M36 -62L66 -62L66 -6M-66 -6L-36 -6M66 -6L36 -6M-60 -6L-62 4M60 -6L62 4";
const chairFill =
  "M-66 -6L-66 -84C-72 -130 -60 -170 -24 -178C-8 -182 8 -182 24 -178C60 -170 72 -130 66 -84L66 -6Z";
// what the sorcerer covers (left unpainted on the chair): his robe and head
const sorcFill =
  "M-23 -134L-24 -150C-24 -176 16 -176 18 -150L23 -134L23 -74L36 -60L32 -6L-32 -6L-36 -60L-23 -74Z";
const pocket = "M20 -48L34 -49L34 -33L21 -32Z";
const A = "translate(244 288) scale(-1.04 1.04)";

export default compose({
  title: "Shh! Fast asleep",
  seed: 210,
  washes: [
    {
      c: PAL.ochre,
      o: 0.28,
      d: "M16 286C110 282 250 286 384 284C388 292 360 298 200 298C80 298 12 296 16 286Z",
    },
    {
      c: PAL.red,
      o: 0.6,
      d: transformPath(chairFill, S) + transformPath(sorcFill, S),
      rule: "evenodd",
    },
    {
      c: PAL.terracotta,
      o: 0.35,
      d: transformPath(chairFill, S) + transformPath(sorcFill, S),
      rule: "evenodd",
    },
  ],
  lines: [floor].concat(
    [chairBack, chairArms, chairSides].map((d) => transformPath(d, S)),
  ),
  fine: [
    transformPath(pocket, S),
    zed(188, 96, 10),
    zed(206, 66, 14),
    zed(226, 32, 18),
    hatch(30, 296, 370, 296, 10, 6, 170, 2),
    "M300 274l8 -4M296 262l8 -2",
  ],
  parts: [
    place(
      sorcerer({
        seated: true,
        mood: "snore",
        tilt: -14,
        hatTilt: -30,
        arms: [
          [
            [-13, -128, 8],
            [-22, -112, 7.5],
            [-34, -98, 7],
            [-48, -96, 7],
          ],
          [
            [13, -128, 8],
            [22, -112, 7.5],
            [22, -96, 7],
            [12, -86, 7],
          ],
        ],
      }),
      S,
    ),
    { washes: [{ c: PAL.grey, o: 0.6, d: transformPath(pocket, S) }] },
    place(
      aladdin({
        grown: true,
        mood: "peep",
        legs: A_LEGS.tiptoe,
        arms: [
          [
            [-16, -98, 9.5],
            [-28, -90, 9],
            [-38, -80, 9],
            [-44, -74, 9],
          ],
          [
            [16, -98, 9.5],
            [30, -86, 9],
            [42, -72, 9],
            [49, -60, 9],
          ],
        ],
      }),
      A,
    ),
    // the lamp, coming out of the pocket in Aladdin's hand
    place(lamp({ look: "old" }), "translate(176 246) scale(0.74) rotate(-10)"),
  ],
});
