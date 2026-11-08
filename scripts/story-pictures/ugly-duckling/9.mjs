import { PAL, hatch, rng, transformPath, tufts } from '../lib.mjs';
import { compose, flyingCut, flyingSwan, place } from './characters.mjs';

// The Ugly Duckling, 9: spring has come. The duckling, now big and strong, spreads his wings and
// flies over the green fields towards a garden with a lake and apple trees in blossom.
const ST = 'translate(150 104) rotate(-6) scale(1.08)';
const hills = 'M0 196C60 180 120 186 180 196C230 204 260 200 290 192M0 236C80 226 160 232 220 244';
const furrows = 'M20 212C60 206 100 208 140 214M30 224C70 218 110 220 150 226M190 214C210 216 230 216 250 212M200 226C220 228 240 228 256 224';
// the garden: a lake under two apple trees in blossom
const lake = 'M248 258C248 240 310 232 360 236C392 238 404 248 400 258C396 272 340 280 300 280C264 280 248 272 248 258Z';
const trunks = 'M300 224L302 176M302 196L290 184M302 190L314 180M362 230L364 170M364 192L352 180M364 186L378 174';
const crown = (cx, cy, r) => `M${cx - r} ${cy}C${cx - r} ${cy - r * 1.2} ${cx + r} ${cy - r * 1.2} ${cx + r} ${cy}C${cx + r + 6} ${cy + r * 0.8} ${cx - r - 6} ${cy + r * 0.8} ${cx - r} ${cy}Z`;
const crowns = crown(302, 160, 30) + crown(364, 152, 32);
const blossoms = (() => {
  const r = rng(9);
  let d = '';
  for (const [cx, cy, R] of [[302, 160, 30], [364, 152, 32]]) {
    for (let i = 0; i < 14; i++) {
      const a = r() * Math.PI * 2;
      const k = Math.sqrt(r()) * R * 0.9;
      const [x, y] = [cx + Math.cos(a) * k, cy + Math.sin(a) * k * 0.75];
      d += `M${(x - 3).toFixed(1)} ${y.toFixed(1)}a3 3 0 1 0 6 0a3 3 0 1 0 -6 0Z`;
    }
  }
  return d;
})();
const sun = 'M40 46C40 30 64 30 64 46C64 62 40 62 40 46Z';

export default compose({
  title: 'Flying over the spring fields',
  seed: 79,
  washes: [
    { c: PAL.sky, o: 0.22, rule: 'evenodd', d: `M0 0L400 0L400 190C300 186 200 200 0 196Z${transformPath(flyingCut, ST)}` },
    { c: PAL.green, o: 0.5, d: 'M0 196C60 180 120 186 180 196C230 204 260 200 290 192C330 186 370 190 400 196L400 300L0 300Z' },
    { c: PAL.green, o: 0.3, d: 'M0 236C80 226 160 232 220 244C240 260 246 280 240 300L0 300Z' },
    { c: PAL.ochre, o: 0.4, d: 'M188 210C220 206 250 206 262 210L262 232C240 236 210 236 186 232Z' },
    { c: PAL.sky, o: 0.6, d: lake },
    { c: PAL.green, o: 0.35, d: crowns },
    { c: PAL.rose, o: 0.45, d: crowns },
    { c: PAL.terracotta, o: 0.6, d: 'M298 224L298 176L305 176L304 224ZM360 230L360 170L367 170L366 230Z' },
    { c: PAL.rose, o: 0.9, d: blossoms },
    { c: PAL.ochre, o: 0.6, d: sun },
  ],
  lines: [hills, lake, crowns, trunks],
  fine: [
    furrows,
    sun,
    'M270 252C290 250 320 250 340 254M300 266C320 268 350 266 370 262',
    hatch(20, 270, 220, 276, 8, 8, 172, 5),
    tufts([[40, 196], [130, 190], [226, 248], [390, 252]], 9, 3),
  ],
  parts: [place(flyingSwan({ grey: true }), ST)],
});
