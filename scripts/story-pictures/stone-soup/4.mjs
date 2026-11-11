import { PAL, hatch, tufts } from '../lib.mjs';
import { compose, girl, place, pot, spoon, steam, traveller } from './characters.mjs';

// Stone Soup, 4: the pot is full to the top with cabbage, carrots, potatoes, onions and parsley, and
// steam curls up. The traveller tastes it with his eyes shut ("Mmm!"), and the little girl, eyes shut
// too, sniffs the wonderful smell drifting over to her.
const ground = 'M0 272C90 268 190 274 290 270C340 268 370 271 400 269';
const G = 'translate(80 272) scale(1.5)';
const P = 'translate(202 268) scale(1.15)';
const T = 'translate(332 272) scale(1.1)';

// the smell drifts over to the girl's nose in a long curl
const smell = 'M152 108C136 100 128 114 136 122C144 130 132 142 122 136C112 130 112 146 104 150';
const smell2 = 'M156 124C144 120 140 130 146 136C152 144 142 152 132 148';

export default compose({
  title: 'Mmm! A wonderful smell',
  seed: 77,
  washes: [{ c: PAL.ochre, o: 0.35, d: 'M0 268C90 264 190 270 290 266C340 264 370 267 400 265L400 296C300 300 100 298 0 296Z' }],
  lines: [ground],
  fine: [smell, smell2, hatch(14, 284, 386, 286, 12, 8, 172, 4), tufts([[20, 270], [386, 268]], 9, 6)],
  parts: [
    place(
      girl({
        mood: 'sniff',
        tilt: 12,
        arms: [
          [[-12, -62, 7], [-17, -52, 6.5], [-13, -43, 6.5], [-5, -40, 6.5]],
          [[12, -62, 7], [17, -52, 6.5], [13, -43, 6.5], [5, -40, 6.5]],
        ],
      }),
      G,
    ),
    place(pot({ inside: 'full' }), P),
    place(steam(3, 46), 'translate(204 70)'),
    place(
      traveller({
        mood: 'mmm',
        tilt: -4,
        arms: [
          [[-22, -108, 11], [-30, -98, 10], [-36, -88, 10], [-36, -82, 10]],
          [[22, -108, 11], [28, -90, 10], [30, -72, 10], [29, -62, 10]],
        ],
      }),
      T,
    ),
    place(spoon(66), 'translate(292 182) rotate(-152)'),
  ],
});
