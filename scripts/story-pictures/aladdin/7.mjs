import { PAL, hatch, rays } from "../lib.mjs";
import {
  compose,
  jewels,
  merge,
  mother,
  place,
  sparkles,
  sultan,
} from "./characters.mjs";

// Aladdin and the Magic Lamp, 7: at the palace, Aladdin's mother kneels before the Sultan and holds
// up a bowl of jewels from the magic garden. They sparkle so brightly that the whole room lights up.
// "Oooh!" says the Sultan.

// a long rug from the mother to the Sultan's cushion
const rug = "M60 290L392 290L384 278L70 278Z";
const fringe =
  "M70 278l-4 -5M80 278l-4 -5M90 278l-4 -5M60 290l-6 4M392 290l6 4";
const M = "translate(108 286) scale(1.3)";

/** A golden bowl heaped with jewels, centred on its rim at (0,0). */
function bowl() {
  const b = "M-22 0C-20 14 20 14 22 0Z";
  const foot = "M-8 11L-10 16L10 16L8 11";
  const gems = jewels([
    [-14, -3, PAL.red, 4.6],
    [-5, -6, PAL.sky, 4.8],
    [5, -4, PAL.green, 4.6],
    [14, -3, PAL.red, 4.2],
    [0, -12, PAL.red, 4.4],
    [-9, -12, PAL.green, 3.8],
    [9, -11, PAL.sky, 4],
  ]);
  return merge(
    {
      lines: [b, foot],
      fine: ["M-22 0C-10 4 10 4 22 0"],
      washes: [{ c: PAL.ochre, o: 0.95, d: `${b}${foot}Z` }],
      glints: ["M-15 4C-10 7 -4 8 2 8C-4 9 -10 8 -14 6Z"],
    },
    gems,
  );
}

export default compose({
  title: "A bowl of jewels for the Sultan",
  seed: 207,
  washes: [
    { c: PAL.red, o: 0.5, d: rug },
    { c: PAL.ochre, o: 0.4, d: "M90 286L360 286L356 282L96 282Z" },
    { c: PAL.ochre, o: 0.22, d: "M0 290L400 290L400 300L0 300Z" },
  ],
  lines: [rug],
  fine: [
    fringe,
    hatch(14, 296, 390, 296, 11, 6, 170, 2),
    rays(171, 136, 30, 46, 12, 7, 4),
    sparkles([
      [200, 112, 0.9],
      [118, 104, 0.8],
      [210, 170, 0.6],
      [140, 80, 0.6],
    ]),
  ],
  parts: [
    place(
      mother({
        pose: "kneel",
        mood: "happy",
        tilt: 4,
        arms: [
          [
            [-21, -36, 9],
            [-2, -30, 8.5],
            [22, -38, 8.5],
            [36, -58, 8.5],
          ],
          [
            [21, -36, 9],
            [38, -42, 8.5],
            [52, -52, 8.5],
            [58, -62, 8.5],
          ],
        ],
      }),
      M,
    ),
    place(bowl(), `${M} translate(48 -108)`),
    place(
      sultan({
        mood: "wow",
        arms: [
          [
            [-30, -92, 12],
            [-44, -100, 11],
            [-52, -112, 11],
            [-54, -122, 11],
          ],
          [
            [30, -92, 12],
            [44, -100, 11],
            [52, -112, 11],
            [54, -122, 11],
          ],
        ],
      }),
      "translate(300 288) scale(1.12)",
    ),
  ],
});
