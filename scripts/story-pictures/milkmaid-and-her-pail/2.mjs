import { PAL, rays, tufts } from '../lib.mjs';
import { P_ARMS, compose, dot, oval, pail, perrette, place } from './characters.mjs';

// The Milkmaid and Her Pail, 2: Perrette gives a happy little skip, hop! Wobble, wobble... the pail
// tips off her head, and SPLOSH, all the milk pours out onto the road.
const PT = 'translate(126 250) scale(1.55)';
const road = 'M0 256C100 250 220 258 300 252C340 249 372 251 400 250L400 276C300 282 120 278 0 288Z';
const roadEdges = 'M0 256C100 250 220 258 300 252C340 249 372 251 400 250M0 288C120 278 300 282 400 276';
// the pail flying off her head, turned on its side with its mouth to the right (rim at 238,41 and
// 226,83), the same size as on her head in picture 1
const PAILT = 'translate(196 52) rotate(105) scale(1.55)';
// the milk gushing out in a big curl, breaking into drops and splashing into a white puddle
const stream =
  'M238 41C250 30 266 30 276 38C290 32 306 44 306 58C318 64 326 80 320 94C330 106 330 124 322 136C328 148 324 162 314 165C305 166 303 156 308 146C311 128 304 110 292 100C280 90 258 84 226 83Z';
const splash =
  'M282 258C276 244 286 238 292 248C290 232 300 228 304 240C306 224 320 224 320 240C326 230 338 234 334 248C344 244 350 254 342 260C326 266 296 266 282 258Z';
const puddle = 'M250 268C258 256 340 254 366 262C374 272 340 280 306 278C272 278 244 276 250 268Z';
const drops = [dot(294, 22, 3), dot(334, 68, 3), dot(340, 110, 2.6), oval(318, 188, 4.5, 6.5), oval(306, 212, 3.6, 5), oval(324, 220, 3.2, 4.5), dot(296, 232, 2.4), dot(342, 228, 2.4), dot(274, 240, 2), dot(354, 246, 2)];
const sploshMarks = 'M272 236l-9 -6M286 224l-4 -9M334 224l5 -9M348 236l9 -6';
// the pail flew off her head: a swoosh between them, and wobble marks
const swoosh = 'M150 50C162 36 178 30 190 32M156 62C166 52 176 48 186 48';
const wobble = 'M232 18q4 -5 10 -4M246 22q5 -3 10 0';
const hop = 'M64 214q-10 -2 -18 4M68 228q-10 -2 -18 4M72 242q-10 -2 -18 4';

export default compose({
  title: 'The Milkmaid and Her Pail',
  seed: 223,
  washes: [
    { c: PAL.green, o: 0.38, d: 'M0 252C100 246 220 254 300 248C340 245 372 247 400 246L400 300L0 300Z' },
    { c: PAL.ochre, o: 0.45, d: road },
    { c: PAL.ochre, o: 0.7, d: dot(44, 44, 13) },
  ],
  after: [{ c: PAL.sky, o: 0.45, d: `${stream}${splash}${puddle}${drops.join('')}` }],
  whites: 'M246 50C268 44 294 56 306 80C316 100 318 124 315 144C312 124 306 108 296 96C284 82 264 70 246 50Z' + 'M276 268C294 262 330 262 348 267C330 272 294 272 276 268Z',
  lines: [roadEdges, stream, splash, puddle],
  fine: [
    dot(44, 44, 13),
    rays(44, 44, 18, 27, 9, 6),
    ...drops,
    sploshMarks,
    wobble,
    swoosh,
    hop,
    'M110 284c4 -2 8 -2 12 0M350 268c4 -2 8 -2 12 0M30 268c4 -2 8 -2 12 0',
    tufts([[18, 250], [210, 255], [388, 249]], 9, 7),
  ],
  parts: [place(perrette({ mood: 'wow', arms: P_ARMS.up, legs: 'skip', tilt: -6 }), PT), place(pail({ spilling: true }), PAILT)],
});
