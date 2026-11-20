import { PAL, hatch, transformPath } from '../lib.mjs';
import { ANNIE_ARMS, LM_HEAD_SHAPE, annie, compose, doorway, dot, lmHead, place, straw, wheel, windowArch } from './characters.mjs';

// Rumpelstiltskin, 3: shut in the room full of straw, Annie sits on a pile of straw and cries, for she
// cannot spin straw into gold. Creak! The door opens, and a funny little man peeps in.
const floor = 'M0 272C90 269 200 274 300 271C340 270 370 272 400 271';

// the door, opened a little way into the room on its hinges (on the right)
const DX = 306;
const DW = 74;
const leaf = `M${DX + DW} 272L${DX + DW} ${130 + DW / 2}C${DX + DW} 150 ${DX + DW - 10} 138 ${DX + DW - 20} 136L${DX + 44} 150L${DX + 44} 286Z`;
const planks = `M${DX + 52} 152L${DX + 52} 284M${DX + 62} 146L${DX + 62} 280`;
const creak = `M${DX + 84} 150c3 -3 3 -6 0 -9M${DX + 90} 154c5 -5 5 -12 0 -17M${DX + 84} 252c3 -3 3 -6 0 -9M${DX + 90} 256c5 -5 5 -12 0 -17`;
// the little man's head peeping round the door, his hand on its edge
const P = `translate(${DX + 24} ${272 - 66}) rotate(-16) scale(1.3)`;
const hand = dot(DX + 42, 196, 4);

export default compose({
  title: 'The little man peeps in at Annie crying on the straw',
  seed: 83,
  washes: [
    { c: PAL.slate, o: 0.16, d: 'M8 40C20 14 140 10 220 12C320 14 392 22 394 80C398 160 396 230 392 272L6 272C2 200 0 120 8 40Z' },
    { c: PAL.terracotta, o: 0.22, d: 'M0 270C100 267 200 272 300 269C340 268 370 270 400 269L400 294C300 296 100 295 0 294Z' },
    { c: PAL.terracotta, o: 0.7, d: leaf },
    { c: PAL.ochre, o: 0.35, d: leaf },
    { c: PAL.green, o: 0.8, d: hand },
  ],
  lines: [floor, leaf],
  fine: [hatch(14, 284, 384, 286, 12, 8, 172, 4), planks, creak, hand, `M${DX + 48} 214a2 2 0 1 0 0.1 0`],
  parts: [
    windowArch(170, 30, 42, 56),
    doorway(DX, 130, DW, 272, transformPath(LM_HEAD_SHAPE, P)),
    place(lmHead({ mood: 'sly' }), P),
    place(straw(90, 100, 17), 'translate(22 274)'),
    place(wheel({ gold: false }), 'translate(112 272) scale(0.95)'),
    place(straw(146, 32, 21, 114), 'translate(228 274)'),
    place(annie({ mood: 'cry', sit: true, arms: ANNIE_ARMS.cry, tilt: -6 }), 'translate(228 287) scale(1.42)'),
  ],
});
