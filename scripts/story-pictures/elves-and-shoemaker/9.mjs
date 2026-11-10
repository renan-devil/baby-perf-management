import { PAL, hatch } from '../lib.mjs';
import { ELF_ARMS, ELF_LEGS, bench, candle, compose, elf, note, place } from './characters.mjs';

// The Elves and the Shoemaker, 9: the two elves find the tiny clothes, put them on and dance for joy
// on the workbench, in green coats, woolly hats and little shoes with buckles.
const floor = 'M0 272C90 269 200 274 300 271C340 270 370 272 400 271';

export default compose({
  title: 'Dancing for joy',
  seed: 129,
  washes: [
    { c: PAL.slate, o: 0.24, d: 'M4 20C80 8 300 10 396 22C400 120 398 200 396 274L4 274C0 200 2 100 4 20Z' },
    { c: PAL.ochre, o: 0.3, d: 'M0 270C100 267 200 272 300 269C340 268 370 270 400 269L400 294C300 296 100 295 0 294Z' },
  ],
  lines: [floor],
  fine: [
    hatch(14, 284, 384, 286, 12, 8, 172, 4),
    // little hops and swirls of the dance
    'M118 182q8 -6 16 0M232 180q8 -6 16 0',
    'M98 120l-6 -4M94 132l-8 0M314 112l6 -4M318 124l8 0',
  ],
  parts: [
    place(bench({ w: 330, h: 92 }), 'translate(200 272)'),
    place(candle({ glow: 50 }), 'translate(48 176)'),
    place(elf({ dressed: true, hat: PAL.red, arms: ELF_ARMS.up, legs: ELF_LEGS.kick, mood: 'shut' }), 'translate(140 172) scale(1.9) rotate(-6)'),
    place(
      elf({
        dressed: true,
        hat: PAL.sky,
        arms: [
          [[-7, -32, 4.5], [-14, -38, 4], [-17, -48, 4]],
          [[7, -32, 4.5], [14, -28, 4], [20, -24, 4]],
        ],
        legs: ELF_LEGS.hop,
        mood: 'shut',
      }),
      'translate(262 164) scale(1.9) rotate(5)',
    ),
    place(note(20), 'translate(82 96) rotate(-10)'),
    place(note(22, true), 'translate(196 64) rotate(6)'),
    place(note(18), 'translate(330 82) rotate(12)'),
    place(note(16, true), 'translate(352 150) rotate(-8)'),
  ],
});
