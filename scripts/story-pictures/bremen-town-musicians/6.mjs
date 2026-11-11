import { PAL, hatch, rays } from '../lib.mjs';
import { compose, dot, place, rooster } from './characters.mjs';

// The Bremen Town Musicians, 6: night in the big dark forest. From the very top of a tall tree the
// Rooster sees a little light shining far away between the trees.
const moon = 'M48 46C48 34 58 26 68 26C60 32 58 40 60 48C62 58 70 64 80 64C74 70 66 72 60 70C52 68 48 58 48 46Z';
const light = 'M318 214L332 214L332 226L318 226Z';
const glow = dot(325, 220, 22);
const trunk = 'M232 300C236 260 232 220 240 170M262 300C256 260 262 220 254 170M224 300C238 292 256 292 270 300';
const crown =
  'M196 176C176 168 178 140 198 136C196 112 222 100 238 112C246 94 274 98 278 118C298 116 310 138 296 152C312 164 302 188 282 186C272 204 244 206 234 192C216 202 194 194 196 176Z';
const twig = 'M246 106L246 96';
// far away, small dark pines between the tree and the light
const pine = (x, y, s) => `M${x} ${y}L${x - 9 * s} ${y}L${x} ${y - 26 * s}L${x + 9 * s} ${y}Z`;
const pines = [pine(296, 232, 1), pine(312, 236, 0.8), pine(348, 234, 1.1), pine(366, 238, 0.8), pine(384, 232, 1), pine(20, 240, 0.9), pine(40, 236, 1.1), pine(150, 240, 1), pine(170, 236, 0.8)].join('');
const stars = 'M120 40l0 8M116 44l8 0M170 24l0 6M167 27l6 0M340 40l0 8M336 44l8 0M380 90l0 6M377 93l6 0M140 100l0 6M137 103l6 0M300 20l0 6M297 23l6 0';
// a dotted line of looking, from the Rooster's eye to the light
const look = 'M270 50L280 60M290 70L298 80M306 92L312 102M318 116L320 126M323 140L324 150M325 164L325 174M326 188L326 196';

export default compose({
  title: 'A little light far away',
  seed: 66,
  washes: [
    { c: PAL.slate, o: 0.62, d: `M0 0L400 0L400 300L0 300Z${glow}`, rule: 'evenodd' },
    { c: PAL.ink, o: 0.15, d: `M0 0L400 0L400 300L0 300Z${glow}${moon}`, rule: 'evenodd' },
    { c: PAL.ochre, o: 0.85, d: moon },
    { c: PAL.ochre, o: 0.55, d: glow },
    { c: PAL.ochre, o: 1, d: light },
    { c: PAL.ink, o: 0.55, d: pines },
    { c: PAL.ink, o: 0.35, d: 'M0 250C100 244 300 248 400 244L400 300L0 300Z' },
    { c: PAL.green, o: 0.85, d: crown },
    { c: PAL.ink, o: 0.25, d: crown },
    { c: PAL.ochre, o: 0.45, d: 'M234 300C238 260 234 220 242 170L252 170C260 220 254 260 260 300Z' },
  ],
  lines: [moon, trunk, crown, twig, light],
  fine: [pines, stars, rays(325, 220, 14, 26, 10, 3), 'M325 214L325 226M318 220L332 220', hatch(240, 200, 254, 290, 5, 7, 100, 5), 'M210 160c3 -5 8 -5 10 0M260 140c3 -5 8 -5 10 0M270 176c3 -5 8 -5 10 0'],
  once: '<path d="' + look + '"/>',
  parts: [place(rooster(), 'translate(244 98) scale(0.62)')],
});
