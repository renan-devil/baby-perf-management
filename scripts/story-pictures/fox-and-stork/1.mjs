import { PAL, hatch, rays, transformPath, tufts } from '../lib.mjs';
import { compose, foxLapping, place, plate, stork } from './characters.mjs';

// The Fox and the Stork, 1 (cover): dinner at Fox's house. Fox laps his soup from a flat plate,
// slurp, slurp, while Stork, across the little table, can only tap her plate with the tip of her
// long beak.
const ground = 'M0 272C80 268 180 274 280 270C330 268 370 271 400 269';
const table = 'M150 198C190 196 250 196 296 198M151 205C190 203 250 203 294 205M150 198L151 205M296 198L294 205M162 205L160 270M280 205L282 270M168 205L166 270M274 205L276 270';
const moon = 'M66 26C52 30 44 44 48 58C52 72 66 80 80 76C68 72 60 62 60 50C60 40 62 32 66 26Z';
const star = (x, y) => `M${x - 4} ${y}L${x + 4} ${y}M${x} ${y - 4}L${x} ${y + 4}`;
// slurp! little curls above Fox's busy tongue, and tap tap strokes at Stork's beak tip
const slurp = 'M170 170c-4 -4 -3 -10 2 -12M180 166c-2 -5 0 -10 5 -11M190 168c0 -5 3 -9 8 -9';
const tap = rays(229, 183, 6, 13, 5, 7, 200);
const STORK = 'translate(324 272) scale(-0.95 0.95)';
// a worried brow: not one drop goes in
const brow = transformPath('M57 -176L68 -181', STORK);

export default compose({
  title: 'The Fox and the Stork',
  seed: 71,
  washes: [
    { c: PAL.ochre, o: 0.7, d: moon },
    { c: PAL.green, o: 0.38, d: 'M0 268C80 264 180 270 280 266C330 264 370 267 400 265L400 300L0 300Z' },
    { c: PAL.ochre, o: 0.55, d: 'M150 198C190 196 250 196 296 198L294 205C250 203 190 203 151 205ZM160 205L168 205L166 270L160 270ZM274 205L282 205L282 270L276 270Z' },
  ],
  lines: [ground, table, moon],
  fine: [brow, star(110, 40), star(150, 70), star(340, 36), star(296, 80), slurp, tap, hatch(20, 284, 380, 286, 14, 6, 160, 6), tufts([[30, 271], [110, 272], [210, 272], [380, 270]], 9, 8)],
  parts: [
    place(plate(184, 191), ''),
    place(plate(231, 191), ''),
    place(foxLapping(), 'translate(92 272)'),
    place(stork(), STORK),
  ],
});
