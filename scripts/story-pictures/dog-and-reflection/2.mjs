import { PAL, hatch, tufts } from '../lib.mjs';
import { FEET, bone, compose, dog, place, wobble } from './characters.mjs';

// The Dog and His Reflection, 2: halfway across the little wooden bridge the greedy Dog opens his
// mouth wide to bark WOOF! at the "other dog" in the stream, and his own bone tumbles out and falls
// into the water with a big splash. Below him, wobbling in the ripples, his reflection barks back.
// Same Dog and same bone as the cover (characters.mjs).

const f = (n) => Math.round(n * 10) / 10;

// the stream, with its two grassy banks
const WATER = 158;
const water = `M0 ${WATER}L400 ${WATER}L400 300L0 300Z`;
const leftBank = 'M0 126C14 126 26 132 32 144C36 152 34 158 30 162C20 166 8 166 0 165Z';
const rightBank = 'M400 136C380 136 356 142 344 152C338 158 340 164 348 166C366 168 386 168 400 167Z';
const bankLines = 'M0 126C14 126 26 132 32 144C36 152 34 158 30 162C20 166 8 166 0 165M400 136C380 136 356 142 344 152C338 158 340 164 348 166C366 168 386 168 400 167';
const surface = 'M30 162C40 160 50 159 60 159M344 160C330 159 318 159 306 159';
const ripples = 'M40 216l24 0M90 232l18 0M300 214l30 0M330 238l22 0M20 262l26 0M310 276l28 0M110 290l20 0M60 248l14 0';
const reeds = 'M372 144C370 126 372 112 376 102M382 146C384 128 388 118 394 112M362 148C358 136 354 128 348 124';
const reedHeads = 'M374.5 106C372 98 374 90 377 88C380 92 380 100 377 107ZM391 115C391 107 395 101 398 101C399 105 396 112 393 117Z';

// the little wooden bridge: a plank deck on three posts, with a low rail at the far end
const DECK = 136;
const deck = `M18 ${DECK}L234 ${DECK}L234 146L18 146Z`;
const posts = 'M56 146L56 172M64 146L64 172M136 146L136 172M144 146L144 172M216 146L216 172M224 146L224 172';
const postWash = 'M56 146L64 146L64 172L56 172ZM136 146L144 146L144 172L136 172ZM216 146L224 146L224 172L216 172Z';
const planks = 'M44 138l0 6M72 138l0 6M100 138l0 6M128 138l0 6M156 138l0 6M184 138l0 6M212 138l0 6';
const rail = `M24 ${DECK}L24 104M74 ${DECK}L74 106M124 ${DECK}L124 108M20 107C50 104 90 106 128 109`;
const railWash = `M21 ${DECK}L27 ${DECK}L27 104L21 104ZM71 ${DECK}L77 ${DECK}L77 106L71 106ZM121 ${DECK}L127 ${DECK}L127 108L121 108ZM20 104C50 101 90 103 128 106L128 111C90 108 50 106 20 109Z`;
// the bridge's own reflection, a dark band just under the water line
const deckShadow = 'M18 170L234 170L234 180L18 180Z';

// the Dog, near the end of the bridge, leaning over the water and barking
const DX = 186;
const S = 1.4;
const DY = DECK - FEET * S;
const D = `translate(${DX} ${f(DY)}) scale(${S})`;
// WOOF! two fans of short strokes from his open mouth
const fan = (cx, cy, r1, r2, angles) =>
  angles
    .map((a) => {
      const r = (a * Math.PI) / 180;
      return `M${f(cx + Math.cos(r) * r1)} ${f(cy + Math.sin(r) * r1)}L${f(cx + Math.cos(r) * r2)} ${f(cy + Math.sin(r) * r2)}`;
    })
    .join('');
const woof = fan(258, 92, 16, 27, [-64, -36, -10, 14]) + fan(258, 92, 34, 44, [-50, -22, 2]);

// his reflection: the same Dog mirrored in the water line, paler, bent by the ripples
const R = `translate(${DX} ${f(2 * WATER - DY)}) scale(${S} ${-S})`;
const bend = (d) => wobble(d, { y0: WATER, amp: 3.2, wave: 4.5 });
function reflection(part) {
  return {
    fine: [...part.lines, ...part.fine].map(bend),
    washes: part.washes.map((w) => ({ ...w, o: w.o * 0.5, d: bend(w.d) })),
    whites: part.whites.map(bend),
    fills: part.fills.map(bend),
  };
}
const glints = 'M140 206l16 0M178 222l20 0M138 244l14 0M200 256l18 0M160 274l16 0';

// the bone, tumbling end over end into the stream, and the big splash
const B = 'translate(285 141) rotate(35) scale(1.3)';
const fall = 'M250 106l6 12M261 104l4 11';
const SPLASH = [306, WATER];
const spray = fan(SPLASH[0], SPLASH[1], 16, 32, [-162, -136, -112, -68, -44, -18]);
const drops = [
  [282, 124, -30],
  [336, 120, 30],
  [348, 140, 60],
  [270, 144, -60],
].map(([x, y, a]) => {
  const r = (a * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  // a little teardrop, its point down towards the splash
  const p = (u, v) => `${f(x + u * c - v * s)} ${f(y + u * s + v * c)}`;
  return `M${p(0, 5)}C${p(3, 1)} ${p(3, -3)} ${p(0, -3)}C${p(-3, -3)} ${p(-3, 1)} ${p(0, 5)}Z`;
});
const rings = 'M278 162C286 168 326 168 334 162M266 166C278 175 336 175 348 166';

export default compose({
  title: 'The Dog barks, and his bone falls into the water',
  seed: 82,
  parts: [
    {
      washes: [
        { c: PAL.sky, o: 0.6, d: water },
        { c: PAL.slate, o: 0.18, d: 'M0 214L400 214L400 300L0 300Z' },
        { c: PAL.slate, o: 0.35, d: deckShadow },
        { c: PAL.green, o: 0.55, d: leftBank + rightBank },
        { c: PAL.green, o: 0.7, d: reedHeads },
      ],
      fine: [surface, ripples, reeds, reedHeads, glints, tufts([[10, 128], [376, 140]], 8, 5)],
    },
    reflection(place(dog({ pose: 'bark' }), R)),
    {
      washes: [
        { c: PAL.terracotta, o: 0.6, d: deck + postWash + railWash },
        { c: PAL.grey, o: 0.5, d: deck + postWash + railWash },
      ],
      lines: [deck, posts, rail, bankLines],
      fine: [planks, hatch(30, 141, 230, 141, 9, 3, 90, 4)],
    },
    place(dog({ pose: 'bark' }), D),
    { fine: [woof, fall] },
    place(bone(), B),
    {
      washes: [{ c: PAL.sky, o: 0.9, d: drops.join('') }],
      fine: [spray, rings, ...drops],
    },
  ],
});
