import { PAL } from "../lib.mjs";
import {
  aladdin,
  bumpy,
  compose,
  genie,
  lamp,
  place,
  sparkles,
} from "./characters.mjs";

// Aladdin and the Magic Lamp, 1 (cover): Aladdin rubs an old lamp, and a huge genie swirls out of
// its spout in a cloud of smoke, his arms folded and a big laugh under his curly moustache.
const A = "translate(84 286) scale(1.4)";
// the lamp, held out in Aladdin's hands (in his own coordinates)
const L = `${A} translate(52 -38) scale(0.8)`;
// where its spout ends up: Aladdin's (52 + 49 * 0.8, -38 - 23 * 0.8) = (91.2, -56.4)
const G = `translate(${84 + 91.2 * 1.4} ${286 - 56.4 * 1.4}) scale(0.92)`;
const ground = "M24 288C74 284 134 286 174 288";
const cloud =
  bumpy(296, 206, 34, 18, 8, 1.25) +
  bumpy(334, 170, 22, 14, 7, 1.3) +
  bumpy(206, 176, 18, 12, 6, 1.3);

export default compose({
  title: "Aladdin and the Magic Lamp",
  seed: 201,
  washes: [
    {
      c: PAL.ochre,
      o: 0.3,
      d: "M20 286C74 278 134 280 180 286C184 293 154 298 104 298C64 298 24 295 20 286Z",
    },
    { c: PAL.grey, o: 0.28, d: cloud },
    { c: PAL.ochre, o: 0.18, d: cloud },
  ],
  lines: [ground],
  fine: [
    cloud,
    sparkles([
      [178, 262, 0.9],
      [150, 202, 0.7],
      [352, 236, 0.8],
      [176, 130, 0.6],
      [350, 112, 0.7],
    ]),
  ],
  parts: [
    place(genie({ mood: "laugh", k: 0.6 }), G),
    place(
      aladdin({
        mood: "wow",
        arms: [
          [
            [-14, -79, 8.5],
            [-2, -64, 8],
            [22, -58, 8],
            [46, -56, 8],
          ],
          [
            [14, -79, 8.5],
            [28, -68, 8],
            [40, -54, 8],
            [50, -44, 8],
          ],
        ],
      }),
      A,
    ),
    place(lamp({ look: "old" }), L),
  ],
});
