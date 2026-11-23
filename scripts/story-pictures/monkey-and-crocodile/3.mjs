import { PAL, hatch, tufts } from '../lib.mjs';
import { compose, place, ripple, uprightCroc } from './characters.mjs';

// The Monkey and the Crocodile, 3: at home on the muddy bank, Mrs Crocodile (the pink flower behind her
// eye) folds her arms, turns her nose up and sulks, "Humph!", while Mr Crocodile wrings his hands
// behind her, very worried.
const MR = 'translate(100 258) scale(1.6)';
const MRS = 'translate(256 258) scale(1.6)';

const ground = 'M0 256C80 253 160 257 240 255C300 254 360 257 400 255';
const mud = 'M0 256C80 253 160 257 240 255C300 254 360 257 400 255L400 278C300 280 200 276 100 279C60 280 30 278 0 280Z';
const water = 'M0 282C100 278 200 282 300 279C340 278 370 279 400 278L400 300L0 300Z';
// reeds at the back of the bank, with bulrushes
const reeds = 'M14 256C12 236 12 220 16 202M24 256C26 238 30 226 36 214M376 256C374 238 372 226 366 212M386 256C388 236 388 222 384 206';
const rushes = 'M13 214C11 206 13 198 16 194C19 198 19 206 17 214ZM383 218C381 210 383 202 386 198C389 202 389 210 387 218Z';
// her "Humph!": three puffs from her nose; his worry: a drop of sweat and little shake marks
const humph = 'M366 92l13 -5M368 103l14 0M362 81l8 -9';
const sweat = 'M95 92C90 100 90 107 95 107C100 107 100 100 95 92Z';
const shake = 'M62 150l-9 -3M60 162l-10 0M84 88l-6 -6M108 80l1 -8';

export default compose({
  title: 'Mrs Crocodile sulks',
  seed: 703,
  washes: [
    { c: PAL.ochre, o: 0.35, d: mud },
    { c: PAL.grey, o: 0.3, d: mud },
    { c: PAL.sky, o: 0.5, d: water },
    { c: PAL.ochre, o: 0.7, d: rushes },
    { c: PAL.sky, o: 0.8, d: sweat },
  ],
  lines: [ground],
  fine: [
    reeds,
    rushes,
    humph,
    sweat,
    shake,
    hatch(30, 268, 380, 268, 14, 6, 160, 4),
    ripple(80, 292, 24),
    ripple(250, 290, 24),
    tufts([[150, 256], [330, 256]], 8, 4),
  ],
  parts: [
    place(uprightCroc({ mood: 'worried', arms: 'wring', tilt: 6, look: [1.6, 0.4] }), MR),
    place(uprightCroc({ mood: 'sulk', mrs: true, arms: 'folded', tilt: -20 }), MRS),
  ],
});
