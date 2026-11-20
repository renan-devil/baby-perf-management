import { PAL, hatch } from '../lib.mjs';
import { KING_ARMS, compose, doorway, goldHeap, king, place, shine, spool, sparkles, windowArch } from './characters.mjs';

// Rumpelstiltskin, 4: in the morning the King opens the door, and his mouth falls open: the room is
// full of shining golden thread, in heaps and on spools, where the straw was.
const floor = 'M0 272C90 269 200 274 300 271C340 270 370 272 400 271';
// the door, swung open into the room on its hinges (the right side of the doorway)
const leaf = 'M80 272L80 156L104 144L104 286Z';
const planks = 'M88 154L88 280M96 150L96 283';
const K = 'translate(154 270) scale(1.24)';

export default compose({
  title: 'The King opens the door and sees the room full of gold',
  seed: 84,
  washes: [
    { c: PAL.ochre, o: 0.14, d: 'M8 40C20 14 140 10 220 12C320 14 392 22 394 80C398 160 396 230 392 272L6 272C2 200 0 120 8 40Z' },
    { c: PAL.terracotta, o: 0.22, d: 'M0 270C100 267 200 272 300 269C340 268 370 270 400 269L400 294C300 296 100 295 0 294Z' },
    { c: PAL.ochre, o: 0.18, d: 'M200 280C210 200 260 150 320 150C370 150 400 180 400 200L400 290Z' },
    { c: PAL.terracotta, o: 0.7, d: leaf },
    { c: PAL.ochre, o: 0.35, d: leaf },
  ],
  lines: [floor, leaf],
  fine: [hatch(14, 284, 384, 286, 12, 8, 172, 4), planks, shine(314, 226, 72, 98, 9, 205, 335), shine(220, 258, 30, 46, 5, 215, 325)],
  parts: [
    windowArch(200, 34, 44, 58, { night: false }),
    doorway(8, 120, 66, 272),
    place(goldHeap(180, 84, 5), 'translate(318 274)'),
    place(spool(), 'translate(292 214) scale(1.1)'),
    place(spool(), 'translate(340 222) scale(1.1)'),
    place(spool(), 'translate(316 196) scale(1.1)'),
    place(goldHeap(60, 28, 9), 'translate(220 284)'),
    place(spool(), 'translate(196 294) scale(1.3)'),
    place(spool(), 'translate(380 294) scale(1.3)'),
    place(spool(), 'translate(262 296) scale(1.2)'),
    place(king({ mood: 'wow', arms: KING_ARMS.door }), K),
    sparkles([[244, 140, 8], [366, 118, 7], [300, 108, 5], [204, 200, 6], [392, 176, 5], [270, 176, 4]]),
  ],
});
