import { PAL, hatch } from '../lib.mjs';
import { P_ARMS, R_ARMS, S_ARMS, chandelier, compose, ghost, merge, note, place, prince, princess, soldier, sparkles, youngest } from './characters.mjs';

// Picture 8: in the glittering castle the princesses and the princes twirl round and round to the
// music, under a chandelier of candles; and in the middle of them all, the invisible soldier dances
// too. Nobody knows!
const inv = ghost(place(soldier({ arms: S_ARMS.dance, mood: 'smile' }), 'translate(206 262) scale(0.98)'));
const notes = merge(note(112, 96, 1.1), note(300, 84, 1), note(150, 140, 0.8), note(266, 128, 0.85), note(44, 120, 0.9), note(360, 116, 0.9));
const shine = sparkles([[70, 50, 4], [330, 44, 4.5], [20, 186, 3], [384, 180, 3], [250, 60, 3]]);

export default compose({
  title: 'The Glittering Ball',
  seed: 4108,
  washes: [{ c: PAL.ochre, o: 0.25, d: 'M12 262C80 252 320 252 390 262C392 274 300 284 200 284C100 284 10 274 12 262Z' }],
  after: inv.washes,
  lines: ['M14 262L388 262'],
  fine: [hatch(20, 272, 380, 272, 12, 7, 180, 14)],
  once: inv.once,
  parts: [
    place(chandelier(), 'translate(206 60)'),
    shine,
    notes,
    place(princess({ who: 'eldest', mood: 'smile', look: 1, arms: P_ARMS.danceR, twirl: -1 }), 'translate(66 262) scale(1.02)'),
    place(prince({ mood: 'happy', look: -1, arms: R_ARMS.danceL }), 'translate(155 262) scale(1.02)'),
    place(youngest({ mood: 'smile', look: 1, arms: P_ARMS.danceR, twirl: 1 }), 'translate(270 262) scale(1.04)'),
    place(prince({ tunic: PAL.terracotta, mood: 'happy', look: -1, arms: R_ARMS.danceL }), 'translate(352 262) scale(0.92)'),
  ],
});
