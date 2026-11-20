import { PAL, hatch } from '../lib.mjs';
import { MOTHER_CUP, at, compose, mother, place, rabbitHead, teacup } from './characters.mjs';

// The Tale of Peter Rabbit, 5: back home in the sandy rabbit hole under the big fir tree, Peter is
// tucked up in bed, and his Mother brings him a cup of camomile tea.
const floor = 'M8 266C110 263 230 267 392 264';

// The burrow: a round sandy room, with the fir tree's roots poking through its ceiling
const arch = 'M2 280C-8 150 60 40 200 32C340 40 408 150 398 280';
const outside = 'M0 0L400 0L400 300L0 300Z';
const trunk = 'M170 0C172 12 166 22 150 32M230 0C228 12 234 22 250 32';
const roots = 'M150 36C146 50 150 62 144 74M186 33C188 46 184 56 188 66M222 34C220 48 226 58 222 72M262 40C266 52 262 62 268 72M110 50C104 62 106 70 100 78';
const pebbles = 'M14 200l4 -2M388 210l-4 -2M46 110l3 -3M352 104l-3 -3';

// Peter's little bed: headboard, mattress, footboard, a white pillow and a patchwork blanket
const bedFrame = 'M26 266L26 150C26 138 52 138 52 150L52 266M26 184L52 184M52 232L242 232M240 266L240 198C240 188 258 188 258 198L258 266M52 250L240 250';
const pillow = 'M78 186C62 184 52 194 54 208C56 222 76 228 104 226';
const blanket = 'M104 212C130 188 192 184 230 196C242 202 248 218 248 240C200 248 130 248 96 240C92 228 94 220 104 212Z';
const patches = 'M140 196L142 245M180 190L182 246M216 192L218 244M98 222C140 219 200 218 246 220';
const paw = 'M118 212C114 202 124 198 130 203C134 208 132 214 126 215';
const PETER = 'translate(96 196) rotate(-8) scale(1.7)';

// Mother, standing on the right and holding out the tea
const MOM = 'translate(332 266) scale(1.12)';
const [cx, cy] = at(MOM, ...MOTHER_CUP);

export default compose({
  title: 'Peter in bed, and his mother brings him camomile tea',
  seed: 85,
  washes: [
    { c: PAL.ochre, o: 0.5, d: outside + arch + 'Z', rule: 'evenodd' },
    { c: PAL.terracotta, o: 0.3, d: outside + arch + 'Z', rule: 'evenodd' },
    { c: PAL.ochre, o: 0.4, d: 'M2 266C110 263 230 267 398 264L400 300L0 300Z' },
    { c: PAL.terracotta, o: 0.55, d: 'M150 32C166 22 172 12 170 0L230 0C228 12 234 22 250 32Z' },
    { c: PAL.ochre, o: 0.65, d: 'M26 266L26 150C26 138 52 138 52 150L52 266ZM52 232L242 232L242 250L52 250ZM240 266L240 198C240 188 258 188 258 198L258 266Z' },
    { c: PAL.rose, o: 0.7, d: blanket },
    { c: PAL.sky, o: 0.5, d: 'M140 194L180 189L181 220L141 221ZM181 220L217 219L218 244L182 246Z' },
    { c: PAL.grey, o: 0.6, d: paw + 'Z' },
  ],
  lines: [floor, arch, trunk, bedFrame, pillow, blanket],
  fine: [roots, pebbles, patches, paw, hatch(30, 280, 370, 282, 10, 6, 165, 2), hatch(176, 10, 226, 10, 3, 10, 100, 4)],
  parts: [
    place(rabbitHead({ mood: 'sleepy', ears: -20, earSpread: 20 }), PETER),
    place(mother(), MOM),
    place(teacup(), `translate(${cx} ${cy}) scale(1.1)`),
  ],
});
