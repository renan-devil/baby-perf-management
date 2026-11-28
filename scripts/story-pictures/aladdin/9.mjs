import { PAL, hatch, tufts } from "../lib.mjs";
import {
  compose,
  lamp,
  place,
  princess,
  sorcerer,
  sparkles,
} from "./characters.mjs";

// Aladdin and the Magic Lamp, 9: "New lamps for old!" Under the palace window, the sorcerer, dressed
// up as a lamp-seller with a basket of shiny new lamps, holds up a shiny new lamp and reaches for
// the dusty old one that the Princess, who knows nothing about the magic, hands down to him.
const ground = "M0 286C80 283 160 288 240 285C310 283 360 287 400 285";
// the palace wall and its arched window
const wall = "M246 286L246 20M246 20L400 20";
const win = "M276 160L276 92C276 58 364 58 364 92L364 160";
const sill = "M266 158L374 158L370 168L270 168Z";
const P = "translate(320 218) scale(1.05)";
// the old lamp hangs from her hand, held by its handle
const OLD = "translate(233 169) scale(-0.72 0.72)";
const S = "translate(160 286) scale(0.95)";
// the basket of shiny new lamps
const basket = "M22 252L98 252L90 286L30 286Z";
const basketRim = "M18 248L102 248L102 254L18 254Z";

export default compose({
  title: "New lamps for old!",
  seed: 209,
  washes: [
    { c: PAL.rose, o: 0.2, d: "M246 286L246 20L400 20L400 286Z" },
    { c: PAL.ochre, o: 0.6, d: sill },
    {
      c: PAL.ochre,
      o: 0.3,
      d: "M0 284C80 281 160 286 240 283C310 281 360 285 400 283L400 300L0 300Z",
    },
    { c: PAL.terracotta, o: 0.6, d: `${basket}${basketRim}` },
    { c: PAL.ochre, o: 0.5, d: basket },
  ],
  lines: [ground, wall, win, sill, basket, basketRim],
  fine: [
    "M276 92C290 80 350 80 364 92",
    hatch(26, 262, 94, 262, 7, 18, 100, 3, 0.1),
    "M26 270L94 270M28 278L92 278",
    hatch(10, 294, 230, 295, 9, 6, 170, 4),
    tufts(
      [
        [20, 286],
        [236, 285],
      ],
      8,
      3,
    ),
    sparkles([
      [92, 108, 1],
      [146, 90, 0.8],
      [28, 222, 0.8],
      [106, 230, 0.7],
      [70, 212, 0.7],
    ]),
  ],
  parts: [
    place(lamp({ look: "shiny" }), "translate(48 252) scale(0.55)"),
    place(lamp({ look: "shiny" }), "translate(76 248) scale(0.55) rotate(-8)"),
    place(
      princess({
        pose: "upper",
        mood: "happy",
        tilt: -8,
        arms: [
          [
            [-14, -90, 7],
            [-30, -84, 6.5],
            [-48, -74, 6.5],
            [-60, -66, 6.5],
          ],
          [
            [14, -90, 7],
            [22, -80, 6.5],
            [24, -70, 6.5],
            [22, -62, 6.5],
          ],
        ],
      }),
      P,
    ),
    place(lamp({ look: "dusty" }), OLD),
    place(
      sorcerer({
        disguise: true,
        mood: "sly",
        tilt: 6,
        arms: [
          [
            [-13, -128, 8],
            [-26, -140, 7.5],
            [-34, -154, 7],
            [-38, -166, 7],
          ],
          [
            [13, -128, 8],
            [32, -130, 7.5],
            [50, -126, 7],
            [64, -120, 7],
          ],
        ],
      }),
      S,
    ),
    place(lamp({ look: "shiny" }), `${S} translate(-52 -170) scale(0.7)`),
  ],
});
