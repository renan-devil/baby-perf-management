import { PAL } from '../lib.mjs';
import { G_ARMS, bunch, cake, compose, cup, girl, grandmother, jug, place, table, woodcutter } from './characters.mjs';

// Little Red Riding Hood, 10: Grandmother, Little Red Riding Hood and the woodcutter share the cake at
// the table, with honey and apple juice, and the flowers in a jug. Mmm! Everyone is happy again.
const T = 'translate(210 196) scale(1.5)';
const steam = 'M156 166c-4 -6 4 -10 0 -16M288 168c-4 -6 4 -10 0 -16';

export default compose({
  title: 'Cake for everyone',
  seed: 137,
  washes: [{ c: PAL.ochre, o: 0.35, d: 'M0 272L400 272L400 300L0 300Z' }],
  lines: ['M0 272L400 272'],
  fine: [steam],
  parts: [
    place(grandmother({ mood: 'laugh' }), 'translate(196 192) scale(1.2)'),
    place(woodcutter({ mood: 'laugh', upper: true }), 'translate(310 290) scale(0.98)'),
    place(table(), T),
    place(jug(), 'translate(120 192)'),
    place(bunch(), 'translate(120 168) scale(0.9)'),
    place(cake(), 'translate(222 194) scale(1.1)'),
    place(cup(PAL.rose), 'translate(158 192)'),
    place(cup(PAL.sky), 'translate(286 194)'),
    place(girl({ arms: G_ARMS.down, mood: 'happy' }), 'translate(48 276) scale(1.25)'),
  ],
});
