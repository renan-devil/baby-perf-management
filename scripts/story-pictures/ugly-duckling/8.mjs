import { PAL, hatch } from '../lib.mjs';
import { child, compose, duckling, place } from './characters.mjs';

// The Ugly Duckling, 8: by the fire in the farmer's kitchen, the little girl gives the duckling some
// bread, and the duckling is warm at last.
const floor = 'M0 252C100 249 300 253 400 250';
const mantel = 'M246 112L400 109M246 112L246 122L400 119';
const fireplace = 'M258 122L258 252M282 252L282 172C282 142 372 140 380 172L380 252';
const stones = 'M258 150l24 0M258 184l24 0M258 218l24 0M300 150l8 -8M340 142l2 -10M372 154l10 -6';
const logs = 'M296 248C296 238 352 236 356 244C358 252 300 254 296 248ZM312 240L346 230C352 230 354 238 348 240L316 248';
const flames = 'M300 240C296 222 308 210 312 196C316 210 320 216 322 226C324 210 330 198 330 180C338 196 346 212 342 230C348 222 350 214 352 206C360 220 360 234 352 242Z';
const innerFlame = 'M314 240C312 228 318 222 320 214C324 224 328 230 330 222C334 230 336 236 332 242Z';
const glowMarks = 'M240 176l-12 -4M244 206l-14 0M242 236l-12 4';
const bread = 'M120 170C120 162 138 160 142 166C146 172 140 178 130 178C124 178 120 176 120 170Z';
const crumbs = 'M148 214l2 2M138 224l2 1M156 228l2 1';

export default compose({
  title: 'Warm by the fire',
  seed: 78,
  washes: [
    { c: PAL.ochre, o: 0.18, d: 'M0 0L400 0L400 252C300 253 100 249 0 252Z' },
    { c: PAL.ochre, o: 0.35, d: 'M232 90C260 60 330 56 400 62L400 262C340 270 280 268 250 250C228 220 222 130 232 90Z' },
    { c: PAL.terracotta, o: 0.4, d: 'M0 252C100 249 300 253 400 250L400 300L0 300Z' },
    { c: PAL.grey, o: 0.55, d: 'M246 112L400 109L400 252L380 252L380 172C372 140 282 142 282 172L282 252L258 252L258 122L246 122Z' },
    { c: PAL.slate, o: 0.3, d: 'M282 252L282 172C282 142 372 140 380 172L380 252Z' },
    { c: PAL.terracotta, o: 0.7, d: logs },
    { c: PAL.ochre, o: 0.95, d: flames },
    { c: PAL.red, o: 0.4, d: flames },
    { c: PAL.ochre, o: 0.9, d: innerFlame },
    { c: PAL.ochre, o: 0.85, d: bread },
  ],
  lines: [floor, mantel, fireplace, logs, flames],
  fine: [stones, innerFlame, glowMarks, bread, crumbs, 'M126 168q6 -2 10 2', hatch(30, 270, 380, 272, 8, 8, 172, 5)],
  parts: [place(child({ pose: 'sit' }), 'translate(58 256) scale(1.65)'), place(duckling({ head: 18 }), 'translate(216 252) scale(-1.5 1.5)')],
});
