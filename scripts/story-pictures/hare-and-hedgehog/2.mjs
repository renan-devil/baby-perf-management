import { PAL, hatch, tufts } from '../lib.mjs';
import { compose, dot, hare, hedgehog, place } from './characters.mjs';

// The Hare and the Hedgehog, 2: "First I'll go home for my breakfast." Hedgehog trots off towards
// his little round door in the bank, with a secret smile. Far behind, Hare is still holding his
// tummy, laughing in the ploughed field.
const ground = 'M0 262C90 259 200 264 300 261C350 260 380 262 400 261';
// the field behind, smaller now, with its furrows
const horizon = 'M140 118C220 114 320 118 400 114';
const field = 'M140 118C220 114 320 118 400 114L400 156C320 158 230 156 156 158Z';
const fieldEdge = 'M156 158C230 156 320 158 400 156';
const furrows = 'M206 116C200 130 194 144 188 156M262 116C260 130 258 144 256 156M378 114C382 128 388 142 394 156';
// Hedgehog's home: a grassy bank with a little round door and a window
const bank = 'M0 128C30 112 70 116 92 140C112 162 120 216 124 262';
const door = 'M48 262L48 214C48 190 84 190 84 214L84 262';
const doorKnob = dot(77, 238, 2.2);
const window_ = 'M14 178C14 166 32 166 32 178C32 190 14 190 14 178ZM14 178L32 178M23 167L23 189';
const path_ = 'M84 262C110 270 150 274 200 280M48 262C70 276 120 288 170 300';
const laugh = 'M300 46l-4 -7M315 41l0 -9M330 46l5 -7';
const trotMarks = 'M262 252q6 -3 12 0M278 258q6 -3 12 0';

export default compose({
  title: 'Off home for breakfast',
  seed: 42,
  washes: [
    { c: PAL.terracotta, o: 0.32, d: field },
    { c: PAL.ochre, o: 0.25, d: field },
    { c: PAL.green, o: 0.4, d: 'M0 258C90 255 200 260 300 257C350 256 380 258 400 257L400 300L0 300Z' },
    { c: PAL.green, o: 0.3, d: 'M96 160C140 156 200 156 320 158C360 157 390 156 400 156L400 258L96 258Z' },
    { c: PAL.green, o: 0.6, d: `${bank}L0 262Z` },
    { c: PAL.red, o: 0.7, d: `${door}Z` },
    { c: PAL.sky, o: 0.6, d: window_.split('M14 178L')[0] },
    { c: PAL.ochre, o: 0.4, d: 'M84 262C110 270 150 274 200 280L200 300L170 300C120 288 70 276 48 262Z' },
  ],
  lines: [ground, bank, door, horizon],
  // the edges of the little path home
  once: `<path d="${path_}" stroke-dasharray="10 8"/>`,
  fine: [fieldEdge, furrows, window_, laugh, trotMarks, hatch(4, 150, 40, 230, 6, 7, 120, 3), hatch(220, 284, 390, 282, 10, 6, 160, 7), tufts([[10, 262], [140, 262], [380, 261], [200, 158], [360, 157]], 9, 9)],
  fills: `<path d="${doorKnob}"/>`,
  parts: [
    place(hedgehog({ legs: 'trot', arm: 'swing', eye: 'happy', mouth: 'grin' }), 'translate(214 262) scale(-1.42 1.42)'),
    place(hare({ face: 'laugh', ears: 'up', arms: 'belly', tilt: -16 }), 'translate(322 154) scale(-0.72 0.72)'),
  ],
});
