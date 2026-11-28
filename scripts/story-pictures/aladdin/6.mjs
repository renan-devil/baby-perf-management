import { PAL, hatch, tufts } from "../lib.mjs";
import { aladdin, compose, dot, limb, place, princess } from "./characters.mjs";

// Aladdin and the Magic Lamp, 6: years later, Aladdin, now a young man, sees Princess Badroulbadour
// ride by on a white horse. She waves, he puts his hand on his heart, and they both smile.
const ground = "M0 282C80 278 160 284 240 281C310 279 360 283 400 281";

// the white horse, walking to the left (left mostly paper, with a little grey shading)
const front =
  "M256 212C244 206 240 190 244 176C238 162 228 148 218 140C212 146 204 154 196 154C188 154 185 146 190 140C196 128 204 118 212 110C216 104 222 102 228 104C240 112 254 140 272 158C276 158 280 158 283 158";
const back =
  "M328 157C336 157 344 159 350 164C364 172 366 196 356 208C330 216 280 216 256 212";
const ears = "M221 106L223 92L231 104";
const mane =
  "M228 104C240 112 254 140 272 158C262 152 250 140 242 126C236 116 230 110 228 104ZM224 104C218 106 214 110 214 116C220 112 224 110 228 108Z";
const tail = "M356 176C372 180 380 202 374 232C366 220 362 204 358 194Z";
const legs = [
  limb([
    [262, 208, 15],
    [260, 244, 10],
    [261, 277, 9],
  ]),
  limb([
    [276, 212, 14],
    [272, 238, 10],
    [264, 256, 9],
    [256, 264, 9],
  ]),
  limb([
    [332, 208, 18],
    [338, 242, 10],
    [338, 277, 9],
  ]),
  limb([
    [348, 202, 17],
    [354, 240, 10],
    [356, 275, 9],
  ]),
];
const hooves =
  "M255 276L267 276L267 282L255 282ZM332 276L344 276L344 282L332 282ZM350 274L362 274L362 280L350 280ZM248 262L258 268L254 274L245 268Z";
const bridle =
  "M196 136C204 140 210 144 214 146M204 120C210 130 214 138 218 140M212 112C216 120 220 128 224 134";
const reins = "M214 146C240 150 262 150 290 142";
const heart = (x, y, s) =>
  `M${x} ${y + s}C${x - s * 1.6} ${y} ${x - s * 1.2} ${y - s * 1.2} ${x} ${y - s * 0.4}C${x + s * 1.2} ${y - s * 1.2} ${x + s * 1.6} ${y} ${x} ${y + s}Z`;
const hearts = heart(158, 118, 6) + heart(176, 98, 4.5);

export default compose({
  title: "The Princess on a white horse",
  seed: 206,
  washes: [
    {
      c: PAL.green,
      o: 0.3,
      d: "M0 280C80 276 160 282 240 279C310 277 360 281 400 279L400 300L0 300Z",
    },
    { c: PAL.grey, o: 0.5, d: `${mane}${tail}` },
    {
      c: PAL.grey,
      o: 0.22,
      d: "M256 212C280 216 330 216 356 208C366 196 364 180 358 172C352 196 320 206 290 206C270 206 258 208 256 212Z",
    },
    { c: PAL.slate, o: 0.85, d: hooves },
    { c: PAL.rose, o: 0.85, d: hearts },
  ],
  lines: [ground, front, back, ears, tail, ...legs, hooves],
  fine: [
    mane,
    bridle,
    reins,
    hearts,
    "M193 145l3 1",
    "M360 184q8 10 10 26M364 182q10 14 9 34",
    tufts(
      [
        [30, 282],
        [140, 281],
        [386, 281],
        [210, 282],
      ],
      9,
      6,
    ),
    hatch(20, 292, 380, 293, 11, 7, 170, 6),
  ],
  fills: `<path d="${dot(213, 121, 2)}"/>`,
  parts: [
    place(
      princess({
        pose: "ride",
        mood: "happy",
        tilt: -6,
        arms: [
          [
            [-14, -90, 7],
            [-24, -100, 6.5],
            [-30, -112, 6.5],
            [-32, -120, 6.5],
          ],
          [
            [14, -90, 7],
            [10, -76, 6.5],
            [0, -70, 6.5],
            [-10, -70, 6.5],
          ],
        ],
      }),
      "translate(304 200)",
    ),
    place(
      aladdin({
        grown: true,
        mood: "happy",
        tilt: 6,
        arms: [
          [
            [-16, -98, 9.5],
            [-24, -84, 9],
            [-27, -70, 9],
            [-28, -60, 9],
          ],
          [
            [16, -98, 9.5],
            [24, -84, 9],
            [16, -76, 9],
            [6, -78, 9],
          ],
        ],
      }),
      "translate(96 284) scale(1.18)",
    ),
  ],
});
