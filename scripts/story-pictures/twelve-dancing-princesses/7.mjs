import { PAL, hatch } from '../lib.mjs';
import { P_ARMS, R_ARMS, S_ARMS, at, boat, compose, ghost, merge, oval, place, prince, princess, soldier, sparkles, youngest } from './characters.mjs';

// Picture 7: on the shining lake, little boats each with a smiling prince at the oars. In the
// last boat, in front, the prince puffs and pants, for the youngest princess has an invisible
// passenger: the soldier, sitting right beside her.
const G = 232; // the front boat's gunwale
const s = 1.32;
const PR = `translate(272 ${G + 58 * s}) scale(${s})`;
const [ox, oy] = at(20, -68, PR);
const oar = `M${ox - 4} ${oy - 4}L${ox + 64} ${G + 40}`;
const blade = place({ lines: [oval(0, 0, 11, 4)] }, `translate(${ox + 68} ${G + 44}) rotate(36)`).lines[0];
const splash = `M${ox + 52} ${G + 50}q4 -8 10 -6M${ox + 78} ${G + 50}q4 -6 10 -2M${ox + 60} ${G + 58}q10 3 22 0`;
const sweat = [[250, 128], [298, 120], [302, 136]].map(([x, y]) => `M${x} ${y}c-2 3 -2 5 0 5c2 0 2 -2 0 -5Z`).join('');
const inv = ghost(place(soldier({ upper: true, arms: S_ARMS.knees }), `translate(124 ${G + 58 * s}) scale(${s})`));

// a little boat further away with its smiling prince and a princess
function farBoat(x, y, k, dress, hair, tunic) {
  return merge(
    place(princess({ who: 'sister', dress, hair, upper: true, arms: P_ARMS.hold }), `translate(${x - 14 * k} ${y + 52 * k}) scale(${k})`),
    place(prince({ tunic, upper: true, arms: R_ARMS.row, look: -1 }), `translate(${x + 18 * k} ${y + 60 * k}) scale(${k})`),
    place(boat(), `translate(${x} ${y}) scale(${k * 0.95})`),
    { fine: [`M${x + 30 * k} ${y - 10 * k}L${x + 76 * k} ${y + 22 * k}`] },
  );
}
const ripples = hatch(20, 196, 380, 196, 7, 16, 0, 11, 0.5) + hatch(20, 282, 380, 282, 8, 18, 0, 12, 0.5) + hatch(40, 168, 360, 168, 5, 14, 0, 13, 0.5);
const shine = sparkles([[44, 190, 4], [360, 196, 3.5], [262, 140, 3], [130, 128, 3], [30, 262, 3]]);

export default compose({
  title: 'The Shining Lake',
  seed: 4107,
  washes: [{ c: PAL.sky, o: 0.55, d: 'M14 128C40 112 360 108 388 124C398 180 396 250 386 288L16 288C6 240 6 170 14 128Z' }],
  after: inv.washes,
  lines: [oar],
  fine: [blade, splash, ripples],
  once: inv.once,
  fills: '',
  parts: [
    shine,
    farBoat(66, 142, 0.46, PAL.rose, PAL.slate, PAL.terracotta),
    farBoat(196, 130, 0.4, PAL.green, PAL.ochre, PAL.sky),
    farBoat(332, 146, 0.46, PAL.ochre, PAL.terracotta, PAL.red),
    place(youngest({ upper: true, arms: P_ARMS.fan, look: -1 }), `translate(198 ${G + 48 * 0.86 * s}) scale(${s})`),
    place(prince({ upper: true, arms: R_ARMS.row, mood: 'puff' }), PR),
    { washes: [{ c: PAL.sky, o: 0.7, d: sweat }], fine: [sweat] },
    place(boat(), `translate(200 ${G}) scale(1.95)`),
  ],
});
