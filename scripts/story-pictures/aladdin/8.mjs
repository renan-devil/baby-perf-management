import { PAL, hatch } from "../lib.mjs";
import {
  aladdin,
  compose,
  dot,
  place,
  princess,
  sparkles,
} from "./characters.mjs";

// Aladdin and the Magic Lamp, 8: Aladdin and Princess Badroulbadour, just married, wave from the
// balcony of the shining new palace that the genie built in a single night, with golden domes.
const ground = "M20 290C120 287 280 289 380 287";
const block = "M110 290L110 104L290 104L290 290";
const cornice = "M104 104L296 104M106 110L294 110";
const dome =
  "M138 104C134 80 158 62 182 50C190 45 197 38 200 28C203 38 210 45 218 50C242 62 266 80 262 104Z";
const spire = "M200 28L200 15";
const tower = (x) => `M${x - 20} 290L${x - 20} 118L${x + 20} 118L${x + 20} 290`;
const towerDome = (x) =>
  `M${x - 24} 118C${x - 26} 102 ${x - 14} 92 ${x - 4} 86C${x - 1} 83 ${x} 78 ${x} 72C${x} 78 ${x + 1} 83 ${x + 4} 86C${x + 14} 92 ${x + 26} 102 ${x + 24} 118Z`;
const arch = (x, y, w, h) =>
  `M${x - w / 2} ${y}L${x - w / 2} ${y - h + w / 2}C${x - w / 2} ${y - h - w / 6} ${x + w / 2} ${y - h - w / 6} ${x + w / 2} ${y - h + w / 2}L${x + w / 2} ${y}Z`;
const windows =
  arch(80, 170, 14, 30) +
  arch(320, 170, 14, 30) +
  arch(80, 236, 14, 30) +
  arch(320, 236, 14, 30) +
  arch(124, 160, 14, 34) +
  arch(276, 160, 14, 34);
const door = arch(200, 290, 40, 38);
// the balcony: a slab and a balustrade in front of them
const rail = "M128 214L272 214L272 220L128 220Z";
const slab = "M120 246L280 246L274 256L126 256Z";
const balusters = Array.from(
  { length: 9 },
  (_, i) => `M${140 + i * 15} 221L${140 + i * 15} 245`,
).join("");

export default compose({
  title: "A palace with golden domes",
  seed: 208,
  washes: [
    { c: PAL.ochre, o: 0.95, d: `${dome}${towerDome(80)}${towerDome(320)}` },
    {
      c: PAL.terracotta,
      o: 0.3,
      d: "M138 104C136 92 144 80 156 70C150 84 148 96 150 104ZM56 118C55 110 60 102 66 96C64 104 64 112 66 118ZM296 118C295 110 300 102 306 96C304 104 304 112 306 118Z",
    },
    { c: PAL.rose, o: 0.18, d: `${block}Z${tower(80)}Z${tower(320)}Z` },
    { c: PAL.sky, o: 0.75, d: windows },
    { c: PAL.slate, o: 0.6, d: door },
    { c: PAL.ochre, o: 0.6, d: `${rail}${slab}` },
    { c: PAL.ochre, o: 0.3, d: "M128 220L272 220L272 246L128 246Z" },
    {
      c: PAL.green,
      o: 0.3,
      d: "M14 290C120 285 280 287 386 285C390 293 360 298 200 298C80 298 10 296 14 290Z",
    },
  ],
  lines: [
    ground,
    block,
    cornice,
    dome,
    spire,
    tower(80),
    tower(320),
    towerDome(80),
    towerDome(320),
    "M80 72L80 62M320 72L320 62",
    rail,
    slab,
    door,
  ],
  fine: [
    windows,
    balusters,
    "M138 104C160 96 240 96 262 104",
    "M162 64C176 72 224 72 238 64",
    hatch(24, 296, 376, 296, 10, 6, 170, 2),
    sparkles([
      [160, 40, 1.1],
      [254, 52, 0.9],
      [44, 90, 0.8],
      [356, 92, 0.9],
    ]),
  ],
  fills: `<path d="${dot(200, 12, 3.4)}${dot(80, 60, 2.6)}${dot(320, 60, 2.6)}"/>`,
  glints:
    '<path d="M164 84C172 74 182 66 190 62C184 70 176 78 170 88Z"/><path d="M68 104C70 98 74 94 78 92C76 96 74 100 72 106Z"/><path d="M308 104C310 98 314 94 318 92C316 96 314 100 312 106Z"/>',
  parts: [
    place(
      aladdin({
        grown: true,
        upper: true,
        mood: "laugh",
        arms: [
          [
            [-16, -98, 9.5],
            [-26, -110, 9],
            [-32, -124, 9],
            [-33, -134, 9],
          ],
          [
            [16, -98, 9.5],
            [24, -86, 9],
            [26, -76, 9],
            [24, -68, 9],
          ],
        ],
      }),
      "translate(170 285) scale(1.1)",
    ),
    place(
      princess({
        pose: "upper",
        mood: "happy",
        arms: [
          [
            [-14, -90, 7],
            [-21, -80, 6.5],
            [-24, -72, 6.5],
            [-24, -66, 6.5],
          ],
          [
            [14, -90, 7],
            [24, -100, 6.5],
            [30, -112, 6.5],
            [32, -122, 6.5],
          ],
        ],
      }),
      "translate(232 278) scale(1.1)",
    ),
  ],
});
