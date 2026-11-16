import { PAL, hatch, rays, tufts } from '../lib.mjs';
import { compose, hare, hedgehog, place } from './characters.mjs';

// The Hare and the Hedgehog, cover: at the edge of the ploughed field, tall Hare laughs and points
// at little Hedgehog's short, crooked legs. Hedgehog, paw on hip, is not amused. (Only one hedgehog
// here: the story is a puzzle.)
const ground = 'M0 262C90 259 200 264 300 261C350 260 380 262 400 261';
const horizon = 'M0 132C60 128 140 134 220 130C300 127 360 132 400 129';
// furrows running away from us towards the horizon
const furrows = [
  'M184 132C176 178 168 216 160 254',
  'M214 131C212 178 206 216 200 254',
  'M244 130C246 156 248 176 249 194',
  'M150 132C140 138 128 142 116 145',
  'M60 133C46 139 30 143 10 147',
  'M372 130C380 146 390 158 400 164',
];
const field = 'M0 132C60 128 140 134 220 130C300 127 360 132 400 129L400 262C380 262 350 260 300 261C200 264 90 259 0 262Z';
// a low hedge along the far side of the field
const hedge = 'M0 131C8 118 22 116 30 124C38 112 56 112 62 124C72 114 88 116 92 128M300 128C306 116 322 114 330 122C338 110 356 110 362 122C370 114 388 114 400 120';
// little turnip tops along the furrows
const turnips = 'M150 186c-3 -6 -1 -10 3 -12M153 186c2 -6 6 -8 10 -7M232 168c-2 -5 0 -9 3 -10M235 168c2 -5 5 -6 8 -5M226 236c-2 -5 0 -9 3 -10M229 236c2 -5 5 -6 8 -5';
// laugh marks round the hare's head
// the Sunday-morning sun
const sun = 'M48 52C48 38 72 38 72 52C72 66 48 66 48 52Z';
const laugh = 'M250 124l-7 -5M244 136l-9 -2M258 112l-4 -8';

export default compose({
  title: 'The Hare and the Hedgehog',
  seed: 41,
  washes: [
    { c: PAL.ochre, o: 0.7, d: sun },
    { c: PAL.terracotta, o: 0.32, d: field },
    { c: PAL.ochre, o: 0.25, d: field },
    { c: PAL.green, o: 0.4, d: 'M0 258C90 255 200 260 300 257C350 256 380 258 400 257L400 300L0 300Z' },
    { c: PAL.green, o: 0.55, d: `${hedge.split('M300')[0]}L0 131ZM300${hedge.split('M300')[1]}L400 131L300 131Z` },
    { c: PAL.green, o: 0.6, d: 'M150 186c-6 -6 -4 -14 6 -14c4 4 2 12 -6 14ZM232 168c-5 -5 -3 -12 5 -11c3 4 1 10 -5 11ZM226 236c-5 -5 -3 -12 5 -11c3 4 1 10 -5 11Z' },
  ],
  lines: [ground, horizon, hedge, sun],
  fine: [...furrows, turnips, laugh, rays(60, 52, 18, 28, 10, 4), hatch(20, 280, 160, 280, 10, 6, 160, 6), hatch(220, 284, 390, 282, 10, 6, 160, 7), tufts([[30, 262], [190, 262], [380, 261]], 9, 9)],
  parts: [
    place(hedgehog({ arm: 'hip', eye: 'cross', mouth: 'flat' }), 'translate(88 268) scale(1.65)'),
    place(hare({ face: 'laugh', ears: 'up', arms: 'point', tilt: -14 }), 'translate(316 262) scale(-1.4 1.4)'),
  ],
});
