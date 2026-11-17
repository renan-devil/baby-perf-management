import { PAL, tufts } from '../lib.mjs';
import { compose, cottage, place, wolf } from './characters.mjs';

// Little Red Riding Hood, 5: the wolf knocks at the door of Grandmother's little cottage, under its
// three big oak trees. Knock, knock, knock!
const ground = 'M0 258C90 254 200 260 300 256C350 254 380 257 400 255';
// knock marks by his fist on the door
const knocks = 'M168 160c-5 -5 -5 -12 0 -17M162 166c-8 -8 -8 -22 0 -30M156 172c-11 -11 -11 -31 0 -42';
// the three oaks behind the cottage: three trunks rising from behind the roof into three big round
// crowns
const crowns =
  'M150 96C130 92 126 66 146 58C140 36 162 20 182 28C190 8 216 2 232 14C246 -2 280 -2 292 14C310 4 336 12 338 30C358 26 376 46 366 64C384 74 378 100 358 102C350 116 330 118 318 108C306 118 286 116 280 104C270 110 256 108 250 100C240 112 216 112 208 100C196 110 174 108 168 98C162 102 154 100 150 96Z';
const crownLobes = 'M182 28C176 40 178 52 186 60M292 14C286 26 286 40 292 48M208 100C214 92 222 88 232 88M280 104C286 96 296 92 306 94';
const trunks = 'M188 128L190 100M206 112L206 100M330 128L328 104M314 112L314 104M254 92L254 106M268 92L268 106';
const crownMarks = 'M170 70c3 -5 8 -5 10 0M220 40c3 -5 8 -5 10 0M276 56c3 -5 8 -5 10 0M330 60c3 -5 8 -5 10 0M240 80c3 -5 8 -5 10 0';

export default compose({
  title: 'Knock, knock, knock',
  seed: 113,
  washes: [
    { c: PAL.green, o: 0.4, d: 'M0 254C90 250 200 256 300 252C350 250 380 253 400 251L400 300L0 300Z' },
    { c: PAL.green, o: 0.66, d: crowns },
    { c: PAL.ochre, o: 0.6, d: 'M188 128L190 100L206 100L206 112ZM330 128L328 104L314 104L314 112Z' },
  ],
  lines: [ground, crowns, trunks],
  fine: [knocks, crownLobes, crownMarks, tufts([[20, 257], [100, 258], [390, 255]], 9, 7), 'M60 280c4 -2 8 -2 12 0M300 278c4 -2 8 -2 12 0'],
  parts: [
    place(cottage(), 'translate(262 258) scale(1.3)'),
    place(wolf({ pose: 'knock', mouth: 'grin' }), 'translate(118 260) scale(0.86)'),
  ],
});
