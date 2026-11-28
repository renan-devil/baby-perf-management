import { PAL, hatch, transformPath } from '../lib.mjs';
import { SONS, compose, dot, limb, oval, place, son } from './characters.mjs';

// The Farmer and His Sons, 1 (cover): in his armchair by the window, the old farmer leans towards his
// three sons with a hand by his mouth and a wink, and whispers his secret. The three boys, tallest to
// smallest, lean in to listen. Through the window: the big field.
const floor = 'M18 252C120 249 260 254 388 251';

// The window, with the field and a little tree outside
const WT = 'translate(176 16) scale(0.85)';
const win = 'M0 0L80 0L80 76L0 76Z';
const bars = 'M40 0L40 76M0 38L80 38';
const sill = 'M-6 76L86 76L86 82L-6 82Z';
const fieldEdge = 'M0 48C20 44 54 46 80 42';
const furrows = 'M4 62C24 58 44 58 64 54M14 72C34 68 54 67 78 62M44 50L78 48';
const tree = 'M66 44L66 32M58 32C52 26 58 18 66 20C72 16 80 24 76 30C74 34 60 36 58 32Z';
const sun = 'M14 16a6 6 0 1 0 12 0a6 6 0 1 0 -12 0Z';
const window = {
  lines: [win, sill],
  fine: [bars, fieldEdge, furrows, tree],
  washes: [
    { c: PAL.sky, o: 0.4, d: 'M0 0L80 0L80 42C54 46 20 44 0 48Z' },
    { c: PAL.green, o: 0.5, d: 'M0 48C20 44 54 46 80 42L80 76L0 76Z' },
    { c: PAL.ochre, o: 0.45, d: 'M4 62C24 58 44 58 64 54L78 62C54 67 34 68 14 72Z' },
    { c: PAL.green, o: 0.7, d: tree },
    { c: PAL.ochre, o: 0.75, d: sun },
    { c: PAL.ochre, o: 0.5, d: sill },
  ],
};

// The armchair, a high-backed wing chair (only the parts not hidden by the farmer)
const chairBack = 'M66 232C58 200 56 156 62 126C66 106 92 98 104 110C110 118 108 136 104 150';
const chairWing = 'M62 168C70 162 84 162 92 170';
const chairSkirt = 'M66 232L66 246L166 246';
const chairSkirtTop = 'M66 232L100 232';
const chairLegs = 'M72 246l1 6M160 246l-1 6';

// The old farmer (drawn in place): flat cap, white beard, ochre waistcoat over a white shirt, a rosy
// checked blanket over his knees. Face centre FH.
const FH = [124, 126];
const fh = (d) => transformPath(d, `translate(${FH[0]} ${FH[1]})`);
const fFace = fh('M-11 -4C-12 6 -8 12 0 12C8 12 12 6 11 -4');
const fFaceFill = fh('M-11 -4C-12 6 -8 12 0 12C8 12 12 6 11 -4C8 -8 -8 -8 -11 -4Z');
const cap = fh('M-13.5 -4C-15 -14 -7 -19 2 -19C10 -19 14 -15 15 -10C19 -10 23 -8 24 -5C18 -3 6 -4 -13.5 -4Z');
const capMarks = fh('M14 -10C12 -8 12 -6 13 -4M-6 -18C-2 -14 4 -13 8 -14');
const beard = fh('M-11.5 1C-15 14 -8 30 1 34C10 30 16 16 12 1C9 9 3 11 0 10C-4 11 -9 8 -11.5 1Z');
const beardMarks = fh('M-6 16c1 4 3 7 5 9M3 18c1 3 1 6 0 9M8 13c0 4 -1 7 -3 9');
const moustache = fh('M-7 7C-4 4 0 4 1 6C3 4 7 4 9 7C6 9 3 9 1 8C-1 9 -5 9 -7 7Z');
const hairTufts = fh('M-11.5 -4C-15 -2 -16 2 -12.5 5C-14 1 -13 -2 -11.5 -4ZM11.5 -4C15 -2 16 2 12.5 5C14 1 13 -2 11.5 -4Z');
const ear = fh('M-11 -3C-15 -4 -15 4 -11 4');
const brows = fh('M-8.5 -6c2 -2 4 -2 6 -1M2 -6.5c2 -1.4 4 -1.4 6.5 0.5');
const wink = fh('M2.5 -1q3 -2.6 6 0');
const nose = fh('M-1 4a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0Z');

const torso = 'M102 150C94 168 94 190 96 210L138 208C140 190 140 168 134 150C124 145 112 145 102 150Z';
const vest = 'M102 150C94 168 94 190 96 210L138 208C140 190 140 168 134 150C130 156 126 162 124 168C120 162 112 154 102 150Z';
const vestMarks = 'M124 168L122 206';
const blanket = 'M92 206C106 200 132 196 160 196C172 196 178 204 176 214C174 224 172 232 170 238L104 240C98 230 94 218 92 206Z';
const blanketEdge = 'M110 240l-1 5M120 240l0 5M130 240l0 5M140 239l0 5M150 239l0 5M160 239l1 5M168 238l1 5';
const checks = 'M114 201C116 214 118 228 120 240M136 197C137 212 138 226 139 239M156 196C157 210 157 226 157 239M95 217C120 213 150 211 176 214M100 230C124 228 150 226 173 228';
const shoes = [oval(176, 249, 9, 4.2), oval(191, 248.5, 8.5, 4)];
const shins = 'M164 240L170 246M178 239L184 245';
// his right arm: the hand cupped by his mouth as he whispers
const fArmPts = [
  [132, 154, 9],
  [148, 178, 8.5],
  [146, 144, 8],
];
const fArm = limb(fArmPts);
const fHand = 'M140 138C141 132 148 130 151 135C153 140 151 147 146 148C142 148 139 143 140 138Z';
// the whisper, curling towards the boys
const whisper = 'M157 128q4 4 1 9M163 126q6 6 1 13M170 124q8 8 1 17';

// The farmer and his chair, made bigger and moved into place (scaled about the floor)
const FT = 'translate(-27 -50.4) scale(1.2)';
const farmer = {
  lines: [chairBack, chairSkirt, chairLegs, fFace, cap, beard, torso, blanket, shins, ...shoes, fArm, fHand],
  fine: [chairWing, chairSkirtTop, capMarks, beardMarks, moustache, hairTufts, ear, brows, wink, nose, vestMarks,
    'M102 150C112 154 120 162 124 168C126 162 130 156 134 150', checks, blanketEdge, whisper],
  washes: [
    { c: PAL.terracotta, o: 0.62, d: `${chairBack}L104 210L100 232L66 232ZM66 232L170 232L166 246L66 246Z` },
    { c: PAL.rose, o: 0.32, d: fFaceFill + ear },
    { c: PAL.slate, o: 0.75, d: cap },
    { c: PAL.ochre, o: 0.72, d: vest },
    { c: PAL.rose, o: 0.62, d: blanket },
    { c: PAL.slate, o: 0.85, d: shoes.join('') },
    { c: PAL.rose, o: 0.5, d: fHand },
    { c: PAL.rose, o: 0.8, d: nose },
  ],
  whites: ['M102 150C112 154 120 162 124 168C126 162 130 156 134 150C124 145 112 145 102 150Z', `${fArm}Z`, beard, moustache, hairTufts],
  fills: [fh(dot(-4.5, -1, 1.9)), dot(121.5, 184, 1.4), dot(121, 196, 1.4)],
  glints: [fh(dot(-5, -1.6, 0.55))],
};

// The three sons, leaning in (rotated about their feet), tallest at the back
const K = 1.1;
const ST = {
  youngest: `translate(236 253) rotate(-11) scale(${SONS.youngest.s * K})`,
  middle: `translate(292 252) rotate(-9) scale(${SONS.middle.s * K})`,
  eldest: `translate(350 251) rotate(-9) scale(${SONS.eldest.s * K})`,
};

export default compose({
  title: 'The Farmer and His Sons',
  seed: 117,
  washes: [{ c: PAL.ochre, o: 0.3, d: 'M18 250C120 247 260 252 388 249L384 270C260 274 120 272 24 270Z' }],
  lines: [floor],
  fine: [hatch(30, 262, 380, 262, 13, 7, 172, 4)],
  parts: [
    place(window, WT),
    place(farmer, FT),
    place(
      son('youngest', {
        look: -1,
        mood: 'oh',
        arms: [
          [[-13, -100, 8], [-25, -86, 7.5], [-17, -116, 7]],
          [[13, -100, 8], [18, -82, 7.5], [19, -66, 7]],
        ],
      }),
      ST.youngest,
    ),
    place(
      son('middle', {
        look: -1,
        mood: 'smile',
        arms: [
          [[-13, -100, 8], [-17, -82, 7.5], [-4, -72, 7]],
          [[13, -100, 8], [15, -82, 7.5], [3, -70, 7]],
        ],
      }),
      ST.middle,
    ),
    place(
      son('eldest', {
        look: -1,
        mood: 'smile',
        arms: [
          [[-13, -100, 8], [-26, -96, 7.5], [-42, -94, 7]],
          [[13, -100, 8], [27, -84, 7.5], [16, -66, 7]],
        ],
      }),
      ST.eldest,
    ),
  ],
});
