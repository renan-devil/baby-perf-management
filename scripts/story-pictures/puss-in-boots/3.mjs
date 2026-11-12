import { PAL, hatch } from '../lib.mjs';
import { compose, fruitBasket, hat, king, oval, place, puss, pussAt, throne } from './characters.mjs';

// Puss in Boots, 3: in the palace, Puss takes off his feathered hat and bows very low before the
// round, friendly King on his throne, holding out a basket of golden pears and strawberries.
const floor = 'M10 270C100 266 220 271 300 268C340 267 370 269 390 268';
const lean = 45;
const P = 'translate(118 270) scale(1.25)';
const basketPaw = [48, -96];
const hatPaw = [-36, -54];
const K = 'translate(300 270) scale(1.05)';

const at = ([x, y], t) => {
  const [px, py] = pussAt(x, y, lean);
  return `${t} translate(${px.toFixed(1)} ${py.toFixed(1)})`;
};

export default compose({
  title: 'A present for the King',
  seed: 107,
  washes: [
    // a red carpet up to the throne
    { c: PAL.red, o: 0.35, d: 'M40 274C120 270 240 272 380 270L384 286C260 290 120 290 36 288Z' },
  ],
  lines: [floor],
  fine: [hatch(50, 280, 370, 281, 9, 7, 172, 5)],
  parts: [
    place(throne({ hole: oval(0, -132, 22, 34) }), K),
    place(
      king({
        mood: 'happy',
        tilt: -6,
        arms: [
          [[-28, -94, 11], [-44, -90, 10], [-58, -86, 10], [-66, -86, 10]],
          [[28, -94, 11], [40, -80, 10], [46, -66, 10], [47, -58, 10]],
        ],
      }),
      K,
    ),
    place(
      puss({
        mood: 'sly',
        withHat: false,
        withBag: false,
        lean,
        tail: 'up',
        legs: [
          { hip: [-9, -52], top: [-12, -34], toe: -1 },
          { hip: [9, -52], top: [10, -34], toe: 1 },
        ],
        arms: [
          [[-15, -80, 8], [-26, -68, 7], hatPaw.concat(7)],
          [[15, -80, 8], [32, -92, 7], basketPaw.concat(7)],
        ],
      }),
      P,
    ),
    place(fruitBasket(), `${at(basketPaw, P)} translate(8 12) rotate(-6) scale(0.95)`),
    place(hat(), `${at(hatPaw, P)} translate(-8 2) rotate(-100) scale(0.9)`),
  ],
});
