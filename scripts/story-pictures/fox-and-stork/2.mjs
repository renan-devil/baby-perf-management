import { PAL, hatch, tufts } from '../lib.mjs';
import { compose, fox, jar, place, stork } from './characters.mjs';

// The Fox and the Stork, 2: dinner at Stork's house. Stork dips her long beak right down into a
// tall jar, gulp, gulp, while Fox, at his own jar, can only sniff at the top.
const ground = 'M0 272C80 268 180 274 280 270C330 268 370 271 400 269';
const reeds = 'M380 270C378 230 382 200 376 170M390 270C392 240 388 214 394 190M370 270C366 246 360 230 354 218';
const reedHeads = 'M374 172C370 160 372 148 378 146C382 152 380 164 376 172ZM392 192C390 182 392 172 397 170C400 176 398 186 394 192Z';
// sniff, sniff: little curls at the fox's nose; gulp: marks on the stork's neck
const sniff = 'M146 140c-4 -3 -4 -8 0 -11M138 146c-5 -2 -6 -7 -3 -11';

export default compose({
  title: 'Dinner at Stork’s house',
  seed: 72,
  washes: [
    { c: PAL.green, o: 0.38, d: 'M0 268C80 264 180 270 280 266C330 264 370 267 400 265L400 300L0 300Z' },
    { c: PAL.green, o: 0.6, d: 'M378 270C376 230 380 200 374 172L378 172C384 200 380 230 382 270ZM388 270C390 240 386 214 392 192L396 192C390 214 394 240 392 270Z' },
    { c: PAL.terracotta, o: 0.7, d: reedHeads },
  ],
  lines: [ground, reeds],
  fine: [reedHeads, sniff, hatch(20, 284, 380, 286, 14, 6, 160, 6), tufts([[30, 271], [200, 272], [340, 271]], 9, 8)],
  parts: [
    place(jar(158, 271, 114), ''),
    place(jar(232, 271, 114), ''),
    place(fox(), 'translate(92 272)'),
    place(stork(0.68), 'translate(319 272) scale(-0.95 0.95)'),
  ],
});
