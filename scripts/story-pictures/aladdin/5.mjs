import { PAL, hatch } from "../lib.mjs";
import {
  compose,
  genie,
  lamp,
  mother,
  place,
  sparkles,
} from "./characters.mjs";

// Aladdin and the Magic Lamp, 5: Aladdin's mother gives the old lamp a polish, rub, rub, rub, and
// WHOOSH! an enormous genie bursts out, so big that his turban touches the ceiling. She sits down
// hard on the floor, bump!, legs in the air, and her polishing cloth flies up.
const floor = "M0 284C80 281 160 286 240 283C310 281 360 285 400 283";
const ceiling = "M150 52C220 50 300 52 400 50";
const L = "translate(176 284) scale(0.86)";
// the lamp's spout: (176 + 49 * 0.86, 284 - 23 * 0.86)
const G = `translate(${176 + 49 * 0.86} ${284 - 23 * 0.86}) scale(1.14)`;
const cloth =
  "M118 104C126 96 140 98 148 92C150 102 146 112 150 122C140 124 128 120 120 124C122 116 116 110 118 104Z";
const bump = "M40 262l-12 -4M44 274l-14 2M60 250l-8 -8";

export default compose({
  title: "The Genie of the Lamp",
  seed: 205,
  washes: [
    {
      c: PAL.ochre,
      o: 0.3,
      d: "M0 282C80 279 160 284 240 281C310 279 360 283 400 281L400 300L0 300Z",
    },
    {
      c: PAL.terracotta,
      o: 0.25,
      d: "M150 52C220 50 300 52 400 50L400 20L150 20Z",
    },
    { c: PAL.grey, o: 0.4, d: cloth },
  ],
  lines: [floor, ceiling, cloth],
  fine: [
    "M126 106q10 2 18 -4M124 116q10 0 20 -2",
    "M112 86l-6 -6M156 84l6 -8M134 80l0 -8",
    bump,
    "M200 51l0 -14M262 50l0 -20M330 51l0 -16",
    hatch(10, 292, 390, 293, 12, 7, 170, 2),
    sparkles([
      [224, 236, 0.9],
      [356, 200, 0.8],
      [186, 150, 0.7],
      [380, 96, 0.7],
    ]),
  ],
  parts: [
    place(genie({ mood: "happy", k: 0.5, plume: false }), G),
    place(lamp({ look: "old" }), L),
    place(
      mother({
        pose: "sit",
        mood: "wow",
        arms: [
          [
            [-21, -36, 9],
            [-32, -48, 8.5],
            [-38, -62, 8.5],
            [-40, -70, 8.5],
          ],
          [
            [21, -36, 9],
            [32, -50, 8.5],
            [38, -64, 8.5],
            [40, -72, 8.5],
          ],
        ],
      }),
      "translate(92 284) scale(1.35)",
    ),
  ],
});
