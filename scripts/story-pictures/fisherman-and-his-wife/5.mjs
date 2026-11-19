import { PAL, hatch, transformPath, tufts } from '../lib.mjs';
import { I_ARMS, I_SIL_WIDE, compose, ilsebill, place } from './characters.mjs';

// The Fisherman and His Wife, 5: where the cottage stood there is now a huge stone castle with tall
// towers and flags. Ilsebill stands proudly at the top of its steps, in a fine dress, arms flung
// wide: "Look at my castle!"
const ground = 'M0 272C90 270 200 274 300 271C340 270 370 272 400 271';
const I = 'translate(200 230) scale(0.8)';
const sil = transformPath(I_SIL_WIDE, I);
// crenellated top edge from x0 to x1 at height y (teeth 12 wide, 9 high)
const battlements = (x0, x1, y) => {
  let d = `M${x0} ${y + 9}`;
  for (let x = x0; x < x1 - 1; x += 12) d += `L${x} ${y}L${x + 6} ${y}L${x + 6} ${y + 9}L${Math.min(x + 12, x1)} ${y + 9}`;
  return `${d}L${x1} ${y}`;
};
const keep = `M124 105${battlements(124, 276, 96).slice(`M124 105`.length)}`;
const towerL = `M64 230L64 66${battlements(64, 124, 57).slice(`M64 66`.length)}L124 230`;
const towerR = `M276 230L276 66${battlements(276, 336, 57).slice(`M276 66`.length)}L336 230`;
const gate = 'M160 230L160 150C160 112 240 112 240 150L240 230';
const steps = 'M150 230L250 230M142 230L142 240L258 240L258 230M132 240L132 250L268 250L268 240M120 250L120 260L280 260L280 250M106 260L106 271L294 271L294 260';
const flags = 'M94 57L94 20M94 22C104 16 112 28 124 22C118 32 106 36 94 38M306 57L306 20M306 22C316 16 324 28 336 22C330 32 318 36 306 38';
const slits = 'M90 100l0 18M90 150l0 18M310 100l0 18M310 150l0 18M140 130l0 16M260 130l0 16';

export default compose({
  title: 'Ilsebill at the stone castle',
  seed: 65,
  washes: [
    { c: PAL.grey, o: 0.55, d: `${towerL}Z${towerR}Z` },
    { c: PAL.grey, o: 0.42, d: `${keep}L276 230L124 230Z${gate}Z`, rule: 'evenodd' },
    { c: PAL.slate, o: 0.62, d: `${gate}Z${sil}`, rule: 'evenodd' },
    { c: PAL.grey, o: 0.35, d: 'M142 230L258 230L258 240L268 240L268 250L280 250L280 260L294 260L294 271L106 271L106 260L120 260L120 250L132 250L132 240L142 240Z' },
    { c: PAL.red, o: 0.85, d: 'M94 22C104 16 112 28 124 22C118 32 106 36 94 38ZM306 22C316 16 324 28 336 22C330 32 318 36 306 38Z' },
    { c: PAL.green, o: 0.3, d: `${ground}L400 300L0 300Z` },
  ],
  lines: [ground, keep, towerL, towerR, gate, steps, flags],
  fine: [
    slits,
    'M74 84l14 0M100 120l14 0M70 180l14 0M96 210l14 0M286 90l14 0M312 130l14 0M290 196l14 0M318 214l14 0',
    'M132 120l14 0M256 112l14 0M132 200l14 0M254 190l14 0M182 104l14 0M216 108l14 0',
    'M78 30l-8 -2M78 36l-9 2M322 30l8 -2', // flapping
    hatch(12, 284, 388, 288, 12, 6, 165, 4),
    tufts([[30, 272], [70, 272], [330, 272], [374, 272]], 9, 5),
  ],
  parts: [place(ilsebill({ mood: 'proud', arms: I_ARMS.wide, head: 'hair', apron: false }), I)],
});
