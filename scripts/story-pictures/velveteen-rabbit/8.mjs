import { PAL, tufts } from '../lib.mjs';
import { compose, place, rabbit } from './characters.mjs';

// The Velveteen Rabbit, 8: grown old and shabby, the little rabbit has been put out in an old sack
// behind the garden shed. He peeps out of it, and a real tear rolls down his velveteen nose.
const ground = 'M0 266C90 263 200 267 300 264C340 263 370 265 400 264';
// the shed's plank wall and the edge of its roof
const shed = 'M280 265L280 70M280 70L400 40M272 72L400 34';
const planks = 'M304 265L304 66M328 265L328 60M352 265L352 54M376 265L376 48M290 120l0 14M316 180l0 16M342 110l0 12M364 200l0 14M388 140l0 12';
// the old sack, its mouth open round the rabbit
const sack = 'M140 199C118 214 102 246 110 267C150 273 214 273 252 267C260 246 244 214 222 199';
const rim = 'M138 199C150 206 166 205 180 203C196 205 212 206 224 199';
const folds = 'M150 224C146 238 146 252 150 262M210 222C216 236 218 250 214 262M178 240C176 248 178 256 182 264M146 204l6 10M158 205l2 8M206 205l-2 8M218 203l-6 10';
const rope = 'M222 202C232 206 236 216 230 226M230 226l-3 6M230 226l2 6M222 202C230 200 236 196 238 190';
const patch = 'M226 236L246 232L248 250L228 254Z';
const stitches = 'M226 240l-3 0M227 246l-3 0M246 236l3 0M247 244l3 0';
const sackFill = `${sack}C210 206 196 205 180 203C166 205 150 206 140 199Z`;

export default compose({
  title: 'The shabby rabbit in the old sack',
  seed: 4208,
  washes: [
    { c: PAL.green, o: 0.3, d: 'M0 262C90 259 200 263 300 260C340 259 370 261 400 260L400 300L0 300Z' },
    { c: PAL.terracotta, o: 0.4, d: 'M280 265L280 70L400 40L400 264Z' },
    { c: PAL.grey, o: 0.35, d: 'M280 265L280 70L400 40L400 264Z' },
    { c: PAL.slate, o: 0.6, d: 'M272 72L400 34L400 40L280 70Z' },
    { c: PAL.ochre, o: 0.5, d: sackFill },
    { c: PAL.grey, o: 0.4, d: sackFill },
    { c: PAL.terracotta, o: 0.5, d: patch },
  ],
  lines: [ground, shed, sack],
  fine: [planks, rim, folds, rope, patch, stitches, tufts([[20, 266], [60, 266], [96, 266], [266, 266], [300, 264], [356, 264], [392, 264]], 13, 8)],
  parts: [place(rabbit({ mood: 'sad', shabby: true, upper: true, look: [0, 0] }), 'translate(180 230) rotate(-4) scale(1.3)')],
});
