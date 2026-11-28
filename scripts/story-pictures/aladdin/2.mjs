import { PAL, hatch, tufts } from "../lib.mjs";
import {
  aladdin,
  bumpy,
  compose,
  oval,
  place,
  sorcerer,
  sparkles,
} from "./characters.mjs";

// Aladdin and the Magic Lamp, 2: far outside the city, in the mountains, the sorcerer throws magic
// powder on a little fire; purple smoke puffs up, and the ground cracks open on a flat stone with
// an iron ring. Aladdin stares, his hands up in surprise.
const ground = "M0 264C70 260 150 265 210 263M318 262C350 264 380 263 400 262";
const mountains =
  "M0 176L44 136L80 162L124 112L170 160L196 150M236 166L282 122L318 152L352 130L400 168";
const mountainFill =
  "M0 176L44 136L80 162L124 112L170 160L196 150L214 172L0 172ZM236 166L282 122L318 152L352 130L400 168L400 172L236 172Z";

// the little fire: two crossed sticks and a flame
const sticks = "M136 268L176 256M140 256L180 268";
const flame =
  "M144 258C138 244 148 234 146 222C154 230 156 216 162 208C164 222 174 230 170 244C172 252 168 258 162 260C156 262 148 262 144 258Z";
const inner =
  "M152 256C150 248 154 242 154 236C158 242 162 244 160 252C160 256 156 258 152 256Z";
// magic smoke, rising and curling
const smoke =
  bumpy(160, 200, 13, 10, 7, 1.3) +
  bumpy(170, 180, 15, 11, 7, 1.3) +
  bumpy(184, 158, 18, 13, 8, 1.3) +
  bumpy(176, 132, 15, 11, 7, 1.3) +
  bumpy(160, 112, 11, 9, 6, 1.3);

// the opened ground: a dark hole round the flat stone with its iron ring
const hole =
  "M204 276L212 266L224 268L232 260L246 264L258 258L272 263L286 259L298 266L310 264L316 274L308 284L292 288L276 286L262 292L246 287L230 290L214 285Z";
const stone =
  "M222 276C224 268 290 266 298 274C300 281 284 285 260 285C236 285 220 282 222 276Z";
const iron = oval(260, 275, 7, 3.4);
const cracks =
  "M212 266l-6 -6l-8 2M316 274l12 -4l10 3M262 292l-3 6M214 285l-10 6M298 266l6 -6";

export default compose({
  title: "The ground cracks open",
  seed: 202,
  washes: [
    { c: PAL.grey, o: 0.3, d: mountainFill },
    { c: PAL.slate, o: 0.18, d: mountainFill },
    {
      c: PAL.ochre,
      o: 0.3,
      d: "M0 262C70 258 150 263 220 261C290 258 350 263 400 260L400 300L0 300Z",
    },
    { c: PAL.ink, o: 0.55, d: hole },
    { c: PAL.slate, o: 0.4, d: hole },
    { c: PAL.grey, o: 0.75, d: stone },
    { c: PAL.red, o: 0.8, d: flame },
    { c: PAL.ochre, o: 0.95, d: inner },
    {
      c: PAL.terracotta,
      o: 0.8,
      d: "M136 268L176 256L178 260L140 271ZM140 256L180 268L178 271L138 260Z",
    },
    { c: PAL.rose, o: 0.6, d: smoke },
    { c: PAL.slate, o: 0.4, d: smoke },
  ],
  lines: [ground, sticks, flame, hole, stone],
  fine: [
    mountains,
    inner,
    smoke,
    cracks,
    "M260 271.6l0 -3",
    sparkles([
      [132, 206, 0.8],
      [196, 222, 0.7],
      [140, 160, 0.6],
      [200, 120, 0.8],
    ]),
    hatch(20, 278, 150, 280, 8, 7, 170, 4),
    hatch(330, 280, 390, 280, 4, 7, 170, 5),
    tufts(
      [
        [30, 263],
        [380, 262],
        [118, 264],
      ],
      8,
      4,
    ),
  ],
  once: `<path d="${iron}" stroke-width="2.4"/>`,
  parts: [
    place(
      sorcerer({
        mood: "sly",
        arms: [
          [
            [-13, -128, 8],
            [-26, -140, 7.5],
            [-34, -156, 7],
            [-38, -170, 7],
          ],
          [
            [13, -128, 8],
            [28, -122, 7.5],
            [42, -114, 7],
            [54, -108, 7],
          ],
        ],
      }),
      "translate(84 264) scale(0.95)",
    ),
    place(
      aladdin({
        mood: "wow",
        arms: [
          [
            [-14, -79, 8.5],
            [-24, -88, 8],
            [-30, -100, 8],
            [-31, -108, 8],
          ],
          [
            [14, -79, 8.5],
            [24, -88, 8],
            [30, -100, 8],
            [31, -108, 8],
          ],
        ],
      }),
      "translate(354 264) scale(1.1)",
    ),
  ],
});
