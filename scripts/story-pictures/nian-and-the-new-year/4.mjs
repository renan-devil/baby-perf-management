import { PAL, hatch, rays } from '../lib.mjs';
import { at, compose, house, lantern, nian, place } from './characters.mjs';

// Nian and the First New Year, 4: the bamboo in the fire goes crack! bang! by the red door and the
// red lantern, and Nian, eyes wide and mouth open, leaps off the ground and runs away to the
// right, back to his mountains, looking back over his shoulder.
const ground = 'M0 272C80 270 180 272 260 272C320 272 370 270 400 272';

// the fire: two logs, flames, and bamboo sticks bursting with a bang
const logs = 'M118 272L186 258M120 258L184 272';
const flames = 'M128 262C122 246 134 236 136 222C142 234 146 228 150 214C156 230 166 236 164 248C170 244 172 254 170 262Z';
const inner = 'M138 262C136 252 144 246 146 238C150 246 156 250 156 262Z';
const bamboo = 'M140 250L118 214M160 250L188 220M150 250L152 208';
const nodes = 'M131 236l5 -3M124 224l5 -3M170 236l5 3M180 226l5 3M148 230l6 0M149 218l6 0';
const B = [152, 196];
const burst = (() => {
  const n = 9;
  let d = '';
  for (let i = 0; i <= 2 * n; i++) {
    const a = (i / (2 * n)) * 2 * Math.PI - Math.PI / 2;
    const r = i % 2 ? 12 : 26 + (i % 4 ? 0 : 6);
    d += `${i ? 'L' : 'M'}${Math.round((B[0] + Math.cos(a) * r) * 10) / 10} ${Math.round((B[1] + Math.sin(a) * r) * 10) / 10}`;
  }
  return `${d}Z`;
})();

const NT = 'translate(292 236) rotate(-10) scale(0.82)';
const [hx, hy] = at(NT, 70, -88);
// speed lines behind him
const speed = 'M196 182l-26 -2M200 204l-30 0M196 226l-24 2';

export default compose({
  title: 'Crack! Bang!',
  seed: 247,
  washes: [
    { c: PAL.slate, o: 0.2, d: 'M0 0L400 0L400 84C300 74 200 90 0 72Z' },
    { c: PAL.grey, o: 0.35, d: `${ground}L400 300L0 300Z` },
    { c: PAL.ochre, o: 0.85, d: burst },
    { c: PAL.ochre, o: 0.4, d: 'M100 272C96 220 120 196 152 196C186 196 206 222 202 272Z' },
    { c: PAL.red, o: 0.8, d: flames },
    { c: PAL.ochre, o: 0.9, d: inner },
    { c: PAL.green, o: 0.55, d: 'M138 252L116 216L120 213L142 248ZM158 248L186 218L190 222L162 252ZM148 250L150 208L154 208L154 250Z' },
  ],
  lines: [ground, burst, flames, logs, bamboo],
  fine: [
    nodes,
    inner,
    rays(B[0], B[1], 34, 46, 10, 7),
    'M96 186l-8 -4M100 168l-6 -8M206 168l6 -8M110 154l-2 -6',
    speed,
    rays(hx, hy, 50, 60, 7, 9, 200),
    hatch(220, 288, 390, 288, 7, 7, 168, 9),
  ],
  parts: [
    place(house({ w: 150, h: 120, red: true, door: 16 }), 'translate(-14 272)'),
    place(lantern(15), 'translate(84 154)'),
    place(nian({ mood: 'startled', look: [-3.5, -0.5], legs: 'leap' }), NT),
  ],
});
