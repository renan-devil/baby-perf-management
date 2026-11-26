import { PAL, hatch, parseTransform, tufts } from '../lib.mjs';
import { beakTip, compose, dot, flyingGoose, place, tortoise } from './characters.mjs';

// The Talkative Tortoise, 4: over the village, two children look up, point and laugh. Up in the sky
// the tortoise opens her mouth to answer them, and lets go of the stick: whoops!
const apply = (t, [x, y]) => {
  const m = parseTransform(t);
  return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
};
const r1 = (n) => Math.round(n * 10) / 10;

// up in the sky: the geese and their stick, as in picture 3 but smaller and far away
const GA = 'translate(206 62) scale(0.55)';
const GB = 'translate(332 48) scale(0.55)';
const [ax, ay] = apply(GA, beakTip('down'));
const [bx, by] = apply(GB, beakTip('down'));
const along = (t, dy = 0) => [r1(ax + (bx - ax) * t), r1(ay + (by - ay) * t + dy)];
const P = (t, dy) => along(t, dy).join(' ');
const stick = `M${P(-0.04, -1.6)}C${P(0.3, -2.2)} ${P(0.7, -1.5)} ${P(1.04, -1.6)}L${P(1.04, 1.6)}C${P(0.7, 1.5)} ${P(0.3, 2.2)} ${P(-0.04, 1.6)}Z`;
const twig = `M${P(0.78, -1.5)}l4 -6`;

// the tortoise, just below the middle of the stick, mouth wide open, tumbling
const turn = -40;
const local = `rotate(${turn}) scale(0.62)`;
const [mx, my] = apply(local, [80, -28]);
const [sx, sy] = along(0.5);
const T = `translate(${r1(sx - mx)} ${r1(sy - my + 18)}) ${local}`;
const down = Math.round((Math.atan2(Math.cos((turn * Math.PI) / 180), Math.sin((turn * Math.PI) / 180)) * 180) / Math.PI);
const [tx, ty] = apply(T, [0, -24]);
const fall = `M${r1(tx - 30)} ${r1(ty - 34)}l0 -12M${r1(tx - 18)} ${r1(ty - 42)}l0 -10M${r1(tx + 28)} ${r1(ty - 30)}l0 -10`;

// a rooftop of the village, and the ground
const ground = 'M0 262C80 258 160 264 240 261C300 259 350 263 400 260';
const house = 'M292 262L292 214L352 214L352 262M282 218L322 186L362 218Z';
const houseMarks = 'M312 262L312 238L328 238L328 262M300 228l10 0l0 10l-10 0Z';

// the girl, seen from behind, pointing up (origin at her feet)
const G = 'translate(70 264) scale(1.05)';
const girl = {
  lines: [
    'M-4 -62C-12 -50 -18 -36 -20 -22L20 -22C18 -36 12 -50 4 -62Z',
    'M-6 -22L-7 -2M6 -22L7 -2',
    dot(0, -74, 13),
    'M6 -58C14 -70 22 -82 30 -96M10 -56C18 -68 26 -80 34 -94',
    'M-6 -58C-12 -50 -16 -42 -16 -34',
  ],
  fine: ['M-12 -78c-8 2 -10 10 -6 15M12 -78c8 2 10 10 6 15', 'M-11 -2l8 0M4 -2l8 0', 'M30 -96l1 -7M34 -94l2 -6'],
  washes: [
    { c: PAL.red, o: 0.7, d: 'M-4 -62C-12 -50 -18 -36 -20 -22L20 -22C18 -36 12 -50 4 -62Z' },
    { c: PAL.ochre, o: 0.75, d: dot(0, -74, 13) + 'M-12 -78c-8 2 -10 10 -6 15l3 -1c-3 -4 -1 -10 4 -12ZM12 -78c8 2 10 10 6 15l-3 -1c3 -4 1 -10 -4 -12Z' },
  ],
};
// the boy, side on, head thrown back laughing, holding his tummy
const B = 'translate(124 264) scale(1.05)';
const boy = {
  lines: [
    'M-14 -60C-16 -44 -16 -30 -14 -24L14 -24C16 -30 16 -44 12 -60C4 -64 -6 -64 -14 -60Z',
    'M-8 -24L-8 -2M8 -24L8 -2',
    dot(2, -76, 13),
    'M-10 -54C-4 -44 2 -40 10 -42',
  ],
  fine: ['M-11 -76C-12 -86 -4 -90 4 -89C10 -88 14 -85 14 -83C6 -85 0 -82 -4 -76', 'M5 -81q3 -3 6 0', 'M10 -71C14 -70 17 -73 18 -76C15 -76 12 -74 10 -71Z', 'M-14 -2l8 0M2 -2l8 0', 'M20 -84l6 -4M22 -76l7 0M20 -68l6 3'],
  washes: [
    { c: PAL.sky, o: 0.75, d: 'M-14 -60C-16 -44 -16 -30 -14 -24L14 -24C16 -30 16 -44 12 -60C4 -64 -6 -64 -14 -60Z' },
    { c: PAL.slate, o: 0.5, d: 'M-11 -24L-11 -2L-5 -2L-5 -24ZM5 -24L5 -2L11 -2L11 -24Z' },
    { c: PAL.ochre, o: 0.45, d: dot(2, -76, 13) },
    { c: PAL.terracotta, o: 0.8, d: 'M-11 -76C-12 -86 -4 -90 4 -89C10 -88 14 -85 14 -83C6 -85 0 -82 -4 -76Z' },
    { c: PAL.rose, o: 0.7, d: dot(4, -72, 3) },
  ],
};

export default compose({
  title: 'Look! A flying tortoise!',
  seed: 47,
  washes: [
    { c: PAL.green, o: 0.32, d: 'M0 258C80 254 160 260 240 257C300 255 350 259 400 256L400 300L0 300Z' },
    { c: PAL.ochre, o: 0.4, d: 'M292 262L292 216L352 216L352 262Z' },
    { c: PAL.terracotta, o: 0.7, d: 'M282 218L322 186L362 218Z' },
    { c: PAL.sky, o: 0.22, d: 'M40 70C46 56 72 52 84 62C96 52 122 56 122 72C124 86 96 90 84 84C64 92 42 86 40 70Z' },
    { c: PAL.ochre, o: 0.7, d: stick },
  ],
  lines: [ground, house, stick],
  fine: [houseMarks, twig, fall, hatch(20, 284, 380, 286, 10, 6, 160, 5), tufts([[180, 262], [240, 261], [384, 260]], 8, 9)],
  parts: [
    place(flyingGoose({ neck: 'down' }), GA),
    place(flyingGoose({ neck: 'down' }), GB),
    place(tortoise({ mouth: 'open', legs: 'dangle', down }), T),
    place(girl, G),
    place(boy, B),
  ],
});
