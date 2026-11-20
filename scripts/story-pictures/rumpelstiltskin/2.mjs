import { PAL, hatch, tufts } from '../lib.mjs';
import { KING_ARMS, at, compose, horse, king, miller, place } from './characters.mjs';

// Rumpelstiltskin, 2: on the road by his mill, the round, floury miller bows low to the King on his
// big white horse, his cap in his hand, and boasts that his daughter can spin straw into gold.
const ground = 'M0 270C90 266 200 272 300 268C340 267 370 269 400 268';
const hill = 'M0 190C30 176 66 176 84 190C88 194 90 196 92 198';
const H = 'translate(278 270) scale(1.25)';
const K = 'translate(278 174)';
const M = 'translate(110 270) scale(1.25)';

// the mill on the hill behind
const mill = 'M34 182L40 128L60 128L66 182';
const millCap = 'M36 130C38 116 62 116 64 130Z';
const sails = 'M50 122L20 92M50 122L80 92M50 122L80 152M50 122L20 152';
const sailCloth = 'M44 116L26 98L32 92L50 110ZM56 116L74 98L80 104L62 122ZM56 128L74 146L68 152L50 134ZM44 128L26 146L20 140L38 122Z';
const millDoor = 'M46 182L46 170C46 166 54 166 54 170L54 182';

const [rx, ry] = at(K, ...KING_ARMS.reins[0][2]);
const [mx, my] = at(H, -88, -112);
// boasting puffs from the miller's mouth, towards the King
const [px, py] = at(M, ...at('rotate(52 0 -48)', 19, -108));
const puffs = `M${px + 6} ${py - 2}l9 -6M${px + 7} ${py + 4}l11 0M${px + 6} ${py + 10}l9 6`;
const reins = `M${rx} ${ry}C${rx - 20} ${ry + 18} ${mx + 20} ${my + 8} ${mx} ${my}`;

export default compose({
  title: 'The miller bows low to the King on his white horse',
  seed: 82,
  washes: [
    { c: PAL.green, o: 0.3, d: 'M0 266C90 262 200 268 300 264C340 263 370 265 400 264L400 300L0 300Z' },
    { c: PAL.green, o: 0.2, d: `${hill}L92 268L0 268Z` },
    { c: PAL.ochre, o: 0.3, d: 'M140 300C160 286 170 276 172 268L392 266L400 300Z' },
    { c: PAL.sky, o: 0.14, d: 'M150 60C170 24 260 18 300 34C350 14 400 30 400 70L400 120C360 130 300 120 250 112C200 124 160 110 150 90C146 80 146 70 150 60Z' },
    { c: PAL.ochre, o: 0.5, d: mill },
    { c: PAL.terracotta, o: 0.7, d: `${millCap}${millDoor}Z` },
    { c: PAL.paper, o: 1, d: sailCloth },
    { c: PAL.grey, o: 0.4, d: sailCloth },
  ],
  lines: [ground, mill, millCap, sails],
  fine: [hill, sailCloth, millDoor, hatch(10, 284, 390, 286, 12, 7, 165, 4), tufts([[20, 268], [140, 268], [380, 266]], 9, 5), reins, puffs, 'M66 100c3 -4 8 -4 10 0M90 80c3 -4 8 -4 10 0'],
  parts: [
    place(horse(), H),
    place(king({ mood: 'happy', tilt: -6, arms: KING_ARMS.reins, riding: true }), K),
    place(miller({ bow: 52, mood: 'smile' }), M),
  ],
});
