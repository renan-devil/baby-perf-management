import { PAL, hatch } from '../lib.mjs';
import { MOTHER_ARMS, compose, fanchon, frog, mother, oval, place } from './characters.mjs';

// Diamonds and Toads, 4: back home, Fanchon opens her mouth, and croak! out jumps a big green frog,
// then fat brown toads. Frogs on the table, a toad in the soup, a frog on Mother's shoe. Eek!
const FT = 'translate(104 262) scale(1.5)';
const MT = 'translate(312 262) scale(1.5)';

const floor = 'M0 262C100 258 220 265 300 260C340 258 372 260 400 259';
// the kitchen table with a bowl of soup
const tableTop = 'M168 210L246 210L248 218L166 218Z';
const tableLegs = 'M172 218L172 260M178 218L178 258M236 218L236 258M242 218L242 260';
const bowl = 'M186 198C186 212 214 212 214 198Z';
const soup = oval(200, 198, 14, 3.2);
const steam = 'M194 190q-4 -6 0 -12M204 188q4 -6 0 -12';

const frogs = [
  // the frog jumping out of her mouth, and the next one just behind it
  [{ leap: true }, 'translate(152 110) rotate(-20) scale(1.45)'],
  [{ toad: true, leap: true }, 'translate(196 150) rotate(28) scale(1.25)'],
  // on the table, in the soup, on the floor, on Mother's shoe
  [{}, 'translate(230 210) scale(1.15)'],
  [{ toad: true }, 'translate(200 200) scale(0.95)'],
  [{ toad: true }, 'translate(140 262) scale(1.25)'],
  [{}, 'translate(206 262) scale(1.2)'],
  [{}, 'translate(296 255) scale(1.15)'],
  [{}, 'translate(44 262) scale(1.15)'],
];

export default compose({
  title: 'Diamonds and Toads',
  seed: 4104,
  washes: [
    { c: PAL.ochre, o: 0.32, d: 'M0 258C100 254 220 261 300 256C340 254 372 256 400 255L400 300L0 300Z' },
    { c: PAL.terracotta, o: 0.55, d: `${tableTop}M172 218L178 218L178 258L172 260ZM236 218L242 218L242 260L236 258Z` },
    { c: PAL.sky, o: 0.6, d: `${bowl}${soup}` },
    { c: PAL.ochre, o: 0.6, d: soup },
  ],
  lines: [floor, tableTop, tableLegs, bowl],
  fine: [
    soup,
    steam,
    hatch(20, 280, 380, 276, 12, 10, 175, 5),
    // hop lines behind the jumping frogs, splash drops from the soup
    'M126 122l-8 -1M128 114l-8 -4M164 136l-8 -3M162 128l-7 -6',
    'M28 240l4 6M38 236l1 7',
    'M188 190l-4 -5M212 190l4 -5',
    // eek! shock marks by Mother
    'M354 104l8 -6M358 116l10 -1M350 92l4 -9M262 108l-8 -6M258 120l-10 -1',
  ],
  parts: [
    place(
      fanchon({
        mood: 'eek',
        arms: [
          [[-11, -80, 7], [-24, -76, 6.5], [-36, -82, 6.5]],
          [[11, -80, 7], [24, -76, 6.5], [36, -82, 6.5]],
        ],
      }),
      FT,
    ),
    place(mother({ mood: 'eek', arms: MOTHER_ARMS.up, tilt: 8 }), MT),
    ...frogs.map(([o, t]) => place(frog(o), t)),
  ],
});
