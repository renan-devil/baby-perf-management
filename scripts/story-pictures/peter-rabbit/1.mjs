import { PAL, hatch, tufts } from '../lib.mjs';
import { compose, place, peter } from './characters.mjs';

// The Tale of Peter Rabbit, 1 (cover): Peter, in his little blue jacket with brass buttons, squeezes
// flat on his tummy under the wooden gate of Mr McGregor's garden. Garden greens peep over the wall.
const ground = 'M0 258C80 255 170 260 250 257C320 255 360 258 400 256';

// The brick wall on either side, and its gate posts with round caps
const wallL = 'M0 110L72 108M72 108L72 257';
const wallR = 'M328 108L400 110M328 108L328 256';
const bricks =
  'M0 132L72 132M0 156L72 156M0 180L72 180M0 204L72 204M0 228L72 228M24 110L24 132M54 132L54 156M20 156L20 180M48 180L48 204M28 204L28 228M58 228L58 256' +
  'M328 132L400 132M328 156L400 156M328 180L400 180M328 204L400 204M328 228L400 228M352 110L352 132M382 132L382 156M346 156L346 180M376 180L376 204M356 204L356 228M386 228L386 256';
const posts = 'M72 257L72 76L92 76L92 258M308 258L308 76L328 76L328 256M70 76C70 64 94 64 94 76M306 76C306 64 330 64 330 76';

// The gate: pointed slats on two rails, with a gap underneath
const slatXs = [98, 124, 150, 176, 202, 228, 254, 280];
const slats = slatXs.map((x) => `M${x} 180L${x} 100L${x + 8} 90L${x + 16} 100L${x + 16} 180`).join('');
const rails = 'M92 106L308 106M92 118L308 118M92 164L308 164M92 176L308 176';
const grain = 'M106 128l0 14M134 138l0 12M160 124l0 10M212 130l0 14M238 140l0 10M264 126l0 12M290 136l0 10';
const hinges = 'M92 112L84 112M92 170L84 170';
const slatWash = slatXs.map((x) => `M${x} 180L${x} 100L${x + 8} 90L${x + 16} 100L${x + 16} 180Z`).join('');

// Garden leaves peeping over the wall
const leavesL = 'M6 110C2 92 14 84 22 96C24 80 40 78 42 94C48 84 62 88 58 108';
const leavesR = 'M340 108C334 90 348 82 356 96C360 80 378 80 378 96C386 86 400 92 398 110';
const veins = 'M22 96l2 12M42 94l-2 14M356 96l2 12M378 96l-2 13';

// Squeezing: strain marks over his back and a puff of dust from his back foot
const strain = 'M128 186l-7 -5M140 182l-3 -7';
const dust = 'M104 254C97 254 95 247 101 245C101 238 110 238 111 244C116 243 118 250 113 252Z';

export default compose({
  title: 'Peter squeezes under the garden gate',
  seed: 81,
  washes: [
    { c: PAL.green, o: 0.34, d: 'M0 254C80 251 170 256 250 253C320 251 360 254 400 252L400 300L0 300Z' },
    { c: PAL.terracotta, o: 0.5, d: 'M0 110L72 108L72 257L0 258ZM328 108L400 110L400 256L328 256Z' },
    { c: PAL.ochre, o: 0.55, d: 'M72 257L72 76L92 76L92 258ZM308 258L308 76L328 76L328 256ZM70 76C70 64 94 64 94 76ZM306 76C306 64 330 64 330 76Z' },
    { c: PAL.ochre, o: 0.5, d: slatWash },
    { c: PAL.terracotta, o: 0.3, d: 'M92 106L308 106L308 118L92 118ZM92 164L308 164L308 176L92 176Z' },
    { c: PAL.green, o: 0.75, d: `${leavesL}Z${leavesR}Z` },
    { c: PAL.grey, o: 0.3, d: dust },
  ],
  lines: [ground, wallL, wallR, posts, slats, rails, leavesL, leavesR],
  fine: [
    bricks,
    grain,
    hinges,
    veins,
    strain,
    dust,
    hatch(10, 274, 390, 276, 12, 7, 165, 4),
    tufts([[20, 258], [112, 257], [300, 257], [360, 256], [388, 256]], 9, 6),
  ],
  parts: [place(peter({ pose: 'crawl', mood: 'happy', ears: -50 }), 'translate(198 219) scale(1.6)')],
});
