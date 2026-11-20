import { PAL, hatch } from '../lib.mjs';
import { compose, mcgregor, place, peter } from './characters.mjs';

// The Tale of Peter Rabbit, 2: among the vegetable rows, Mr McGregor runs after Peter waving his
// rake ("Stop, thief!"), and Peter bounds away, ears streaming back.
const M = 'translate(92 274) scale(1.12)';
const P = 'translate(298 168) scale(1.45)';

// Rows of earth across the garden, with cabbages on them (one cabbage, drawn once, placed along them)
const rows = 'M0 226C100 222 260 224 400 220M0 252C120 248 280 251 400 247M0 284C120 280 280 283 400 279';
const cabbage = {
  lines: ['M-14 0C-18 -10 -12 -20 0 -20C12 -20 18 -10 14 0C6 3 -6 3 -14 0Z'],
  fine: ['M-14 0C-22 -6 -22 -14 -14 -14M14 0C22 -6 22 -14 14 -14M0 -20C-6 -14 -6 -6 0 0M0 -20C6 -14 6 -6 0 0M-8 -12q8 -5 16 0'],
  washes: [{ c: PAL.green, o: 0.8, d: 'M-14 0C-22 -6 -22 -14 -14 -14C-14 -18 -8 -20 0 -20C8 -20 14 -18 14 -14C22 -14 22 -6 14 0C6 3 -6 3 -14 0Z' }],
};
const CABBAGES = [
  [196, 224, 0.8],
  [246, 223, 0.8],
  [370, 221, 0.8],
  [200, 250, 1],
  [356, 248, 1],
  [12, 283, 1.15],
  [240, 282, 1.15],
  [312, 281, 1.15],
  [386, 280, 1.15],
];

// Little lost shoe among the cabbages, and dust and speed marks behind Peter
const shoe = 'M168 280C164 274 172 270 180 272C186 273 190 276 188 280Z';
const speed = 'M196 172L222 170M190 186L218 185M200 200L222 200';

export default compose({
  title: 'Mr McGregor runs after Peter with his rake',
  seed: 82,
  washes: [
    { c: PAL.ochre, o: 0.32, d: 'M0 220C100 216 260 218 400 214L400 300L0 300Z' },
    { c: PAL.terracotta, o: 0.28, d: 'M0 226C100 222 260 224 400 220L400 232C260 236 100 234 0 238ZM0 252C120 248 280 251 400 247L400 259C280 263 120 260 0 264ZM0 284C120 280 280 283 400 279L400 291C280 295 120 292 0 296Z' },
    { c: PAL.terracotta, o: 0.8, d: shoe },
  ],
  lines: [rows, shoe],
  fine: [
    'M172 274l14 2',
    speed,
    hatch(20, 240, 380, 238, 10, 6, 165, 3),
    hatch(20, 270, 380, 268, 10, 6, 165, 8),
  ],
  parts: [
    ...CABBAGES.map(([x, y, s]) => place(cabbage, `translate(${x} ${y}) scale(${s})`)),
    place(mcgregor(), M),
    place(peter({ pose: 'run', mood: 'scared' }), P),
  ],
});
