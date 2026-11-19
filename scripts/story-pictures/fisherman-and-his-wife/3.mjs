import { PAL, hatch, tufts } from '../lib.mjs';
import { F_ARMS, compose, fisherman, flounder, place } from './characters.mjs';

// The Fisherman and His Wife, 3: the sea has turned green and yellow. The fisherman stands at the edge
// of the waves, hands round his mouth, and calls the little rhyme; splish! the flounder's head pops
// up out of the water to listen.
// The far edge of the sea, broken behind the fisherman, and the wet edge of the beach.
const seaL = 'M0 186C20 184 36 187 54 186';
const seaR = 'M138 186C180 184 220 184 246 185M362 187C380 186 390 185 400 184';
const shore = 'M0 232C70 234 140 240 200 252C240 260 270 266 300 268';
const shoreL = 'M0 232C30 232.4 50 233 64 233.6';
const shoreR = 'M132 238C160 242 182 247 200 252C240 260 270 266 300 268';
// (the fisherman's body is left out of the water, so his colours stay clean)
const water = `M0 186C20 184 36 187 50 186L146 186C220 182 320 188 400 184L400 268L300 268C270 266 240 260 200 252C140 240 70 233 0 232ZM68 186L126 186L127 214L122 233L70 233L66 214Z`;
const FI = 'translate(306 196) rotate(24) scale(1.45)'; // popping up, head first, towards the fisherman
const call = 'M150 132q7 9 0 18M162 126q10 15 0 30M174 120q13 21 0 42';

export default compose({
  title: 'The fisherman calls the flounder',
  seed: 63,
  washes: [
    { c: PAL.green, o: 0.62, d: water, rule: 'evenodd' },
    { c: PAL.ochre, o: 0.4, d: water, rule: 'evenodd' },
    { c: PAL.ochre, o: 0.55, d: 'M170 206C220 198 300 200 360 206C320 212 220 214 170 206ZM230 246C270 240 330 242 380 250C340 256 270 254 230 246Z' },
    { c: PAL.ochre, o: 0.32, d: `${shore}L300 268C330 269 360 267 400 267L400 300L0 300Z` },
  ],
  lines: [seaL, seaR, shoreL, shoreR, 'M300 268C330 269 360 267 400 267'],
  fine: [
    call,
    'M226 226q12 -6 24 0M232 236C250 244 300 248 330 242M362 234q12 -6 24 0', // ripples round the flounder
    'M244 218l-8 -5M250 208l-5 -8M372 210l6 -7M378 222l9 -4', // splish!
    'M10 204q8 -4 16 0M180 202q8 -4 16 0M380 206q8 -4 16 0M190 230q8 -4 16 0M370 240q8 -4 16 0M20 220q6 -3 12 0',
    'M160 238q12 -6 24 0M210 252q12 -6 24 2M260 262q10 -5 22 2',
    hatch(12, 284, 388, 288, 12, 6, 165, 4),
    tufts([[16, 268], [170, 274]], 9, 5),
  ],
  parts: [
    place(fisherman({ mood: 'shout', arms: F_ARMS.call, look: [1.6, 0] }), 'translate(96 270) scale(1.4)'),
    place(flounder({ look: [-1.5, 0.3] }), FI),
  ],
});
