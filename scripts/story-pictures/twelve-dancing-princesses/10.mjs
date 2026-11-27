import { PAL, hatch } from '../lib.mjs';
import { K_ARMS, P_ARMS, S_ARMS, at, compose, king, place, princess, soldier, sparkles, twig, youngest } from './characters.mjs';

// Picture 10: in the morning the soldier shows the King the three twigs, one of silver, one of
// gold and one of diamond, while the princesses laugh together: it's true!
const S = 'translate(196 266) scale(1.06)';
const [hx, hy] = at(-52, -114, S);
const shine = sparkles([[hx - 58, hy - 40, 4], [hx + 22, hy - 60, 4.5], [hx - 26, hy - 66, 3.5], [hx - 50, hy - 4, 3]]);

export default compose({
  title: 'The Three Twigs',
  seed: 4110,
  washes: [{ c: PAL.grey, o: 0.3, d: 'M14 268C60 260 340 260 390 268C340 276 60 276 14 268Z' }],
  lines: ['M12 268L390 268'],
  fine: [hatch(20, 276, 380, 276, 11, 6, 180, 16)],
  parts: [
    place(king({ mood: 'wow', look: 1, arms: K_ARMS.wonder }), 'translate(70 268) scale(1.02)'),
    place(twig(PAL.slate), `translate(${hx - 4} ${hy + 2}) rotate(-44) scale(1.2)`),
    place(twig(PAL.ochre), `translate(${hx} ${hy - 2}) rotate(-14) scale(1.25)`),
    place(twig(PAL.sky), `translate(${hx + 4} ${hy + 2}) rotate(16) scale(1.2)`),
    shine,
    place(soldier({ mood: 'happy', look: -1, arms: S_ARMS.show }), S),
    place(princess({ who: 'eldest', mood: 'laugh', arms: P_ARMS.shh }), 'translate(262 268) scale(0.95)'),
    place(princess({ who: 'sister', dress: PAL.green, hair: PAL.slate, mood: 'laugh', arms: P_ARMS.down }), 'translate(318 268) scale(0.9)'),
    place(youngest({ mood: 'laugh', arms: P_ARMS.down }), 'translate(366 268) scale(0.95)'),
  ],
});
