import { PAL, tufts } from '../lib.mjs';
import { compose, dot, place, profileRabbit, sparkle } from './characters.mjs';

// The Velveteen Rabbit, 10: under the full moon the little rabbit, Real at last, with hind legs to
// jump with, hops through the wood with the wild rabbits; he still has his brown spots and his
// pink-lined ears.
const ground = 'M0 262C90 259 200 263 300 260C340 259 370 261 400 260';
const moon = dot(318, 62, 30);
// the night sky over the wood, with a round hole for the moon
const sky = `M0 0L400 0L400 118C340 108 300 96 250 98C200 100 150 92 100 98C60 102 30 112 0 108Z${moon}`;
// tree trunks at the edges of the wood, and their dark crowns
const trees = 'M2 262C6 210 2 150 8 90M28 262C24 214 28 160 24 96M372 262C376 222 372 176 378 130M394 262C392 226 396 180 392 136';
const crowns = 'M-22 100C-26 70 -6 48 16 52C34 40 60 54 54 78C66 92 48 112 28 106C14 118 -12 116 -22 100ZM354 138C350 116 366 100 384 104C398 96 414 106 410 124C418 136 404 150 392 146C380 156 360 152 354 138Z';
const hop = 'M96 268c6 -4 12 -4 18 0M228 270c6 -4 12 -4 18 0';

export default compose({
  title: 'The rabbit, now Real, hops with the wild rabbits under the moon',
  seed: 4210,
  washes: [
    { c: PAL.slate, o: 0.42, d: sky, rule: 'evenodd' },
    { c: PAL.ochre, o: 0.45, d: moon },
    { c: PAL.green, o: 0.4, d: 'M0 258C90 255 200 259 300 256C340 255 370 257 400 256L400 300L0 300Z' },
    { c: PAL.slate, o: 0.35, d: 'M0 258C90 255 200 259 300 256C340 255 370 257 400 256L400 300L0 300Z' },
    { c: PAL.green, o: 0.6, d: crowns },
    { c: PAL.slate, o: 0.45, d: crowns },
    { c: PAL.terracotta, o: 0.4, d: 'M2 262C6 210 2 150 8 90L24 96C28 160 24 214 28 262ZM372 262C376 222 372 176 378 130L392 136C396 180 392 226 394 262Z' },
  ],
  lines: [ground, trees, crowns, moon],
  fine: [hop, sparkle(120, 40, 5), sparkle(200, 72, 4), sparkle(250, 30, 5), sparkle(150, 120, 3.5), tufts([[70, 262], [160, 262], [300, 261], [350, 260]], 10, 5)],
  parts: [
    place(profileRabbit({ pose: 'hop', ears: 6 }), 'translate(80 230) scale(1.05)'),
    place(profileRabbit({ pose: 'hop', real: true, ears: 6 }), 'translate(206 210) rotate(-6) scale(1.5)'),
    place(profileRabbit({ pose: 'hop', tint: 0.9, ears: 6 }), 'translate(322 236) rotate(4) scale(1.0)'),
  ],
});
