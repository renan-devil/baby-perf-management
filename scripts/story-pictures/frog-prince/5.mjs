import { PAL, hatch } from '../lib.mjs';
import { compose, dot, frog, limb, place } from './characters.mjs';

// The Frog Prince, 5: in the evening, plip, plop, the wet little frog has climbed the castle stairs and
// knocks at the big castle door (knock, knock, knock!), leaving a trail of wet footprints behind him.
// The stone wall, the arched oak door with iron hinges and a ring, and the landing at the top of the steps
const wall = 'M10 230L10 30M390 230L390 30';
const door = 'M110 236L110 108C110 50 230 50 230 108L230 236';
const planks = 'M145 236L145 66M180 236L180 58M210 236L210 72';
const hinges = 'M110 128L160 128M110 200L160 200M164 128l0 0';
const ring = dot(196, 160, 7);
const landing = 'M0 236L400 236M0 236L0 244L400 244';
const steps = 'M262 244L262 258L400 258M300 258L300 272L400 272M340 272L340 286L400 286';
const stones = 'M30 60L80 60M50 60L50 90M24 90L90 90M70 90L70 120M30 120L92 120M44 120L44 150M20 150L92 150M60 150L60 180M28 180L94 180M42 180L42 210M260 70L330 70M300 70L300 100M250 100L360 100M330 100L330 130M260 130L370 130M280 130L280 160M250 160L360 160M320 160L320 190M260 190L370 190M290 190L290 222';

// wet three-toed footprints coming up the steps
const print = (x, y, s = 1) => `M${x} ${y}l${-3 * s} ${-4 * s}M${x} ${y}l0 ${-5 * s}M${x} ${y}l${3 * s} ${-4 * s}`;
const prints = print(384, 282, 1.6) + print(360, 268, 1.6) + print(330, 254, 1.6);
const puddles = dot(384, 283, 4) + dot(360, 269, 4) + dot(330, 255, 4) + 'M250 238C256 232 300 232 312 238Z';

// the frog on the doormat (bottom centre 0,0), reaching up to knock with his little fist
const F = 'translate(282 234) scale(1.6)';
const knockArm = limb([[-21, -22, 6], [-30, -30, 5], [-36, -42, 4.5]]);
const knocks = 'M-42 -52l-6 -5M-45 -43l-9 0M-43 -34l-6 4';
const drips = dot(-24, 8, 1.4) + dot(20, 10, 1.2) + dot(28, -20, 1.2);

export default compose({
  title: 'Knock, knock, knock!',
  seed: 55,
  washes: [
    { c: PAL.slate, o: 0.3, d: 'M10 30L390 30L390 236L10 236Z' },
    { c: PAL.terracotta, o: 0.7, d: 'M110 236L110 108C110 50 230 50 230 108L230 236Z' },
    { c: PAL.grey, o: 0.4, d: 'M0 236L400 236L400 300L0 300Z' },
    { c: PAL.red, o: 0.6, d: 'M240 236L324 236L318 230L246 230Z' },
    { c: PAL.sky, o: 0.8, d: puddles },
  ],
  lines: [wall, door, landing, steps],
  fine: [planks, stones, prints, hatch(260, 296, 396, 296, 6, 6, 160, 2)],
  once: `<path d="${hinges}"/><path d="${ring}"/>`,
  parts: [
    place(frog({ mood: 'happy', look: [-1.5, -1] }), F),
    place({ lines: [knockArm], fine: [knocks], washes: [{ c: PAL.green, o: 0.85, d: `${knockArm}Z` }] }, F),
    place({ fine: [drips], washes: [{ c: PAL.sky, o: 0.9, d: drips }] }, F),
  ],
});
