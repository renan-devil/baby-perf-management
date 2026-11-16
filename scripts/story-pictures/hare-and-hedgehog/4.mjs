import { PAL, hatch, tufts } from '../lib.mjs';
import { compose, dot, hareFlat, hedgehog, place } from './characters.mjs';

// The Hare and the Hedgehog, 4: Flump! After running down and up and down the field again and
// again, Hare flops flat on the grass, tongue out, ears floppy, puffing and panting (tired out, not
// hurt). His zigzag tracks go up and down the furrows behind him; far away at the end of the field a
// small hedgehog waits.
const horizon = 'M0 132C80 128 180 134 260 130C320 128 370 131 400 129';
const field = 'M0 132C80 128 180 134 260 130C320 128 370 131 400 129L400 266C300 268 120 264 0 268Z';
const fieldEdge = 'M0 268C120 264 300 268 400 266';
// furrows running away towards the far end of the field
const furrows = 'M20 236C60 200 104 160 136 132M96 196C120 170 144 150 162 132M372 214C360 190 346 160 336 130M396 196C384 176 372 154 364 130';
// his tracks, zigzagging down and up the field again and again
const tracks = 'M136 206L172 136L196 200L226 134L250 196L282 134';
// the far hedge
const hedge = 'M0 131C8 118 22 116 30 124C38 112 56 112 62 124C72 114 88 116 92 128';
// puffs of breath in front of his mouth
const puffs = dot(346, 252, 5, 4) + dot(360, 242, 4, 3.4) + dot(362, 256, 3.4, 2.8);
// drops of effort and puffs of breath
const drops = 'M300 190C297 184 301 181 303 186C305 190 301 193 300 190ZM316 200C313 194 317 191 319 196C321 200 317 203 316 200Z';

export default compose({
  title: 'Flump! Hare is tired out',
  seed: 44,
  washes: [
    { c: PAL.terracotta, o: 0.3, d: field },
    { c: PAL.ochre, o: 0.22, d: field },
    { c: PAL.green, o: 0.42, d: 'M0 264C120 260 300 264 400 262L400 300L0 300Z' },
    { c: PAL.green, o: 0.55, d: `${hedge}L92 132L0 132Z` },
    { c: PAL.sky, o: 0.8, d: drops },
  ],
  lines: [horizon, hedge, fieldEdge],
  fine: [furrows, drops, puffs, hatch(20, 286, 180, 286, 10, 6, 160, 6), hatch(240, 288, 390, 286, 9, 6, 160, 7), tufts([[30, 266], [130, 270], [370, 266], [380, 266]], 9, 9)],
  once: `<path d="${tracks}" stroke-dasharray="0.1 7" stroke-width="2"/>`,
  parts: [
    place(hedgehog({ arm: 'down', eye: 'open', mouth: 'smile' }), 'translate(296 132) scale(0.5)'),
    place(hareFlat(), 'translate(206 270) scale(1.75)'),
  ],
});
