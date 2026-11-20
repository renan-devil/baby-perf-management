import { PAL, hatch, tufts } from '../lib.mjs';
import { LM_ARMS, LM_HEAD, LM_LEGS, at, compose, dot, littleMan, place } from './characters.mjs';

// Rumpelstiltskin, 8: deep in the forest at night, by a tiny house, the little man hops round a fire on
// one leg and sings his secret song, thinking that nobody can hear him.
const ground = 'M0 266C90 262 200 268 300 264C340 263 370 265 400 264';

// the tiny house
const house = 'M24 266L24 196L104 196L104 266';
const roof = 'M14 200L64 152L114 200Z';
const door = 'M52 266L52 232C52 222 70 222 70 232L70 266';
const win = 'M80 216L96 216L96 232L80 232Z';
const chimney = 'M86 176L86 156L98 156L98 188';

// the fire: two crossed logs and leaping flames
const logs = 'M168 270L226 254L229 262L171 278ZM176 254L232 272L229 279L173 262Z';
const flames = 'M180 258C172 240 182 226 188 214C190 226 194 228 196 222C196 206 202 192 212 184C210 200 218 210 220 222C224 218 226 212 226 206C234 220 236 244 224 258Z';
const inner = 'M192 256C188 246 194 238 198 232C200 238 204 238 206 232C210 240 214 248 210 256Z';
// a fir tree between the house and the fire
const fir = 'M142 168L120 210L132 210L114 240L130 240L110 264L174 264L154 240L170 240L152 210L164 210Z';
const sparks = 'M190 196l-2 -6M222 192l3 -6M206 172l0 -7';

const L = 'translate(292 262) scale(1.7)';
const [mx, my] = at(L, LM_HEAD[0] + 10, LM_HEAD[1] + 8);
// a song: curly marks and two little notes floating up from his mouth
const curls = `M${mx + 18} ${my - 20}c4 -6 10 -2 6 2s4 8 8 2M${mx + 26} ${my - 50}c4 -6 10 -2 6 2s4 8 8 2M${mx - 66} ${my - 44}c-4 -6 -10 -2 -6 2s-4 8 -8 2`;
const notes = [
  [mx + 44, my - 14],
  [mx - 40, my - 74],
  [mx - 56, my - 20],
];
const noteHeads = notes.map(([x, y]) => `M${x - 4} ${y}c0 -3 6 -4 7 -1c0 3 -6 4 -7 1Z`).join('');
const stems = notes.map(([x, y]) => `M${x + 3} ${y - 1}l0 -13l5 3`).join('');
// hop marks under his raised foot and his standing foot
const [hx, hy] = at(L, -6, 2);
const hop = `M${hx - 14} ${hy + 4}q-4 -6 0 -10M${hx + 14} ${hy + 4}q4 -6 0 -10`;

export default compose({
  title: 'In the forest, the little man hops round a fire on one leg, singing',
  seed: 88,
  washes: [
    { c: PAL.slate, o: 0.32, d: 'M6 30C10 6 120 4 200 6C300 4 392 8 394 40L396 266C300 268 200 262 4 266Z' },
    { c: PAL.green, o: 0.4, d: 'M0 262C90 258 200 264 300 260C340 259 370 261 400 260L400 300L0 300Z' },
    { c: PAL.ochre, o: 0.16, d: dot(204, 232, 56) },
    { c: PAL.ochre, o: 0.55, d: house },
    { c: PAL.terracotta, o: 0.75, d: roof + chimney },
    { c: PAL.terracotta, o: 0.7, d: door },
    { c: PAL.ochre, o: 1, d: win },
    { c: PAL.terracotta, o: 0.8, d: logs },
    { c: PAL.red, o: 0.85, d: flames },
    { c: PAL.ochre, o: 1, d: inner },
    { c: PAL.terracotta, o: 0.5, d: 'M366 64C364 120 362 190 364 264L386 264C384 190 386 130 386 66Z' },
    { c: PAL.green, o: 0.55, d: fir },
    { c: PAL.green, o: 0.5, d: 'M344 40C330 20 350 0 376 2C400 0 410 30 396 50C400 70 370 80 356 66C340 72 330 56 344 40Z' },
  ],
  lines: [ground, fir, house, roof, door, chimney, logs, flames, 'M366 62C364 120 362 190 364 264M386 66C384 130 386 190 386 264', 'M344 40C330 20 350 0 376 2C400 0 410 30 396 50C400 70 370 80 356 66C340 72 330 56 344 40Z'],
  fine: [
    win,
    'M88 216L88 232M80 224L96 224',
    inner,
    sparks,
    curls,
    stems,
    hop,
    'M92 150c-4 -8 4 -12 0 -20M96 140c-4 -6 3 -10 0 -16',
    hatch(10, 280, 390, 282, 12, 7, 165, 4),
    tufts([[130, 264], [250, 265], [390, 264]], 9, 5),
  ],
  once: `<path d="M150 30l0 0.1M240 22l0 0.1M300 60l0 0.1M120 70l0 0.1M200 50l0 0.1M40 40l0 0.1" stroke="${PAL.paper}" stroke-width="3"/><path d="${noteHeads}" fill="${PAL.ink}"/>`,
  parts: [
    { fine: [dot(250, 46, 12)], whites: [dot(250, 46, 12)] },
    place(littleMan({ mood: 'sing', tilt: 10, arms: LM_ARMS.dance, legs: LM_LEGS.hop }), L),
  ],
});
