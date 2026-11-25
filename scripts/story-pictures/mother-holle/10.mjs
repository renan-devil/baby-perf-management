import { PAL, tufts } from '../lib.mjs';
import { L_ARMS, cockerel, compose, crowMarks, gate, lotte, oval, place } from './characters.mjs';

// Mother Holle, 10: as Lotte walks under the gate, SPLOSH! a big pot of sticky black soot pours
// down all over her. She stands there with her arms up, all black except for her big round eyes,
// while the cockerel crows, "Our sooty girl's come home to you!"
const GT = 'translate(176 276) scale(1.1)';
const LT = 'translate(176 274) scale(1.2)';
const ground = 'M20 276C120 273 290 273 386 276';
// the stream of soot pouring from under the arch onto her head, and a sticky puddle round her feet
const stream = 'M160 76C168 72 186 72 194 76C192 92 196 106 190 130C184 134 168 134 162 130C158 106 162 92 160 76Z';
const drops = [oval(150, 104, 2.6, 3.4), oval(206, 96, 2.4, 3.2), oval(142, 132, 2.2, 3), oval(212, 128, 2.6, 3.4)];
const puddle = 'M130 276C134 268 156 266 176 266C196 266 218 268 222 276C210 282 144 282 130 276Z';
const splosh = 'M138 112l-10 -6M136 124l-12 0M214 112l10 -6M216 124l12 0';

export default compose({
  title: 'Lotte Covered in Soot',
  seed: 1410,
  washes: [
    { c: PAL.green, o: 0.35, d: 'M16 274C120 266 290 266 390 274C386 286 300 292 200 292C110 292 20 286 16 274Z' },
  ],
  after: [
    { c: PAL.ink, o: 0.6, d: stream + drops.join('') },
    { c: PAL.slate, o: 0.6, d: stream + drops.join('') },
    { c: PAL.ink, o: 0.55, d: puddle },
  ],
  lines: [ground],
  fine: [stream, puddle, splosh, ...drops, 'M168 84q2 14 0 30M184 82q-2 14 0 32', tufts([[40, 276], [96, 276], [370, 276]], 9, 7)],
  parts: [
    place(gate(), GT),
    place(lotte({ mood: 'sooty', soot: true, arms: L_ARMS.up }), LT),
    place(cockerel({ crow: true }), 'translate(312 276) scale(0.95)'),
    { fine: [crowMarks(360, 206)] },
  ],
});
