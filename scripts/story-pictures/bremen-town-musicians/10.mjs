import { PAL, hatch } from '../lib.mjs';
import { cat, compose, dog, donkey, fire, note, place, rooster } from './characters.mjs';

// The Bremen Town Musicians, 10: the four friends sit together, warm and happy, in front of the fire
// in their new little home, and sing their music every evening.
const floor = 'M0 250C100 246 300 252 400 248';
const hearth = 'M140 240L140 96L270 96L270 240M128 96L282 96L282 82L128 82Z';
const arch = 'M160 240L160 170C160 140 250 140 250 170L250 240';
const stones = 'M146 120l14 0M250 116l14 0M146 200l10 0M256 190l10 0M180 104l16 0M226 106l14 0';
const heart = (x, y, s) => `M${x} ${y + 3 * s}C${x - 5 * s} ${y - s} ${x - 4 * s} ${y - 5 * s} ${x} ${y - 2.5 * s}C${x + 4 * s} ${y - 5 * s} ${x + 5 * s} ${y - s} ${x} ${y + 3 * s}Z`;
const hearts = heart(300, 70, 1.8) + heart(110, 54, 1.4);
const notes = [note(70, 50, 1, -8), note(330, 40, 0.9, 10), note(205, 50, 1, 4)];
const F = fire();

export default compose({
  title: 'Home, sweet home',
  seed: 70,
  washes: [
    { c: PAL.ochre, o: 0.3, d: 'M0 0L400 0L400 250L0 250Z' },
    { c: PAL.terracotta, o: 0.4, d: `${floor}L400 300L0 300Z` },
    { c: PAL.grey, o: 0.55, d: `M140 240L140 96L270 96L270 240ZM128 96L282 96L282 82L128 82Z${arch}Z`, rule: 'evenodd' },
    { c: PAL.ink, o: 0.45, d: `${arch}Z` },
    { c: PAL.rose, o: 0.85, d: hearts },
  ],
  lines: [floor, hearth, arch],
  fine: [stones, hearts, ...notes.flatMap((n) => n.fine), hatch(20, 276, 380, 276, 10, 8, 170, 3)],
  fills: notes.flatMap((n) => n.fills).map((d) => `<path d="${d}"/>`).join(''),
  parts: [
    place(F, 'translate(205 234) scale(1.2)'),
    place(donkey(), 'translate(64 262) scale(0.72)'),
    place(dog({ pose: 'lie' }), 'translate(206 290) scale(-0.82 0.82)'),
    place(cat({ pose: 'sit' }), 'translate(296 266) scale(1.15)'),
    place(rooster(), 'translate(350 262) scale(-0.7 0.7)'),
  ],
});
