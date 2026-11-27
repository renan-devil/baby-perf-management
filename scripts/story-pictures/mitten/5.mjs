import { PAL, hatch } from '../lib.mjs';
import { bear, beetle, boarHead, compose, dog, fox, frog, hare, limb, limbFill, mitten, mouse, place } from './characters.mjs';

// The Mitten, 5: the tiny Beetle climbs in and POP! The mitten bursts open along the top and everybody
// tumbles out into the snow, rolling and laughing (the Boar and the Wolf are still wriggling out),
// while Grandfather's little dog comes running back along the path.
const k = 1.15;
const [mx, my] = [190, 258];
const MT = `translate(${mx} ${my}) scale(${k})`;

// the burst: a jagged tear across the top of the mitten, dark inside, with loose curly ends of wool
const tear = 'M142 172L152 164L160 170L170 160L180 168L190 158L200 166L210 158L218 168L230 164L234 174L222 180L210 176L200 182L188 176L176 182L164 176L152 182Z';
const yarn = 'M152 164C146 154 154 148 150 140M230 164C238 156 234 148 242 144';
// POP: rays shooting out all round the top, and scraps of red wool flying
const burst = [-176, -158, -140, -122, -104, -76, -58, -40, -22, -4]
  .map((deg) => {
    const a = (deg * Math.PI) / 180;
    const [c, s] = [Math.cos(a), Math.sin(a)];
    return `M${Math.round(190 + c * 70)} ${Math.round(170 + s * 52)}L${Math.round(190 + c * 92)} ${Math.round(170 + s * 70)}`;
  })
  .join('');
const scraps = 'M128 136l6 -3l2 5l-6 2ZM252 132l6 1l-1 6l-6 -2ZM164 112l5 -4l3 5l-5 3ZM230 104l6 2l-2 5l-5 -2Z';
// Grey Wolf's bushy tail, still sticking out of the tear
const wTail = [[160, 172, 9], [148, 156, 11], [136, 148, 8]];
const shade = 'M60 270C110 256 280 256 380 270C280 284 120 286 60 270Z';
const puffs = 'M110 262q5 -8 12 -3q4 -7 11 -2M238 262q5 -8 12 -3q4 -7 11 -2M36 280q5 -7 11 -2';
// tumbling marks round the flying animals
const marks = 'M56 112q-8 4 -10 12M60 128q-6 4 -7 10M176 60q-6 6 -6 14M322 50q6 4 8 12M336 60q4 4 4 10M250 22q-6 -2 -10 2M92 130q-6 4 -6 12';
const flakes = [[24, 36], [130, 30], [380, 26], [370, 170], [20, 170]].map(([x, y]) => `M${x - 2} ${y}l4 0M${x} ${y - 2}l0 4`).join('');

export default compose({
  title: 'POP!',
  seed: 65,
  washes: [
    { c: PAL.sky, o: 0.3, d: shade },
    { c: PAL.red, o: 0.8, d: scraps },
    { c: PAL.grey, o: 0.7, d: limbFill(wTail) },
    { c: PAL.slate, o: 0.4, d: limbFill(wTail) },
  ],
  after: [{ c: PAL.ink, o: 0.7, d: tear }],
  lines: [tear, limb(wTail), burst, scraps],
  fine: [yarn, puffs, marks, hatch(30, 290, 120, 292, 4, 6, 170, 4), hatch(260, 292, 340, 290, 4, 6, 170, 6)],
  once: flakes,
  parts: [
    place(mitten({ fat: 0.7, seed: 11 }), MT),
    place(boarHead(), 'translate(204 166) rotate(-24) scale(1.2)'),
    place(mouse(), 'translate(208 64) rotate(-32) scale(1.45)'),
    place(beetle(), 'translate(268 30) rotate(-40) scale(1.1)'),
    place(frog(), 'translate(112 106) scale(-1.25 1.25) rotate(-20)'),
    place(hare(), 'translate(300 112) rotate(-18) scale(0.95)'),
    place(fox(), 'translate(62 178) scale(-0.85 0.85) rotate(-22)'),
    place(bear({ mood: 'laugh' }), 'translate(362 228) rotate(-118) scale(0.72)'),
    place(dog({ run: true }), 'translate(52 290) scale(1.2)'),
  ],
});
