import { PAL, tufts } from '../lib.mjs';
import { boy, compose, elephant, lord, place, ripples } from './characters.mjs';

// Cao Chong Weighs the Elephant, 1 (cover): by a river, the great lord looks up at the huge elephant,
// one hand at his chin, wondering how heavy it is; little Cao Chong stands beside him, thinking too.
// (No boat yet: the child guesses the answer later.)
// the grassy bank they stand on, with the river running past in front of them
const bank = 'M6 266C80 260 170 268 250 263C310 260 360 265 394 262';
const far = 'M8 232C90 228 200 234 392 228';
const question = 'M60 30C60 20 74 18 76 26C78 34 68 36 68 44';

export default compose({
  title: 'Cao Chong Weighs the Elephant',
  seed: 71,
  washes: [
    { c: PAL.green, o: 0.5, d: 'M6 234C90 228 200 236 396 228L396 264C340 260 300 266 250 264C170 268 80 260 6 268Z' },
    { c: PAL.ochre, o: 0.3, d: 'M6 248C90 244 200 252 396 246L396 262C300 266 150 260 6 266Z' },
    { c: PAL.sky, o: 0.75, d: 'M6 266C80 260 170 268 250 263C310 260 360 265 396 262L396 294L6 294Z' },
    { c: PAL.slate, o: 0.25, d: 'M6 268C80 262 170 270 250 265C310 262 360 267 396 264L396 272C300 276 150 270 6 276Z' },
  ],
  lines: [bank],
  fine: [
    far,
    ripples([[20, 278, 22], [70, 288, 18], [130, 280, 22], [200, 287, 20], [262, 278, 22], [330, 286, 20], [372, 276, 16]]),
    tufts([[14, 255], [116, 256], [244, 255], [386, 254]], 9, 8),
    tufts([[300, 230], [40, 232], [180, 231]], 6, 4),
  ],
  parts: [
    place(elephant({ look: [-1.5, 0.5] }), 'translate(300 256) scale(1.25)'),
    place(lord({ look: 1, mood: 'puzzled' }), 'translate(70 256) scale(1.2)'),
    place(boy({ look: 1, lookY: -1, mood: 'happy', tilt: -8 }), 'translate(140 256) scale(1.15)'),
    { lines: [question], fine: ['M68 52l0.5 1.2'] },
  ],
});
