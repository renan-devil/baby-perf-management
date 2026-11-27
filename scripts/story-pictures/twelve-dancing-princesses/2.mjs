import { PAL, hatch, zed } from '../lib.mjs';
import { R_ARMS, chair, compose, cup, door, place, prince } from './characters.mjs';

// Picture 2: a young prince on a chair outside the princesses' locked door, fast asleep and
// snoring, the empty cup of milk beside him.
const P = 'translate(150 262) scale(1.42)';

export default compose({
  title: 'The Sleepy Prince',
  seed: 4102,
  washes: [
    { c: PAL.grey, o: 0.3, d: 'M70 262C90 254 220 254 240 262C220 270 90 270 70 262Z' },
  ],
  lines: ['M30 262L380 262'],
  fine: [zed(112, 96, 10), zed(88, 70, 13), zed(60, 38, 17), hatch(40, 270, 370, 270, 10, 6, 180, 6)],
  parts: [
    place(chair({ gap: 30 }), P),
    place(prince({ sit: true, mood: 'snore', arms: R_ARMS.fold, tilt: -14 }), P),
    place(door(), 'translate(293 262) scale(1.15)'),
    place(cup({ milk: false }), 'translate(222 262) scale(1.3)'),
  ],
});
