import { PAL, hatch, transformPath } from '../lib.mjs';
import { F_ARMS, compose, dot, fisherman, place } from './characters.mjs';

// The Fisherman and His Wife, 8: a great storm. Black clouds, the wind howling whoooo, rain, and waves
// as tall as church towers crashing on the rocks. On the shore the fisherman leans into the wind and
// holds on to his hat.
const ground = 'M0 270C50 268 120 271 180 270';
// three heavy black clouds
const clouds =
  'M16 52C2 44 8 22 30 22C36 6 66 2 80 14C94 2 124 6 128 24C150 22 158 46 140 56C120 66 40 66 16 52Z' +
  'M128 40C120 24 140 10 160 16C172 0 210 0 220 14C236 6 262 14 260 30C282 30 286 54 266 62C240 72 160 70 140 62C124 58 120 48 128 40Z' +
  'M260 30C258 12 284 4 300 14C314 0 350 2 356 18C378 14 396 30 386 46C392 60 370 70 350 64C320 72 280 66 270 56C258 50 256 40 260 30Z';
const cloudsD = transformPath(clouds, 'translate(0 8)');
// a huge wave, its crest curling over towards the shore
const wave = 'M214 271C236 232 276 194 298 156C312 130 318 108 302 100C290 94 278 100 274 112C266 96 278 70 304 62C342 50 382 66 400 96L400 271Z';
const waveEdge = 'M214 271C236 232 276 194 298 156C312 130 318 108 302 100C290 94 278 100 274 112C266 96 278 70 304 62C342 50 382 66 400 96';
const curl = 'M286 110C292 104 300 106 300 114M330 76C350 72 372 80 386 94';
const wave2 = 'M262 270C276 244 304 226 340 220C368 216 390 224 400 232L400 270Z';
const wave2Edge = 'M262 270C276 244 304 226 340 220C368 216 390 224 400 232';
const rocks = 'M168 271C168 250 186 238 204 242C216 228 244 234 250 252C258 256 262 264 262 271Z';
const spray = [[204, 206, 3], [218, 194, 2.6], [190, 196, 2.4], [232, 210, 2.2], [182, 214, 2], [210, 180, 2], [262, 106, 2.4], [256, 120, 2], [268, 92, 2]];
const wind = 'M4 118C18 114 32 122 46 116C52 112 50 106 44 106M6 172C20 168 32 174 42 170M156 116C182 110 200 118 220 112C228 108 228 102 222 100M150 160C168 156 182 162 196 156';

export default compose({
  title: 'The fisherman in the great storm',
  seed: 68,
  washes: [
    { c: PAL.ink, o: 0.62, d: cloudsD },
    { c: PAL.slate, o: 0.6, d: cloudsD },
    { c: PAL.slate, o: 0.8, d: wave },
    { c: PAL.ink, o: 0.3, d: wave },
    { c: PAL.sky, o: 0.5, d: wave2 },
    { c: PAL.slate, o: 0.6, d: wave2 },
    { c: PAL.grey, o: 0.8, d: rocks },
    { c: PAL.ink, o: 0.3, d: rocks },
    { c: PAL.ochre, o: 0.3, d: `${ground}L262 271L262 300L0 300Z` },
    { c: PAL.slate, o: 0.45, d: 'M262 271L400 270L400 300L262 300Z' },
  ],
  lines: [ground, cloudsD, waveEdge, curl, wave2Edge, rocks],
  fine: [
    wind,
    spray.map(([x, y, r]) => dot(x, y, r)).join(''),
    'M206 226l-8 -10M220 222l-2 -14M234 226l6 -12', // crash!
    'M318 150q14 -8 28 0M330 186q14 -8 28 0M288 206q12 -7 24 0M356 122q12 -7 24 0',
    'M206 236C214 230 222 232 228 238M236 248l8 -4',
    // rain, slanting in the wind
    hatch(20, 82, 240, 82, 11, 10, 118, 21),
    hatch(4, 140, 40, 140, 2, 10, 118, 22),
    hatch(170, 150, 250, 150, 3, 10, 118, 23),
    hatch(6, 236, 44, 236, 2, 8, 118, 24),
    hatch(150, 236, 176, 236, 2, 8, 118, 25),
    'M0 284l12 0M40 290l14 0M90 282l12 0M140 292l14 0M180 284l12 0',
  ],
  parts: [place(fisherman({ mood: 'worried', arms: F_ARMS.hat, tilt: 9, look: [1.5, 0] }), 'translate(96 271) scale(1.3)')],
});
