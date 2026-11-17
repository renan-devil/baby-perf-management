import { PAL, hatch } from '../lib.mjs';
import { bowl, compose, girl, mother, place, pot, spoon, steam } from './characters.mjs';

// Sweet Porridge, 3: at home, the little girl and her mother sit at the table with the little pot
// full of golden porridge between them; they eat from their bowls, happy and warm. Mmm!
// the table seen a little from above: its far edge at TOP, its near edge at NEAR, then a thick front
const TOP = 186;
const NEAR = 212;
const floor = 'M0 272C100 269 200 274 300 271C340 270 370 272 400 271';
const tableTop = `M62 ${TOP}L338 ${TOP}L352 ${NEAR}L48 ${NEAR}Z`;
const tableFront = `M48 ${NEAR}L352 ${NEAR}L352 ${NEAR + 11}L48 ${NEAR + 11}Z`;
const legs = `M66 ${NEAR + 11}L68 272M82 ${NEAR + 11}L82 272M334 ${NEAR + 11}L332 272M318 ${NEAR + 11}L318 272`;
const legFill = `M66 ${NEAR + 11}L82 ${NEAR + 11}L82 272L68 272ZM318 ${NEAR + 11}L334 ${NEAR + 11}L332 272L318 272Z`;
// a small window behind them, with rose curtains tied back
const win = 'M164 34L236 34L236 104L164 104Z';
const bars = 'M200 34L200 104M164 69L236 69';
const curtains = 'M156 28C164 50 170 74 160 108L150 108C156 74 152 50 146 28ZM244 28C236 50 230 74 240 108L250 108C244 74 248 50 254 28Z';
const rail = 'M140 28L260 28';
// little hearts of happiness
const heart = (x, y, s) => `M${x} ${y}C${x - s * 0.5} ${y - s * 0.7} ${x - s * 1.3} ${y - s * 0.2} ${x - s * 0.6} ${y + s * 0.6}L${x} ${y + s * 1.1}L${x + s * 0.6} ${y + s * 0.6}C${x + s * 1.3} ${y - s * 0.2} ${x + s * 0.5} ${y - s * 0.7} ${x} ${y}Z`;
const hearts = heart(52, 92, 9) + heart(348, 112, 9) + heart(326, 72, 6);

const M = 'translate(112 277) scale(1.3)';
const G = 'translate(290 240) scale(1.5)';

export default compose({
  title: 'Porridge for two',
  seed: 147,
  washes: [
    { c: PAL.ochre, o: 0.3, d: 'M0 268C100 265 200 270 300 267C340 266 370 268 400 267L400 298C300 300 100 299 0 298Z' },
    { c: PAL.sky, o: 0.45, d: win },
    { c: PAL.rose, o: 0.6, d: curtains },
    { c: PAL.rose, o: 0.85, d: hearts },
    { c: PAL.terracotta, o: 0.6, d: legFill },
  ],
  after: [
    { c: PAL.ochre, o: 0.6, d: tableTop },
    { c: PAL.ochre, o: 0.8, d: tableFront },
    { c: PAL.terracotta, o: 0.45, d: tableFront },
  ],
  lines: [floor, win, rail, tableTop, tableFront, legs],
  fine: [
    bars,
    curtains,
    hearts,
    'M178 48l10 -8M212 86l12 -10',
    hatch(56, 218, 344, 218, 14, 5, 0, 7),
    hatch(20, 284, 380, 286, 12, 7, 172, 9),
  ],
  parts: [
    place(
      mother({
        mood: 'mmm',
        tilt: 6,
        upper: true,
        arms: [
          [[-18, -104, 9], [-27, -90, 8.5], [-26, -74, 8.5], [-16, -62, 8.5]],
          [[18, -104, 9], [27, -90, 8.5], [28, -74, 8.5], [22, -62, 8.5]],
        ],
      }),
      M,
    ),
    place(
      girl({
        mood: 'laugh',
        tilt: -6,
        upper: true,
        arms: [
          [[-12, -62, 7], [-18, -52, 6.5], [-19, -40, 6.5], [-14, -30, 6.5]],
          [[12, -62, 7], [18, -52, 6.5], [19, -40, 6.5], [14, -30, 6.5]],
        ],
      }),
      G,
    ),
    place(bowl(), `translate(116 ${NEAR - 25}) scale(1.2)`),
    place(bowl(), `translate(290 ${NEAR - 25}) scale(1.2)`),
    // a spoon stands in each bowl
    place(spoon(34), `translate(140 ${NEAR - 52}) rotate(40)`),
    place(spoon(34), `translate(266 ${NEAR - 52}) rotate(-40)`),
    place(pot({ inside: 'porridge' }), `translate(203 ${NEAR - 6}) scale(1.3)`),
    place(steam(3, 40, 11), `translate(203 ${NEAR - 58})`),
  ],
});
