import { PAL } from '../lib.mjs';
import { bed, boyHead, compose, place, rabbit } from './characters.mjs';

// The Velveteen Rabbit, 7: the Boy is ill in bed, his face hot and his cheeks burning
// red; the velveteen rabbit snuggles beside him on the pillow and never leaves him. On the little
// table stand his medicine and a spoon.
const BT = 'translate(246 225) scale(1.55)';
const table = 'M318 212L394 212M322 212L326 290M390 212L386 290M318 212L318 204L394 204L394 212';
const bottle = 'M340 204L340 176C340 170 344 168 346 166L346 156L354 156L354 166C356 168 360 170 360 176L360 204Z';
const cork = 'M345 156L345 148L355 148L355 156';
const label = 'M341 184L359 184L359 194L341 194Z';
const spoon = 'M368 202C366 198 370 194 375 196C379 198 378 202 374 203ZM375 200L392 200';
// heat rising from his hot head
const heat = 'M126 140c-3 -5 3 -8 0 -13c-3 -5 3 -8 0 -13M144 134c-3 -5 3 -8 0 -13c-3 -5 3 -8 0 -13M162 140c-3 -5 3 -8 0 -13c-3 -5 3 -8 0 -13';

export default compose({
  title: 'The Boy ill in bed, with the rabbit on his pillow',
  seed: 4207,
  washes: [
    { c: PAL.ochre, o: 0.5, d: 'M318 204L394 204L394 212L318 212Z' + 'M322 212L326 290L330 290L327 212ZM390 212L386 290L382 290L386 212Z' },
    { c: PAL.terracotta, o: 0.3, d: 'M318 204L394 204L394 212L318 212Z' },
    { c: PAL.slate, o: 0.55, d: bottle },
    { c: PAL.ochre, o: 0.6, d: cork },
  ],
  whites: label,
  lines: [table, bottle],
  fine: [cork, label, spoon, heat],
  parts: [
    place(bed({ qx: -64, qy: -7, hump: 22, F: 40 }), BT),
    place(rabbit({ mood: 'look', look: [1.4, 0.6] }), 'translate(78 214) rotate(4) scale(0.8)'),
    place(boyHead({ mood: 'ill' }), 'translate(142 192) rotate(-8) scale(1.75)'),
  ],
});
