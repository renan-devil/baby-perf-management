import { PAL, hatch, zed } from '../lib.mjs';
import { S_ARMS, S_SIT, at, chair, compose, cup, door, flowerpot, place, soldier } from './characters.mjs';

// Picture 4: the soldier on his chair outside the door pretends to sleep, eyes shut, while he
// secretly pours the cup of milk into a flowerpot. Glug, glug.
const s = 1.4;
const S = `translate(170 262) scale(${s})`;
const [hx, hy] = at(52, -84 + S_SIT, S);
const cs = 1.8;
const C = `translate(${hx + 4} ${hy - 1}) rotate(125) scale(${cs})`;
const [rx, ry] = at(0, -13, C);
const potX = 300;
const stream = `M${rx - 3} ${ry - 2}C${rx + 12} ${ry} ${potX - 16} ${ry + 14} ${potX - 14} 230L${potX - 6} 230C${potX - 8} ${ry + 12} ${rx + 10} ${ry + 10} ${rx + 2} ${ry + 5}Z`;
const drops = `M${potX - 22} 222q-3 -4 -1 -7M${potX - 4} 221q3 -4 2 -7M${potX - 16} 216l-2 -3`;

export default compose({
  title: 'Milk for the Flowerpot',
  seed: 4104,
  washes: [
    { c: PAL.grey, o: 0.3, d: 'M90 262C110 254 300 254 320 262C300 270 110 270 90 262Z' },
    { c: PAL.sky, o: 0.3, d: stream },
  ],
  lines: ['M20 262L390 262'],
  fine: [stream, drops, zed(232, 92, 9), zed(256, 66, 12), zed(286, 34, 16), hatch(30, 270, 380, 270, 10, 6, 180, 8)],
  parts: [
    place(door(), 'translate(56 262) scale(1.05)'),
    place(chair({ gap: 32, cutR: [-80, -58] }), S),
    place(soldier({ sit: true, mood: 'asleep', arms: S_ARMS.pour }), S),
    place(cup({ milk: false }), C),
    place(flowerpot(), `translate(${potX} 262) scale(1.1)`),
  ],
});
