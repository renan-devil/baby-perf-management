import { PAL } from '../lib.mjs';
import { SEAT, SIT, STONE, bundle, compose, dick, dot, hill, london, milestone, place } from './1.mjs';

// Dick Whittington, 7: Dick has run away. He sits on the same milestone on the green hill, without
// his cat, and listens: far away, all the bells of London are ringing, and they seem to sing to him.

/** A church bell (mouth at the bottom), centre (0,0), about 24 tall. */
function bell() {
  const b = 'M-9 7C-9 -2 -8 -11 0 -11C8 -11 9 -2 9 7C10 9 12 10 13 11L-13 11C-12 10 -10 9 -9 7Z';
  return {
    lines: [b],
    fine: ['M0 -11L0 -15', 'M-6 4C-2 3 2 3 6 4'],
    washes: [{ c: PAL.ochre, o: 0.95, d: b }, { c: PAL.terracotta, o: 0.3, d: 'M3 -9C8 -6 8 2 8 8L12 11L4 11C6 4 6 -4 3 -9Z' }],
    fills: [dot(0, 13.5, 2.6)],
    glints: ['M-5 4C-6 -2 -5 -7 -2 -9C-3 -4 -3 0 -3 4Z'],
  };
}
/** A little music note: a round head at (x,y) and a stem with a flag; as ink (once) or its filled head (fill). */
function note(x, y, fill = false) {
  if (fill) return `<path d="M${x - 4} ${y}C${x - 4} ${y - 3} ${x + 1} ${y - 4.5} ${x + 4} ${y - 2.5}C${x + 5} ${y + 1} ${x} ${y + 3.5} ${x - 3} ${y + 2}Z"/>`;
  return `<path d="M${x + 3.6} ${y - 2}L${x + 4} ${y - 20}C${x + 8} ${y - 16} ${x + 12} ${y - 15} ${x + 10} ${y - 8}"/>`;
}
/** Sound: three little arcs to the right of (0,0). */
const ring = (s = 1) => `M${8 * s} -6C${11 * s} -3 ${11 * s} 3 ${8 * s} 6M${13 * s} -10C${18 * s} -4 ${18 * s} 4 ${13 * s} 10M${18 * s} -14C${25 * s} -5 ${25 * s} 5 ${18 * s} 14`;

export default compose({
  title: 'Turn again, Whittington',
  seed: 277,
  washes: [{ c: PAL.green, o: 0.35, d: 'M6 207C50 203 120 203 166 209C130 216 60 218 6 215Z' }, ...hill.washes],
  lines: ['M8 207C50 203 120 203 166 209', 'M8 250C70 248 140 236 224 219', 'M318 210C340 210 366 212 392 215'],
  fine: [
    ...hill.fine,
    // the bells' song floating over to Dick: wavy lines
    'M118 120C136 112 150 128 168 120C186 112 196 126 212 120',
    'M128 142C144 136 156 148 172 142C186 136 196 146 206 142',
  ],
  once: [note(178, 96), note(206, 140), note(150, 166)].join(''),
  fills: [note(178, 96, true), note(206, 140, true), note(150, 166, true)].join(''),
  parts: [
    place(london(), 'translate(16 206) scale(0.85)'),
    place(bell(), 'translate(50 140) rotate(-18)'),
    place({ fine: [ring()] }, 'translate(50 140) rotate(-10)'),
    place(bell(), 'translate(84 112) rotate(14)'),
    place({ fine: [ring()] }, 'translate(84 112)'),
    place(bell(), 'translate(118 150) rotate(-8) scale(0.85)'),
    place({ fine: [ring(0.9)] }, 'translate(118 150)'),
    place(milestone(), STONE),
    place(bundle(), `translate(${SEAT[0] + 40} ${SEAT[1] + 58}) rotate(-20) scale(0.8)`),
    place(
      dick({
        pose: 'sit',
        mood: 'listen',
        look: [-1.4, -0.6],
        tilt: -8,
        arms: [
          [[-17, -40, 8], [-32, -44, 7.5], [-22, -54, 7]],
          [[17, -40, 8], [22, -26, 7.5], [18, -12, 7.5], [13, -4, 7.5]],
        ],
      }),
      `translate(${SEAT[0]} ${SEAT[1]}) ${SIT}`,
    ),
  ],
});
