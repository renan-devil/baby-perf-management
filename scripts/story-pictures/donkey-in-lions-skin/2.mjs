import { PAL, tufts } from '../lib.mjs';
import { at, compose, donkey, fox, place } from './characters.mjs';

// The Donkey in the Lion's Skin, 2: wearing the lion skin, the donkey lifts his head and opens his
// mouth as wide as he can for a big scary roar, and out comes "HEE-HAW!" (sound lines); his long grey
// ears poke out from under the golden mane. The fox sees through it and laughs.
const GROUND = 266;
const HEAD = -24;
const DONKT = `translate(132 ${GROUND}) scale(1.3)`;
const FOXT = `translate(340 ${GROUND - 5}) scale(1.15)`;
// the fox's laugh: little shaking marks round his head
const ha = 'M282 186l-7 -4M280 198l-8 0M286 174l-4 -6';
const ground = `M0 ${GROUND - 4}C90 ${GROUND - 8} 180 ${GROUND - 2} 260 ${GROUND - 6}C320 ${GROUND - 8} 370 ${GROUND - 4} 400 ${GROUND - 6}`;
// where his open mouth lands in the picture (donkey frame (100, -88), head turned up)
const [mx, my] = at(...at(100, -88, `rotate(${HEAD} 34 -70)`), DONKT);
const r1 = (n) => Math.round(n * 10) / 10;
/** An arc of the bray, radius r round the mouth, from angle a0 to a1 (degrees, 0 = right, - = up). */
const arc = (r, a0, a1) => {
  const p = (a) => [r1(mx + Math.cos((a * Math.PI) / 180) * r), r1(my + Math.sin((a * Math.PI) / 180) * r)];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  return `M${x0} ${y0}A${r} ${r} 0 0 1 ${x1} ${y1}`;
};
const bray = [arc(22, -70, 10), arc(40, -66, 6), arc(58, -62, 2)].join('');
// short zigzag "wobble" lines for the loud HEE-HAW
const zig = (x, y) => `M${r1(x)} ${r1(y)}l6 -6l4 7l6 -7l4 7l6 -6`;
const zigs = zig(mx + 72, my - 58) + zig(mx + 82, my - 22);

export default compose({
  title: "The Donkey in the Lion's Skin",
  seed: 2213,
  washes: [{ c: PAL.green, o: 0.34, d: `${ground}L400 300L0 300Z` }],
  lines: [ground, bray],
  fine: [zigs, ha, tufts([[20, GROUND - 5], [270, GROUND - 6], [390, GROUND - 6], [70, 292], [300, 290]], 10, 9)],
  parts: [place(donkey({ mood: 'bray', headTurn: HEAD, skin: true }), DONKT), place(fox(), FOXT)],
});
