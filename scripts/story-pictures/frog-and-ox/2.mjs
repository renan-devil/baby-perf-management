import { PAL, tufts } from '../lib.mjs';
import { compose, frog, lilyPad, ox, place, puffedFrog } from './characters.mjs';

// The Frog and the Ox, 2: the little frog has puffed herself up as round as a balloon, cheeks bulging
// and eyes popping, while her two sisters watch, worried, from their lily pads. The ox, small, far off
// in the meadow.
const BIGT = 'translate(200 240) scale(1.75)';
const meadow = 'M0 150C80 146 160 150 240 146C300 143 360 146 400 144L400 300L0 300Z';
const horizon = 'M0 150C60 147 110 148 146 148.5M254 146.5C270 145.5 288 144.5 296 144.5M362 145C380 144.5 392 144 400 144';
const pond = 'M10 232C14 196 100 184 200 184C300 184 388 196 392 232C396 270 320 292 200 292C80 292 6 270 10 232Z';
// the pond's edge, left open where the puffed-up frog sits in front of it
const pondEdge = 'M146 186C80 189 14 204 10 232C6 270 80 292 200 292C320 292 396 270 392 232C388 202 320 188 254 185.5';
const ripples = 'M40 268c8 -3 16 -3 24 0M330 274c8 -3 16 -3 24 0M120 286c6 -2 12 -2 18 0M282 200c6 -2 12 -2 18 0';
// puff marks all round her
const puff = [-150, -122, -95, -68, -40, 25, 155]
  .map((a) => [Math.cos((a * Math.PI) / 180), Math.sin((a * Math.PI) / 180)])
  .map(([c, si]) => `M${Math.round(200 + c * 70)} ${Math.round(180 + si * 70)}L${Math.round(200 + c * 84)} ${Math.round(180 + si * 84)}`)
  .join('');

export default compose({
  title: 'The Frog and the Ox',
  seed: 319,
  washes: [
    { c: PAL.green, o: 0.36, d: meadow },
    { c: PAL.sky, o: 0.55, d: pond },
  ],
  lines: [horizon, pondEdge],
  fine: [ripples, puff, tufts([[20, 150], [130, 150], [380, 146], [16, 290], [388, 288]], 9, 7)],
  parts: [
    place(ox(), 'translate(330 152) scale(0.32)'),
    place(lilyPad(110), 'translate(200 242)'),
    place(lilyPad(60), 'translate(72 248)'),
    place(lilyPad(60), 'translate(330 254)'),
    place(puffedFrog(), BIGT),
    place(frog({ mood: 'worried', look: [1.4, -0.6], flowered: false }), 'translate(70 248) scale(1.05)'),
    place(frog({ mood: 'worried', look: [-1.4, -0.6], flowered: false }), 'translate(332 254) scale(0.95)'),
  ],
});
