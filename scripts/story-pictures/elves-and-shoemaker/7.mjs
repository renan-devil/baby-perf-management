import { PAL, hatch } from '../lib.mjs';
import { ELF_ARMS, ELF_LEGS, bench, candle, compose, elf, place, shoePair, snowDots, snowFlakes } from './characters.mjs';

// The Elves and the Shoemaker, 7: their work done, the two little elves wave goodbye and slip out of
// the window into the snowy night, shivering in their thin ragged clothes.
const floor = 'M0 272C90 269 200 274 300 271C340 270 370 272 400 271';

// the open window: the night sky with falling snow, the two casements swung open into the room
const pane = 'M206 44L338 44L338 184L206 184Z';
const leafL = 'M206 44L184 54L184 176L206 184';
const leafR = 'M338 44L360 54L360 176L338 184';
const leafBars = 'M195 50L195 180M184 116L206 116M349 50L349 180M338 116L360 116';
const sill = 'M190 184L354 184L350 196L194 196Z';
// the two elves stand in front of the night: their shapes are left out of the dark sky (holes)
const hole = (x) =>
  `M${x - 20} 184C${x - 22} 170 ${x - 24} 150 ${x - 16} 140C${x - 34} 128 ${x - 40} 106 ${x - 36} 92C${x - 24} 100 ${x - 16} 92 ${x} 92C${x + 16} 92 ${x + 24} 100 ${x + 36} 92C${x + 40} 106 ${x + 34} 128 ${x + 16} 140C${x + 24} 150 ${x + 22} 170 ${x + 20} 184Z`;
const shiver = 'M200 132l-4 3l4 3l-4 3M206 152l-4 3l4 3M330 128l4 3l-4 3l4 3M322 150l4 3l-4 3';

export default compose({
  title: 'Goodbye into the snowy night',
  seed: 107,
  washes: [
    { c: PAL.slate, o: 0.3, d: 'M4 20C80 8 300 10 396 22C400 120 398 200 396 274L4 274C0 200 2 100 4 20Z' },
    { c: PAL.ochre, o: 0.3, d: 'M0 270C100 267 200 272 300 269C340 268 370 270 400 269L400 294C300 296 100 295 0 294Z' },
    { c: PAL.slate, o: 0.75, d: pane + hole(238) + hole(296), rule: 'evenodd' },
    { c: PAL.sky, o: 0.35, d: `${leafL}Z${leafR}Z` },
    { c: PAL.ochre, o: 0.6, d: sill },
  ],
  whites: snowDots([
    [216, 56], [236, 70], [258, 52], [284, 62], [310, 54], [328, 72], [212, 92], [330, 104], [212, 128], [332, 140], [268, 160], [266, 120], [270, 70], [300, 76], [212, 172], [334, 170]
  ]),
  lines: [floor, pane, leafL, leafR, sill],
  fine: [leafBars, shiver, hatch(14, 284, 384, 286, 12, 8, 172, 4), snowFlakes([[372, 30], [380, 70], [164, 30]], 3)],
  parts: [
    place(bench({ w: 150, h: 72 }), 'translate(92 272)'),
    place(shoePair({}), 'translate(70 196)'),
    place(shoePair({ c: PAL.ochre }), 'translate(112 200) scale(0.9)'),
    place(candle({ glow: 44, lit: true }), 'translate(36 198) scale(0.9)'),
    place(elf({ hair: PAL.terracotta, arms: ELF_ARMS.wave, mood: 'happy' }), 'translate(238 184) scale(1.5)'),
    place(elf({ hair: PAL.ochre, arms: ELF_ARMS.hug, legs: ELF_LEGS.kick, mood: 'peepR' }), 'translate(296 184) scale(1.5)'),
  ],
});
