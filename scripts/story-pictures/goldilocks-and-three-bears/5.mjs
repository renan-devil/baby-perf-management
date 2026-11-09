import { PAL, hatch, rays } from '../lib.mjs';
import { bear, bed, compose, goldilocks, place } from './characters.mjs';

// Goldilocks and the Three Bears, 5: the three bears, great big Daddy Bear, middle-sized Mummy Bear
// and tiny little Baby Bear, stand round the little bed, and Goldilocks wakes up with a start. Oh!
const floor = 'M0 262C100 259 200 264 300 261C340 260 370 262 400 261';
const BT = 'translate(100 262) scale(1.05)';
const surprise = rays(82, 156, 50, 64, 9, 6, 190);

export default compose({
  title: 'Somebody is still there!',
  seed: 85,
  washes: [{ c: PAL.ochre, o: 0.32, d: 'M0 258C100 255 200 260 300 257C340 256 370 258 400 257L400 296C300 298 100 297 0 296Z' }],
  lines: [floor],
  fine: [surprise, hatch(14, 280, 390, 282, 12, 8, 172, 4)],
  parts: [
    place(bed({ lump: 'sit' }), BT),
    place(
      goldilocks({
        mood: 'surprised',
        upper: true,
        arms: [
          [[-9, -64, 6], [-19, -63, 5], [-28, -67, 5], [-34, -74, 5]],
          [[9, -64, 6], [21, -68, 5], [30, -78, 5], [35, -88, 5]],
        ],
      }),
      'translate(82 275) scale(1.35)',
    ),
    place(bear({ fur: PAL.ochre, o: 0.8, extra: 'scarf', point: true }), 'translate(228 262) scale(0.7)'),
    place(bear({ fur: PAL.terracotta, o: 0.5, extra: 'apron', clasp: true }), 'translate(286 262) scale(1.1)'),
    place(bear({ fur: PAL.terracotta, o: 0.8, extra: 'bow', clasp: true }), 'translate(358 262) scale(1.4)'),
  ],
});
