import { PAL, hatch } from '../lib.mjs';
import { GB_ARMS, GB_LEGS, compose, dot, gingerbread, place } from './characters.mjs';

// The Gingerbread Man, 1 (cover): the door of the old cottage stove drops open, warm light glows
// inside, and — hop! — the smiling Gingerbread Man jumps out into the kitchen.
const GY = 262;
// the floor line stops behind the open oven door
const floor = `M0 ${GY}C12 ${GY - 1} 24 ${GY} 36 ${GY}M204 ${GY + 1}C240 ${GY + 1} 270 ${GY} 300 ${GY - 1}C340 ${GY - 2} 370 ${GY} 400 ${GY - 1}`;
// the stove: an iron range its stovepipe going up out of the picture
const body = 'M42 102L194 102L196 250L40 250Z';
const top = 'M32 92L204 92L204 102L32 102Z';
const pipe = 'M142 92L142 0M164 92L164 0M138 30L168 30';
const oven = 'M62 140L176 140L176 226L62 226Z';
// the oven door has dropped open on its hinge, towards us
const door = 'M62 226L176 226L200 270L38 270Z';
const handle = 'M90 277L148 277M96 270L96 277M142 270L142 277';
const firebox = 'M68 110L120 110L120 132L68 132Z';
const slits = 'M76 116L76 126M84 116L84 126M92 116L92 126M100 116L100 126M108 116L108 126';
const knobs = `${dot(146, 116, 5)}${dot(170, 116, 5)}`;
const tray = 'M70 216L168 216';
// the warm smell, curling out of the oven
const smell = 'M210 142c-6 -8 6 -12 0 -20s6 -12 0 -20M226 132c-6 -8 6 -12 0 -20s6 -12 0 -20';
// his jump: a dotted arc from the oven, and little "hop!" marks under his feet
const arc = 'M150 196C190 140 230 150 256 176';
const hop = 'M262 230l-10 8M278 236l-3 11M296 234l5 10M312 226l10 6';
// the stove's iron, with the oven's mouth left open
const iron = `M42 102L194 102L196 250L40 250ZM32 92L204 92L204 102L32 102ZM142 0L164 0L164 92L142 92Z${oven}`;
const GB = 'translate(286 210) rotate(10) scale(1.45)';

export default compose({
  title: 'The Gingerbread Man',
  seed: 61,
  washes: [
    { c: PAL.ochre, o: 0.3, d: `M0 ${GY - 2}C80 ${GY - 4} 200 ${GY} 300 ${GY - 3}C340 ${GY - 4} 370 ${GY - 2} 400 ${GY - 3}L400 300L0 300Z` },
    { c: PAL.slate, o: 0.8, d: iron, rule: 'evenodd' },
    { c: PAL.ink, o: 0.3, d: iron, rule: 'evenodd' },
    { c: PAL.ochre, o: 0.95, d: oven },
    { c: PAL.terracotta, o: 0.7, d: 'M62 140L176 140L176 226L62 226ZM74 152L164 152L164 216L74 216Z', rule: 'evenodd' },
    { c: PAL.slate, o: 0.75, d: door },
    { c: PAL.ochre, o: 0.6, d: 'M70 232L168 232L188 264L50 264Z' },
    { c: PAL.ochre, o: 0.9, d: `M88 275L150 275L150 279L88 279Z${knobs}` },
    { c: PAL.red, o: 0.6, d: 'M68 110L120 110L120 132L68 132Z' },
  ],
  lines: [floor, body, top, pipe, oven, door],
  fine: [handle, firebox, slits, knobs, tray, smell, hatch(214, 282, 386, 284, 8, 7, 172, 7), hatch(4, 284, 30, 286, 2, 7, 172, 9)],
  once: `<path d="${arc}" stroke-dasharray="1 7"/><path d="${hop}"/>`,
  parts: [place(gingerbread({ arms: GB_ARMS.up, legs: GB_LEGS.hop, mood: 'laugh' }), GB)],
});
