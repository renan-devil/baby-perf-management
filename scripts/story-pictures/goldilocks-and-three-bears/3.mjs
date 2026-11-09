import { PAL, hatch, rays, transformPath } from '../lib.mjs';
import { compose, goldiSitting, place } from './characters.mjs';

// Goldilocks and the Three Bears, 3: CRACK! The tiny little chair breaks into pieces and Goldilocks
// lands on the floor with a bump, while the great big chair and the middle-sized one look on.
const floor = 'M0 258C100 255 200 260 300 257C340 256 370 258 400 257';

// A chair seen from the front: back panel with slats, a seat in perspective, four legs.
const chair = (x, w, seatY, backTop, slats = 3) => {
  const back = `M${x} ${seatY}L${x} ${backTop + 6}C${x} ${backTop - 4} ${x + w} ${backTop - 4} ${x + w} ${backTop + 6}L${x + w} ${seatY}`;
  let slat = `M${x} ${backTop + 14}L${x + w} ${backTop + 14}`;
  for (let i = 1; i <= slats; i++) slat += `M${x + (w * i) / (slats + 1)} ${backTop + 14}L${x + (w * i) / (slats + 1)} ${seatY}`;
  const seat = `M${x} ${seatY}L${x + w} ${seatY}L${x + w + 9} ${seatY + 12}L${x - 9} ${seatY + 12}Z`;
  const edge = `M${x - 9} ${seatY + 12}L${x - 9} ${seatY + 17}L${x + w + 9} ${seatY + 17}L${x + w + 9} ${seatY + 12}`;
  const legs = `M${x - 5} ${seatY + 17}L${x - 7} 258M${x + w + 5} ${seatY + 17}L${x + w + 7} 258M${x + 3} ${seatY + 6}L${x + 3} 248M${x + w - 3} ${seatY + 6}L${x + w - 3} 248`;
  const fill = `${back}Z${seat}M${x - 9} ${seatY + 12}L${x - 9} ${seatY + 17}L${x + w + 9} ${seatY + 17}L${x + w + 9} ${seatY + 12}Z`;
  return { lines: [back, seat, edge, legs], fine: [slat], fill, legFill: `M${x - 6} ${seatY + 17}L${x - 3} ${seatY + 17}L${x - 4} 258L${x - 8} 258ZM${x + w + 3} ${seatY + 17}L${x + w + 6} ${seatY + 17}L${x + w + 8} 258L${x + w + 4} 258Z` };
};
const big = chair(314, 66, 172, 62, 3);
const mid = chair(232, 48, 196, 128, 2);
const cushion = 'M226 198C222 188 240 184 256 186C272 184 290 188 286 198C280 206 236 206 226 198Z';
const cushionMarks = 'M256 190l0 6M240 194q16 6 32 0';

// The pieces of the tiny little chair (painted green): back, broken seat, legs flying off.
const backPiece = 'M8 0L46 0L46 -34C46 -44 8 -44 8 -34ZM8 -28L46 -28M21 -28L21 0M33 -28L33 0M10 0L10 12M44 0L44 12';
const BT = 'translate(20 246) rotate(-24)';
const seatL = 'M60 252L100 240L102 246L62 258Z';
const seatR = 'M150 250L178 242L190 252L156 256Z';
const legA = 'M64 120L80 96L84 99L68 123Z';
const legB = 'M204 214L226 226L224 230L202 218Z';
const legC = 'M180 254L208 256L208 260L180 258Z';
const motion = 'M86 128l10 4M90 118l10 2M196 202l-6 -8M208 200l-2 -9';
const splinters = 'M100 240l6 -4l-2 6l6 -2M150 250l-5 -5l1 6l-5 -3';

const crack = rays(62, 236, 14, 32, 7, 4, 120) + rays(196, 236, 14, 32, 7, 7, -60);
const bumps = 'M86 268q10 6 20 0M92 276q10 5 20 0M134 268q8 5 16 0';
const stars = 'M140 104l4 -9l4 9l9 1l-7 6l3 9l-9 -5l-8 5l3 -9l-7 -6Z';

export default compose({
  title: 'Crack!',
  seed: 83,
  washes: [
    { c: PAL.ochre, o: 0.32, d: 'M0 254C100 251 200 256 300 253C340 252 370 254 400 253L400 294C300 296 100 295 0 294Z' },
    { c: PAL.terracotta, o: 0.6, d: big.fill + big.legFill },
    { c: PAL.ochre, o: 0.5, d: big.fill + big.legFill },
    { c: PAL.ochre, o: 0.6, d: mid.fill + mid.legFill },
    { c: PAL.rose, o: 0.75, d: cushion },
    { c: PAL.green, o: 0.75, d: transformPath(backPiece, BT) + seatL + seatR + legA + legB + legC },
  ],
  lines: [floor, ...big.lines, ...mid.lines, cushion, transformPath(backPiece, BT), seatL, seatR, legA, legB, legC],
  fine: [...big.fine, ...mid.fine, cushionMarks, motion, splinters, crack, bumps, stars, hatch(220, 276, 390, 278, 7, 8, 172, 4), hatch(10, 286, 200, 288, 6, 8, 172, 9)],
  parts: [place(goldiSitting({ mood: 'surprised', tilt: -10 }), 'translate(112 252) scale(1.45)')],
});
