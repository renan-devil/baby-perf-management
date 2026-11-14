import { PAL, hatch } from '../lib.mjs';
import { compose, dot, place, thumbelina } from './characters.mjs';

// Thumbelina, 5: snow is falling on a bare field. Thumbelina, wrapped in a dry leaf, knocks at the
// little door of the field mouse's house.
const f = (n) => Math.round(n * 10) / 10;
/** A big six-armed snowflake with little side branches. */
function flake(cx, cy, r, turn = 0) {
  let d = '';
  for (let i = 0; i < 6; i++) {
    const a = ((i * 60 + turn) * Math.PI) / 180;
    const [ex, ey] = [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    d += `M${f(cx)} ${f(cy)}L${f(ex)} ${f(ey)}`;
    const [mx, my] = [cx + Math.cos(a) * r * 0.55, cy + Math.sin(a) * r * 0.55];
    for (const s of [-1, 1]) {
      const b = a + (s * 40 * Math.PI) / 180;
      d += `M${f(mx)} ${f(my)}l${f(Math.cos(b) * r * 0.35)} ${f(Math.sin(b) * r * 0.35)}`;
    }
  }
  return d;
}
const ground = 'M0 254C80 250 160 256 240 254C300 252 360 255 400 253';
const mound = 'M196 254C200 190 236 104 300 98C358 96 394 150 400 176';
const snowCap = 'M216 162C230 124 262 102 300 100C346 98 380 130 396 166C380 156 362 154 346 160C330 148 310 146 296 154C276 142 254 146 242 156C232 154 224 156 216 162Z';
const door = 'M228 254L228 194C228 158 298 158 298 194L298 254';
const planks = 'M246 164L246 254M263 160L263 254M280 164L280 254';
const stalks = 'M30 254l-2 -22M38 254l3 -18M120 255l-3 -20M128 255l2 -16M352 254l-2 -18M20 254l6 -14M150 256l4 -16';
const flakes = [flake(60, 70, 22, 10), flake(150, 40, 16, 30), flake(340, 60, 20, 0), flake(100, 170, 12, 20), flake(250, 70, 13, 5), flake(30, 200, 10, 15), flake(380, 110, 10, 25)];
const knock = 'M222 152q-6 -6 -6 -14M214 160q-10 -4 -14 -12';
const ARMS = [
  [[-12, -62, 6], [-12, -50, 5.5], [-8, -42, 5], [-2, -40, 5]],
  [[12, -62, 6], [24, -62, 5.5], [34, -66, 5], [42, -68, 5]],
];

export default compose({
  title: 'Knocking at the field mouse’s door',
  seed: 105,
  washes: [
    { c: PAL.sky, o: 0.22, d: 'M0 254C80 250 160 256 240 254C300 252 360 255 400 253L400 296C300 300 100 300 0 296Z' },
    { c: PAL.terracotta, o: 0.45, d: `${mound}L400 254Z` },
    { c: PAL.ochre, o: 0.35, d: `${mound}L400 254Z` },
    { c: PAL.terracotta, o: 0.8, d: `${door}Z` },
    { c: PAL.sky, o: 0.35, d: flakes.map((d, i) => dot(...[[60, 70], [150, 40], [340, 60], [100, 170], [250, 70], [30, 200], [380, 110]][i], [16, 11, 14, 8, 9, 7, 7][i])).join('') },
  ],
  whites: snowCap,
  lines: [ground, mound, door],
  fine: [
    snowCap,
    planks,
    stalks,
    knock,
    dot(288, 212, 3),
    ...flakes,
    hatch(20, 272, 380, 272, 10, 7, 175, 8),
  ],
  parts: [place(thumbelina({ arms: ARMS, mood: 'peep', leaf: true }), 'translate(176 254) scale(1.32)')],
});
