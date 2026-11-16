import { PAL, hatch, rays, tufts } from '../lib.mjs';
import { P_ARMS, PR_ARMS, compose, dot, heinrich, place, prince, princess } from './characters.mjs';

// The Frog Prince, 10: in the morning the frog has become a smiling prince with frog-green eyes. The
// princess beams beside him, and faithful Heinrich is so happy that the three iron bands round his
// chest pop off: ping, ping, ping!
const ground = 'M0 272C90 269 200 274 300 271C340 270 370 272 400 271';
const sun = dot(46, 46, 18);

export default compose({
  title: 'Ping! Ping! Ping!',
  seed: 60,
  washes: [
    { c: PAL.green, o: 0.32, d: 'M0 268C90 265 200 270 300 267C340 266 370 268 400 267L400 300L0 300Z' },
    { c: PAL.ochre, o: 0.75, d: sun },
  ],
  lines: [ground],
  fine: [sun, rays(46, 46, 24, 34, 10, 4), hatch(14, 284, 384, 286, 12, 7, 165, 4), tufts([[20, 272], [160, 274], [384, 271]], 9, 5)],
  parts: [
    place(princess({ mood: 'happy', tilt: 6, arms: P_ARMS.down }), 'translate(96 278) scale(1.38)'),
    place(prince({ mood: 'happy', tilt: -4, arms: PR_ARMS.wave }), 'translate(184 278) scale(1.38)'),
    place(heinrich({ popped: true }), 'translate(316 276) scale(1.1)'),
  ],
});
