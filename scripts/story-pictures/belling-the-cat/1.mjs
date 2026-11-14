import { PAL } from '../lib.mjs';
import { compose, mouse, place } from './characters.mjs';

// Belling the Cat, 1 (cover): one night under the kitchen table, the mice sit round in a circle: Grandpa
// Mouse (bushy white eyebrows) on the left, two friends on the right, and in the middle the young mouse
// jumps up and holds the little silver bell high on its red ribbon: ding-a-ling! The friends stare, amazed.
const top = 'M0 34C120 30 280 30 400 34L400 56C280 52 120 52 0 56Z';
const legL = 'M2 56L3 262M22 56L21 262';
const legR = 'M378 56L379 262M398 56L397 262';
const boards = 'M0 284C120 281 280 281 400 284M24 284L14 300M130 282L126 300M250 282L254 300M370 284L378 300';
const grain = 'M40 42c40 -2 80 -2 120 -1M220 44c40 -1 80 0 130 2M120 50c30 -1 60 -1 90 0';
const rug = 'M50 262C50 240 360 240 360 262C360 282 50 282 50 262Z';

export default compose({
  title: 'Belling the Cat',
  seed: 71,
  washes: [
    { c: PAL.terracotta, o: 0.75, d: `${top}M2 56L22 56L21 262L3 262ZM378 56L398 56L397 262L379 262Z` },
    { c: PAL.ochre, o: 0.45, d: top },
    { c: PAL.ochre, o: 0.35, d: 'M0 262C120 258 280 258 400 262L400 300L0 300Z' },
    { c: PAL.red, o: 0.35, d: rug },
  ],
  lines: [top, legL, legR],
  fine: [grain, boards],
  parts: [
    place(mouse({ coat: 'grey', pose: 'sit', old: true, mood: 'happy' }), 'translate(76 266) scale(1.2)'),
    place(mouse({ coat: 'fawn', pose: 'stand', arms: 'up', mood: 'happy', withBell: true }), 'translate(154 266) scale(1.35)'),
    place(mouse({ coat: 'brown', pose: 'sit', mood: 'wow' }), 'translate(280 266) scale(-1.1 1.1)'),
    place(mouse({ coat: 'grey', pose: 'sit', mood: 'wow' }), 'translate(344 266) scale(-1.1 1.1)'),
  ],
});
