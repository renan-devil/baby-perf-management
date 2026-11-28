import { PAL, hatch } from "../lib.mjs";
import {
  aladdin,
  bumpy,
  compose,
  jewels,
  lamp,
  place,
  sparkles,
} from "./characters.mjs";

// Aladdin and the Magic Lamp, 3: in the garden under the ground, where the trees grow jewels (red
// rubies, green emeralds, blue sapphires), Aladdin holds up the dusty old lamp, his pockets bulging.
const A = "translate(200 284) scale(1.42)";
const ground = "M0 284C80 280 160 286 240 283C310 281 360 285 400 283";
// the rocky roof of the cave, just suggested at the top
const roof =
  "M0 64C30 44 60 50 90 34C120 22 150 30 180 20C210 14 240 24 270 18C300 14 330 34 360 30C380 30 392 44 400 52";
const roofFill = `${roof}L400 0L0 0Z`;

function tree(x, y, s, seed) {
  const crown = bumpy(x, y - 132 * s, 58 * s, 44 * s, 9, 1.22, -80 + seed * 7);
  const trunk = `M${x - 9 * s} ${y}C${x - 5 * s} ${y - 40 * s} ${x - 10 * s} ${y - 70 * s} ${x - 4 * s} ${y - 96 * s}M${x + 9 * s} ${y}C${x + 5 * s} ${y - 40 * s} ${x + 10 * s} ${y - 70 * s} ${x + 4 * s} ${y - 96 * s}`;
  const trunkFill = `M${x - 9 * s} ${y}C${x - 5 * s} ${y - 40 * s} ${x - 10 * s} ${y - 70 * s} ${x - 4 * s} ${y - 96 * s}L${x + 4 * s} ${y - 96 * s}C${x + 10 * s} ${y - 70 * s} ${x + 5 * s} ${y - 40 * s} ${x + 9 * s} ${y}Z`;
  const cols = [
    PAL.red,
    PAL.sky,
    PAL.green,
    PAL.red,
    PAL.sky,
    PAL.red,
    PAL.green,
    PAL.sky,
  ];
  const spots = [
    [-34, -138],
    [-12, -158],
    [16, -150],
    [36, -128],
    [-22, -112],
    [6, -122],
    [30, -100],
    [-40, -104],
  ];
  const fruit = jewels(
    spots.map(([dx, dy], i) => [
      x + dx * s,
      y + dy * s,
      cols[(i + seed) % cols.length],
      8 * s,
    ]),
  );
  return {
    lines: [crown, trunk],
    fine: [
      ...fruit.fine,
      `M${x} ${y - 96 * s}l-14 -14M${x} ${y - 96 * s}l12 -16`,
    ],
    washes: [
      { c: PAL.green, o: 0.45, d: crown },
      { c: PAL.terracotta, o: 0.6, d: trunkFill },
      ...fruit.washes,
    ],
    glints: fruit.glints,
  };
}

export default compose({
  title: "The garden of jewels",
  seed: 203,
  washes: [
    { c: PAL.slate, o: 0.3, d: roofFill },
    { c: PAL.grey, o: 0.25, d: roofFill },
    {
      c: PAL.grey,
      o: 0.35,
      d: "M0 282C80 278 160 284 240 281C310 279 360 283 400 281L400 300L0 300Z",
    },
  ],
  lines: [ground, roof],
  fine: [
    hatch(10, 292, 390, 293, 12, 7, 170, 3),
    "M60 44l6 10M150 28l-4 10M250 22l4 10M330 30l-6 10",
    sparkles([
      [150, 70, 1.1],
      [250, 60, 0.8],
      [110, 220, 0.7],
      [292, 230, 0.7],
    ]),
  ],
  parts: [
    tree(70, 284, 1.05, 0),
    tree(332, 284, 1.08, 3),
    place(
      aladdin({
        mood: "happy",
        arms: [
          [
            [-14, -79, 8.5],
            [-26, -70, 8],
            [-36, -62, 8],
            [-42, -60, 8],
          ],
          [
            [14, -79, 8.5],
            [22, -94, 8],
            [26, -108, 8],
            [26, -118, 8],
          ],
        ],
      }),
      A,
    ),
    // jewels bulging out of his sash and pockets
    place(
      jewels([
        [-20, -50, PAL.red, 4],
        [-14, -46, PAL.sky, 3.6],
        [19, -50, PAL.green, 4],
        [14, -46, PAL.red, 3.4],
        [-21, -36, PAL.green, 3.6],
      ]),
      A,
    ),
    place(lamp({ look: "dusty" }), `${A} translate(26 -121) scale(0.78)`),
  ],
});
