import { PAL, tufts } from '../lib.mjs';
import { compose, cottage, place, wolf } from './characters.mjs';

// Little Red Riding Hood, 5: the wolf knocks at the door of Grandmother's little cottage, under its
// three big oak trees. Knock, knock, knock!
const ground = 'M0 258C90 254 200 260 300 256C350 254 380 257 400 255';
// knock marks round his fist on the door
const knocks = 'M190 152l6 -7M194 164l10 -1M190 176l7 6';
// the three oaks: one on the left, one behind the roof and one on the right; the crowns of the last
// two run down to the roof, which hides their trunks
const leftTrunk = 'M36 256C40 200 36 150 40 112M58 256C54 200 58 150 54 112';
const leftCrown = 'M10 112C-8 108 -12 82 4 72C-4 50 14 30 36 36C44 16 76 14 86 32C104 30 114 52 104 68C116 84 104 108 86 108C76 120 56 122 46 114C34 122 18 120 10 112Z';
const backCrown =
  'M190 104C170 104 150 96 152 80C136 70 142 46 162 44C160 22 186 10 204 20C212 0 244 -4 258 10C272 -2 304 0 312 18C330 10 352 18 356 34C372 30 396 40 398 60C410 76 402 100 388 104C384 116 372 122 362 118C358 124 354 126 352 125';
const backCrownFill = `${backCrown}L298 63L226 63Z`;
const rightTrunk = 'M368 256C370 210 366 160 370 122M388 256C384 210 388 160 386 118';
const marks = 'M30 60c3 -5 8 -5 10 0M64 84c3 -5 8 -5 10 0M180 40c3 -5 8 -5 10 0M240 24c3 -5 8 -5 10 0M290 30c3 -5 8 -5 10 0M360 60c3 -5 8 -5 10 0M380 90c3 -5 8 -5 10 0';
const lobes = 'M204 20C198 30 198 40 204 48M312 18C306 28 306 38 312 46M356 34C350 44 352 54 360 60';

export default compose({
  title: 'Knock, knock, knock',
  seed: 113,
  washes: [
    { c: PAL.green, o: 0.4, d: 'M0 254C90 250 200 256 300 252C350 250 380 253 400 251L400 300L0 300Z' },
    { c: PAL.green, o: 0.66, d: `${backCrownFill}${leftCrown}` },
    { c: PAL.ochre, o: 0.55, d: 'M36 256C40 200 36 150 40 116L54 116C58 150 54 200 58 256ZM368 256C370 210 366 160 370 124L386 120C388 160 384 210 388 256Z' },
  ],
  lines: [ground, leftTrunk, leftCrown, backCrown, rightTrunk],
  fine: [knocks, marks, lobes, tufts([[20, 257], [100, 258], [396, 255]], 9, 7), 'M80 280c4 -2 8 -2 12 0M300 278c4 -2 8 -2 12 0'],
  parts: [
    place(cottage(), 'translate(262 258) scale(1.3)'),
    place(wolf({ pose: 'knock', mouth: 'grin' }), 'translate(126 260) scale(0.86)'),
  ],
});
