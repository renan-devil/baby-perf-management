import { PAL } from '../lib.mjs';
import { cat, compose, dot, place, robber } from './characters.mjs';

// The Bremen Town Musicians, 9: in the dark kitchen a robber creeps in and sees the Cat's eyes
// glowing by the fire like two little coals. He jumps with fright!
// the dark is cut away around the two glowing eyes
const glow = dot(108, 220, 17, 13) + dot(140, 220, 17, 13);
const floor = 'M0 262C100 258 300 264 400 260';
const hearth = 'M30 262L30 120L190 120L190 262M18 120L202 120L202 106L18 106Z';
const arch = 'M54 262L54 180C54 150 166 150 166 180L166 262';
const embers = 'M70 258C76 248 90 246 100 252C112 246 128 248 140 256Z';
const stones = 'M36 140l14 0M170 150l14 0M36 200l14 0M172 220l14 0M40 240l10 0';
// fright marks and flying drops around the robber
const fright = 'M262 70l-10 -10M300 58l0 -14M338 70l10 -10M246 108l-12 -2M354 108l12 -2';
const drops = 'M272 96C268 102 270 106 274 106C278 106 278 102 272 96ZM330 94C326 100 328 104 332 104C336 104 336 100 330 94Z';

export default compose({
  title: 'Two little coals in the dark',
  seed: 69,
  washes: [
    { c: PAL.slate, o: 0.62, d: `M0 0L400 0L400 300L0 300Z${glow}`, rule: 'evenodd' },
    { c: PAL.ink, o: 0.12, d: `M0 0L400 0L400 300L0 300Z${glow}`, rule: 'evenodd' },
    { c: PAL.grey, o: 0.5, d: `M30 262L30 120L190 120L190 262ZM18 120L202 120L202 106L18 106Z${arch}Z`, rule: 'evenodd' },
    { c: PAL.ink, o: 0.55, d: `${arch}Z${glow}`, rule: 'evenodd' },
    { c: PAL.ochre, o: 0.35, d: glow },
    { c: PAL.red, o: 0.8, d: embers },
    { c: PAL.ochre, o: 0.35, d: 'M60 260C60 236 140 236 150 260Z' },
    { c: PAL.sky, o: 0.8, d: drops },
  ],
  lines: [floor, hearth, arch],
  fine: [stones, embers, fright, drops, 'M86 252l4 -4M112 250l4 -4'],
  parts: [
    // only her glowing eyes show in the dark, beside the embers
    place(cat({ pose: 'eyes' }), 'translate(124 220) scale(2.1)'),
    place(robber({ pose: 'jump', tint: PAL.sky }), 'translate(300 200) scale(1.15)'),
  ],
});
