import { PAL, hatch } from '../lib.mjs';
import { compose, dot, goldilocks, oval, place } from './characters.mjs';

// Goldilocks and the Three Bears, 2: on the table stand three bowls of porridge, a great big one, a
// middle-sized one and a tiny little one. Goldilocks tastes the little one: just right! Mmm!
const f = (n) => Math.round(n * 10) / 10;
const floor = 'M0 262C100 259 200 264 300 261C340 260 370 262 400 261';
const TOP = 190;
const table = `M52 ${TOP}L388 ${TOP}M66 ${TOP + 26}L68 262M374 ${TOP + 26}L372 262`;
// a red checked cloth hanging over the table in soft scallops
const clothEdge = (() => {
  let d = `M48 ${TOP}L48 ${TOP + 22}`;
  for (let x = 48; x < 391; x += 28.67) d += `Q${f(x + 14.3)} ${TOP + 32} ${f(x + 28.67)} ${TOP + 22}`;
  return `${d}L392 ${TOP}`;
})();
const checks = 'M76 194L76 216M106 194L106 216M134 194L134 216M162 194L162 216M190 194L190 216M220 194L220 216M248 194L248 216M276 194L276 216M306 194L306 216M334 194L334 216M362 194L362 216M50 203L390 203';

// A bowl standing on the table: rim at TOP - h, porridge showing inside the rim.
const bowl = (x, w, h) => {
  const top = TOP - h;
  return {
    body: `M${f(x - w / 2)} ${top}C${f(x - w / 2)} ${f(top + h * 1.25)} ${f(x + w / 2)} ${f(top + h * 1.25)} ${f(x + w / 2)} ${top}`,
    rim: oval(x, top, w / 2, h * 0.2),
    fill: `M${f(x - w / 2)} ${top}C${f(x - w / 2)} ${f(top + h * 1.25)} ${f(x + w / 2)} ${f(top + h * 1.25)} ${f(x + w / 2)} ${top}Z`,
  };
};
const big = bowl(334, 78, 34);
const mid = bowl(258, 54, 24);
const little = bowl(186, 36, 17);
const spoons = 'M350 154L374 132M374 132C378 126 386 128 382 134C380 138 376 136 374 132M270 168L288 150M288 150C292 145 299 147 295 152C293 156 289 154 288 150';
const steam = 'M314 140C308 130 320 124 314 112C310 104 318 98 316 92M334 136C328 126 340 120 334 108C330 100 338 94 336 88M354 140C348 132 358 126 354 116';

// Goldilocks, spoon at her mouth (her spoon is drawn in her own coordinates and placed with her)
const GT = 'translate(122 246) scale(1.55)';
const spoon = 'M20 -66L10 -76M10 -76C9 -81 1 -82 0 -78C0 -74 7 -73 10 -76Z';
const hand = 'M16 -64C14 -70 22 -72 24 -66C24 -62 18 -60 16 -64Z';

export default compose({
  title: 'Just right!',
  seed: 82,
  washes: [
    { c: PAL.ochre, o: 0.32, d: 'M0 258C100 255 200 260 300 257C340 256 370 258 400 257L400 296C300 298 100 297 0 296Z' },
    { c: PAL.ochre, o: 0.7, d: `M62 ${TOP + 24}L72 ${TOP + 24}L72 262L64 262ZM370 ${TOP + 24}L378 ${TOP + 24}L376 262L368 262Z` },
    { c: PAL.rose, o: 0.45, d: `${clothEdge}Z` },
    { c: PAL.red, o: 0.35, d: 'M76 190L91 190L91 216L76 216ZM134 190L148 190L148 216L134 216ZM190 190L205 190L205 216L190 216ZM248 190L262 190L262 216L248 216ZM306 190L320 190L320 216L306 216ZM362 190L376 190L376 216L362 216Z' },
    { c: PAL.terracotta, o: 0.75, d: big.fill },
    { c: PAL.sky, o: 0.75, d: mid.fill },
    { c: PAL.rose, o: 0.8, d: little.fill },
    { c: PAL.ochre, o: 0.4, d: big.rim + mid.rim + little.rim },
    { c: PAL.grey, o: 0.55, d: 'M350 154L374 132L377 135L353 157ZM270 168L288 150L291 153L273 171Z' },
  ],
  whites: dot(378, 131, 3) + dot(292, 149, 2.6),
  lines: [floor, table, clothEdge, big.body, mid.body, little.body, big.rim, mid.rim, little.rim],
  fine: [
    checks,
    spoons,
    steam,
    'M178 172q4 -2 8 0M250 164q5 -2 10 0M322 154q6 -2 12 0',
    // little hearts of delight
    'M44 84C40 78 32 82 38 90L44 96L50 90C56 82 48 78 44 84Z',
    'M22 112C20 108 15 111 19 115L22 119L26 115C29 111 24 108 22 112Z',
    hatch(14, 278, 380, 280, 12, 8, 172, 4),
  ],
  parts: [
    place(
      goldilocks({
        mood: 'yum',
        tilt: 6,
        upper: true,
        arms: [
          [[-9, -64, 6], [-15, -54, 5], [-19, -44, 5], [-20, -38, 5]],
          [[9, -63, 6], [19, -56, 5.5], [25, -50, 5], [24, -58, 5], [20, -65, 5]],
        ],
      }),
      GT,
    ),
    place({ lines: [spoon], fine: [hand], washes: [{ c: PAL.grey, o: 0.7, d: spoon }, { c: PAL.rose, o: 0.5, d: hand }] }, GT),
  ],
});
