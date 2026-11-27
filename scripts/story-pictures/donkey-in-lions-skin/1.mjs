import { PAL, tufts } from '../lib.mjs';
import { compose, donkey, lionSkin, place, shag } from './characters.mjs';

// The Donkey in the Lion's Skin, 1 (cover): trotting through the forest, the little grey donkey finds a
// big golden lion skin lying in the grass, left behind by hunters, and bends his head to sniff it.
const GROUND = 262;
const DONKT = `translate(96 ${GROUND}) scale(1.3)`;
const SKINT = `translate(282 ${GROUND - 6}) scale(1.1)`;
// a tree at the edge of the forest
const trunk = `M334 228C337 200 338 170 336 140M352 228C350 200 350 170 354 140`;
const crown = shag(346, 102, 42, 34, 9, 14, 4);
const ground = `M0 ${GROUND - 2}C80 ${GROUND - 6} 160 ${GROUND} 240 ${GROUND - 4}C300 ${GROUND - 7} 360 ${GROUND - 3} 400 ${GROUND - 5}`;
// a little "?" over his head: what is this?
const ask = 'M258 76C258 68 270 66 271 74C272 80 264 81 264 88';

export default compose({
  title: "The Donkey in the Lion's Skin",
  seed: 2201,
  washes: [
    { c: PAL.green, o: 0.34, d: `${ground}L400 300L0 300Z` },
    { c: PAL.green, o: 0.55, d: crown },
    { c: PAL.terracotta, o: 0.45, d: `M334 228C337 200 338 170 336 140L354 140C350 170 350 200 352 228Z` },
  ],
  lines: [ground, trunk, crown],
  fine: [ask, 'M264 95l0.3 1', tufts([[22, GROUND - 2], [200, GROUND - 2], [380, GROUND - 5], [60, 284], [250, 290], [350, 280]], 10, 7)],
  parts: [place(lionSkin(), SKINT), place(donkey({ mood: 'curious', headTurn: 30 }), DONKT)],
});
