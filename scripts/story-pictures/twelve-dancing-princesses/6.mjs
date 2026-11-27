import { PAL, tufts } from '../lib.mjs';
import { P_ARMS, S_ARMS, at, compose, crack, ghost, place, princess, soldier, sparkles, tree, twig, youngest } from './characters.mjs';

// Picture 6: the princesses walk through a forest where every leaf is made of silver (further on,
// gold and diamond trees). Behind them, the invisible soldier snaps off a silver twig. Crack!
const S = 'translate(128 264) scale(-1 1)';
const [hx, hy] = at(48, -142, S);
const inv = ghost(place(soldier({ arms: S_ARMS.snap, mood: 'happy' }), S));
const shine = sparkles([[30, 120, 4], [96, 150, 3.5], [330, 86, 4], [384, 120, 3.5], [176, 140, 3], [244, 132, 3]]);

export default compose({
  title: 'The Silver Forest',
  seed: 4106,
  washes: [{ c: PAL.green, o: 0.25, d: 'M10 266C80 256 320 256 392 266C392 276 300 282 200 282C100 282 10 276 10 266Z' }],
  after: inv.washes,
  lines: [],
  fine: [crack(hx + 2, hy - 2, 0.9), tufts([[30, 270], [170, 272], [300, 272], [380, 270]], 8, 9)],
  once: inv.once,
  parts: [
    place(tree({ c: PAL.ochre, r: 22, h: 42, seed: 3, shiny: true, o: 0.75 }), 'translate(172 196)'),
    place(tree({ c: PAL.sky, r: 18, h: 36, seed: 5, shiny: true, o: 0.8 }), 'translate(238 180)'),
    place(tree({ c: PAL.slate, r: 46, h: 92, seed: 1, shiny: true, o: 0.5 }), 'translate(40 266)'),
    place(tree({ c: PAL.slate, r: 34, h: 116, seed: 6, shiny: true, o: 0.5 }), 'translate(362 266)'),
    shine,
    place(twig(PAL.slate), `translate(${hx - 2} ${hy + 4}) rotate(-30) scale(0.8)`),
    place(youngest({ mood: 'wow', look: -1 }), 'translate(214 266)'),
    place(princess({ who: 'sister', dress: PAL.ochre, hair: PAL.terracotta, look: 1 }), 'translate(264 266) scale(0.95)'),
    place(princess({ who: 'eldest', look: 1, arms: P_ARMS.down }), 'translate(316 266)'),
  ],
});
