import { PAL, hatch, tufts } from '../lib.mjs';
import { M_POSE, at, compose, monkey, place, ripple, swimCroc, tree } from './characters.mjs';

// The Monkey and the Crocodile, 5: safe at the very top of his rose-apple tree, the monkey laughs and
// waves, one hand on his heart, boom-boom; down in the water the crocodile hangs his head, ashamed.
const TT = 'translate(104 250) scale(0.8)';
const top = at(8, -207, TT);
const MT = `translate(${top[0]} ${top[1]}) scale(1.3)`;
const CT = 'translate(244 236) scale(-1.15 1.15)';

const bank = 'M0 250C40 248 90 250 130 254C152 256 164 264 170 274C176 284 178 292 182 300';
const bankFill = 'M0 250C40 248 90 250 130 254C152 256 164 264 170 274C176 284 178 292 182 300L0 300Z';
const river = 'M140 222C220 218 300 222 400 218L400 300L182 300C178 292 176 284 170 274C164 264 152 256 130 254Z';
// his heart going boom-boom: little beat marks by his hand
const beats = (([x, y]) => `M${x + 6} ${y - 6}l4 -3M${x + 7} ${y}l5 0M${x + 6} ${y + 6}l4 3`)(at(12, -15, MT));
// a tear under the crocodile's heavy eyelid, and gloomy marks over his hung head
const HT = `${CT} rotate(20)`;
const [tx, ty] = at(13, -11, HT);
const tear = `M${tx} ${ty}C${tx - 3} ${ty + 5} ${tx - 3} ${ty + 9} ${tx} ${ty + 9}C${tx + 3} ${ty + 9} ${tx + 3} ${ty + 5} ${tx} ${ty}Z`;
const [gx, gy] = at(18, -36, HT);
const gloom = `M${gx - 12} ${gy - 2}q2 -6 -1 -10M${gx} ${gy - 6}q2 -6 -1 -10M${gx + 12} ${gy - 2}q2 -6 -1 -10`;
// the crocodile's sad little ripples
const sad = 'M188 260C196 263 206 263 214 260M284 262C296 265 310 264 320 261';

export default compose({
  title: 'Safe at the top of the tree',
  seed: 705,
  washes: [
    { c: PAL.sky, o: 0.5, d: river },
    { c: PAL.green, o: 0.4, d: bankFill },
    { c: PAL.sky, o: 0.85, d: tear },
  ],
  lines: [bank],
  fine: [
    beats,
    sad,
    tear,
    gloom,
    ripple(360, 238, 22),
    ripple(230, 286, 26),
    ripple(350, 284, 24),
    ripple(210, 236, 18),
    hatch(10, 276, 140, 276, 9, 6, 160, 4),
    tufts([[24, 250], [150, 258]], 9, 6),
  ],
  parts: [
    place(tree(), TT),
    place(swimCroc({ mood: 'ashamed', head: 'rotate(20)', short: true }), CT),
    place(monkey({ mood: 'laugh', pose: M_POSE.safe }), MT),
  ],
});
