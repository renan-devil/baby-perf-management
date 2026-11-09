import { PAL, hatch, transformPath, tufts } from '../lib.mjs';
import { brickHouse, compose, pigFace, place, wolf } from './characters.mjs';

// The Three Little Pigs, 4: the wolf huffs and PUFFS until his face goes red, but the brick house
// does not move, not one brick. The three little pigs peep out of the windows, safe and smiling.
const ground = 'M0 258C100 254 200 260 300 256C350 254 380 257 400 255';
const HT = 'translate(290 257) scale(1.32)';
const at = (x, y) => transformPath(`M${x} ${y}`, HT).slice(2).split(' ').map(Number);

// Gusts from the wolf's mouth that curl back off the wall
const wind =
  'M156 122C176 114 194 124 204 146C206 152 200 156 196 152' +
  'M158 136C176 136 190 150 198 172C200 178 194 182 190 178' +
  'M156 150C168 158 178 174 186 196C188 202 182 205 179 201';
// effort marks around his straining head
const strain = 'M50 112l-8 -2M50 124l-9 2M56 98l-7 -5M148 92l6 -6M154 104l8 -3';
// A little daisy by the door that does not even sway
const daisy = 'M318 256L318 236M318 246c4 -4 8 -4 10 -2';
const [l1x, l1y] = at(-46, -47);
const [l2x, l2y] = at(-30, -47);
const [r1x, r1y] = at(38, -47);

export default compose({
  title: 'Not one brick',
  seed: 44,
  washes: [{ c: PAL.green, o: 0.4, d: 'M0 254C100 250 200 256 300 252C350 250 380 253 400 251L400 296C300 300 100 298 0 296Z' }],
  after: [{ c: PAL.ochre, o: 0.9, d: 'M318 230c-5 -6 -1 -10 0 -4c1 -6 5 -2 0 4c6 -1 6 4 0 2c3 5 -2 6 0 0c-4 5 -7 1 0 -2Z' }],
  lines: [ground, daisy, wind],
  fine: [
    strain,
    'M318 233m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0',
    hatch(20, 274, 380, 276, 11, 8, 170, 9),
    tufts([[14, 257], [176, 258], [238, 257], [380, 255]], 9, 8),
  ],
  parts: [
    place(brickHouse({ windowFaces: true }), HT),
    place(pigFace(), `translate(${l1x} ${l1y}) scale(0.5)`),
    place(pigFace(), `translate(${l2x} ${l2y}) scale(0.5)`),
    place(pigFace(), `translate(${r1x} ${r1y}) scale(0.5)`),
    place(wolf({ pose: 'puff', red: true }), 'translate(80 258) scale(1.1)'),
  ],
});
