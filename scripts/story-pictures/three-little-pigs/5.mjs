import { PAL, hatch, tufts } from '../lib.mjs';
import { brickHouse, compose, dot, pig, place, wolf } from './characters.mjs';

// The Three Little Pigs, 5: OW! OW! OWWW! The wolf shoots back up the chimney like a rocket, holding
// his hot red bottom, while the three little pigs hold hands and dance in the garden.
const ground = 'M0 258C100 254 200 260 300 256C350 254 380 257 400 255';
const HT = 'translate(100 257) scale(0.7)';
// The wolf, rocketing up out of the chimney (chimney top at about 127, 153)
const WT = 'translate(134 112) rotate(4) scale(0.64)';
// Puffs of steam from the chimney and from his bottom, and lines of speed
const steam =
  'M116 152C108 152 106 142 114 140C112 132 122 128 127 134C130 126 142 126 144 134C152 132 156 142 150 146C154 152 146 158 140 154C134 160 122 158 116 152Z' +
  'M112 126C106 126 106 118 112 118C112 112 120 112 122 116C128 114 130 122 126 125C124 130 116 130 112 126Z' +
  'M134 120C130 120 130 114 134 114C135 110 141 110 142 114C146 114 146 120 142 121C140 124 136 124 134 120Z' +
  'M98 108C94 108 94 102 98 102C99 98 105 98 106 102C110 102 110 108 106 109C104 112 100 112 98 108Z';
// wisps of steam from his hot bottom, sweat drops, and lines of speed
const wisps = 'M102 92c-4 -4 4 -8 0 -12M92 98c-5 -3 2 -8 -2 -12M110 80c-4 -4 3 -8 0 -12';
const drops = 'M160 18c-3 4 -3 7 0 7c3 0 3 -3 0 -7ZM172 12c-2 3 -2 5 0 5c2 0 2 -2 0 -5Z';
const speed = 'M80 50l0 22M70 24l0 18M186 60l0 20M198 34l0 18M88 6l0 14';
// A little eighth note, as path data, at (x, y) = the note head
const note = (x, y) => `M${x + 4} ${y}l0 -16q6 3 8 9`;
const notes = note(278, 150) + note(340, 132);
const noteHeads = dot(276, 151, 3.4) + dot(338, 133, 3.4);
// Flowers in the garden
const flowers = 'M232 256l0 -16M392 256l0 -14M214 256l-2 -12';
const petals = dot(232, 238, 5) + dot(392, 240, 4.5) + dot(212, 242, 4);

const S = 0.8;
export default compose({
  title: 'Like a rocket',
  seed: 45,
  washes: [
    { c: PAL.green, o: 0.4, d: 'M0 254C100 250 200 256 300 252C350 250 380 253 400 251L400 296C300 300 100 298 0 296Z' },
    { c: PAL.grey, o: 0.3, d: steam },
    { c: PAL.sky, o: 0.7, d: drops },
  ],
  after: [
    { c: PAL.red, o: 0.8, d: petals.slice(0, petals.indexOf('Z') + 1) },
    { c: PAL.ochre, o: 0.85, d: petals.slice(petals.indexOf('Z') + 1) },
  ],
  lines: [ground, flowers],
  fine: [
    steam,
    speed,
    wisps,
    drops,
    notes,
    petals,
    hatch(20, 274, 380, 276, 11, 8, 170, 10),
    tufts([[14, 257], [196, 258], [300, 256], [384, 255]], 9, 11),
  ],
  fills: noteHeads.replace(/(M[^Z]*Z)/g, '<path d="$1"/>'),
  parts: [
    place(brickHouse(), HT),
    place(wolf({ pose: 'ow' }), WT),
    place(pig({ scarf: PAL.green, arms: ['up', 'out'], mouth: 'open' }), `translate(254 258) scale(${S})`),
    place(pig({ scarf: PAL.sky, arms: ['out', 'out'], legs: 'jump', mouth: 'open' }), `translate(313 250) scale(${S})`),
    place(pig({ scarf: PAL.slate, arms: ['out', 'wave'], mouth: 'open' }), `translate(372 258) scale(${S})`),
  ],
});
