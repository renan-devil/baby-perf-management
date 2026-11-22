import { PAL, tufts } from '../lib.mjs';
import { C_ARMS, chamberlain, compose, girl, nightingale, note, merge, place } from './characters.mjs';

// The Nightingale, 3: at the edge of the forest, the little kitchen girl points up: "There she
// is!" On a branch sits the small brown nightingale, and the grand Chamberlain in his tall hat
// stares in surprise: "Such a plain little bird?"
const C = 'translate(84 272) scale(1.12)';
const G = 'translate(190 274) scale(1.25)';
const B = 'translate(306 130) rotate(-8) scale(1.7)';
const ground = 'M0 262C90 256 200 262 300 258C340 256 372 258 400 258L400 300L0 300Z';
const trunk = 'M352 262C356 220 352 170 356 120C358 90 362 60 360 30L384 30C384 70 380 110 380 150C380 190 384 230 386 262Z';
const branch = 'M358 148C330 148 310 152 278 156L278 162C310 160 330 158 358 160Z';
const crown = 'M300 52C296 30 320 14 344 22C356 6 392 8 400 22L400 92C390 104 366 100 356 90C340 100 312 92 306 78C290 74 288 58 300 52Z';
const leaves = 'M280 157c4 -8 12 -10 18 -6c-4 8 -12 9 -18 6ZM326 152c-2 -8 4 -14 12 -12c2 8 -4 13 -12 12Z';

export default compose({
  title: 'The kitchen girl shows the Chamberlain the nightingale',
  seed: 1227,
  washes: [
    { c: PAL.green, o: 0.4, d: ground },
    { c: PAL.terracotta, o: 0.55, d: trunk + branch },
    { c: PAL.slate, o: 0.3, d: trunk + branch },
    { c: PAL.green, o: 0.65, d: crown + leaves },
  ],
  lines: [trunk, branch, crown],
  fine: [leaves, 'M326 50c4 -4 9 -4 12 0M360 60c4 -4 9 -4 12 0M372 36c4 -4 9 -4 12 0', tufts([[20, 262], [150, 262], [260, 260], [330, 260]], 9, 1227)],
  parts: [
    place(chamberlain({ mood: 'wow', tilt: 6, arms: C_ARMS.wow }), C),
    place(
      girl({
        mood: 'up',
        tilt: 8,
        arms: [
          [[-13, -66, 6.5], [-17, -55, 6], [-15, -44, 6]],
          [[13, -66, 6.5], [28, -76, 6], [44, -92, 6]],
        ],
      }),
      G,
    ),
    place(nightingale({ beak: 'open' }), B),
    merge(note(272, 100, 1.4), note(250, 76, 1.2)),
  ],
});
