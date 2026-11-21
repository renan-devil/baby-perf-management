// Swim without armbands: a happy child in a red swim cap, one arm mid-stroke; her armbands left on the side.
import { PAL, paths, transformPath } from '../story-pictures/lib.mjs';

// The child, seen from the shoulders up in the water.
const head = 'M124 142C124 120 140 106 160 106C180 106 196 120 196 142C196 164 180 178 160 178C140 178 124 164 124 142Z';
const cap = 'M121 138C119 112 138 98 160 98C182 98 200 112 199 138C186 128 134 128 121 138Z';
const capLines = 'M160 99C158 108 158 118 160 130M140 104C134 112 132 120 133 131';
const ears = 'M124 140C116 140 116 154 125 154M196 140C204 140 204 154 195 154';
const face = 'M148 160Q160 170 172 160M159 149q3 3 0 5M142 141q5-3 9 0M169 141q5-3 9 0';
const neck = 'M150 177L150 186M170 177L170 186';
// Shoulders under the water, seen through it.
const shoulders = 'M150 186C136 186 118 190 108 198M192 186C186 186 178 186 170 186';
// The arm out of the water, elbow high, the hand about to go back in.
const arm = 'M190 186C204 160 216 136 229 114C233 105 240 105 243 113C251 128 259 142 267 156M203 192C214 172 226 150 237 130C244 141 250 152 256 162';
const hand = 'M256 162C252 170 256 178 263 178C270 178 273 168 267 156';
const fingers = 'M261 168l1 7M266 167l1 8';
// Splash and drops around the hand and along the arm.
const drop = (x, y, s = 1) => `M${x} ${y}c${-2.4 * s} ${4 * s} ${-2.4 * s} ${7 * s} 0 ${7 * s}c${2.4 * s} 0 ${2.4 * s} ${-3 * s} 0 ${-7 * s}Z`;
const drops = [drop(284, 140, 1.4), drop(296, 160, 1.2), drop(256, 88, 1.3), drop(274, 112, 1.1), drop(218, 96, 1.1), drop(232, 82, 0.9), drop(240, 160, 1.1), drop(284, 172, 0.9)];
const splash =
  'M250 186C250 180 252 176 255 174M276 186C278 180 276 175 273 172M244 188l-8-5M282 188l8-5M263 188l0-6M184 192q-5-4-10-2M210 196q6-2 10 1';

// Ripples spreading around her (only their near halves show).
const ripples =
  'M108 196C112 208 136 214 166 214C196 214 222 208 226 196M74 194C80 220 120 232 168 232C212 232 252 222 262 202M50 182C46 214 100 248 170 250C232 250 288 236 300 206M300 180C312 186 316 194 314 200';
const waterLines = 'M30 50q10-6 20 0t20 0M290 40q10-6 20 0t20 0M70 92q8-5 16 0t16 0M320 90q8-5 16 0t16 0M24 260q8-5 16 0t16 0M110 278q8-5 16 0t16 0M330 132q8-5 16 0';

// The child and her ripples are drawn around (160, 150), then placed a little larger.
const K = 'translate(150 138) scale(1.2) translate(-160 -150)';

// The pool's edge in the corner, with the armbands she took off.
const edge = 'M182 294L394 189M196 294L394 197';
const tiles = 'M210 280L213 287M236 267L239 274M262 254L265 261M288 241L291 248M314 228L317 235M340 215L343 222M366 202L369 209';
const A1 = 'translate(300 272) rotate(-6)';
const A2 = 'translate(352 249) rotate(8)';
// An armband standing on the poolside: two puffy rings, with the hole for the arm on top.
const band =
  'M-20 -12C-25 -8 -25 -3 -22 1C-26 5 -25 10 -20 12C-18 20 18 20 20 12C25 10 26 5 22 1C25 -3 25 -8 20 -12';
const bandTop = 'M-20 -12C-20 -21 20 -21 20 -12C20 -3 -20 -3 -20 -12Z';
const bandHole = 'M-9 -12C-9 -16 9 -16 9 -12C9 -8 -9 -8 -9 -12Z';
const bandSeam = 'M-22 1C-14 7 14 7 22 1';
const valve = 'M9 -3l1-5l5 0l0 5';
const bandShape = 'M-20 -12C-20 -21 20 -21 20 -12C25 -8 25 -3 22 1C26 5 25 10 20 12C18 20 -18 20 -20 12C-25 10 -26 5 -22 1C-25 -3 -25 -8 -20 -12Z';
const bandShine = 'M-17 -5C-17 -2 -15 0 -12 1C-13 -1 -14 -3 -14 -5ZM-18 9C-17 12 -15 14 -12 15C-13 13 -14 11 -14 9Z';

// The water, with the child (out of the water) and the poolside left unpainted.
const pool = 'M6 10C120 4 280 8 394 6L394 189L182 294L6 294Z';
const headDry = 'M114 140C114 112 136 96 160 96C184 96 206 112 206 140C206 160 186 178 174 182L174 190L146 190L146 182C134 178 114 160 114 140Z';
const armDry = 'M188 188C202 160 214 134 227 112C232 101 242 101 245 111C253 126 261 140 269 154C276 166 272 180 263 180C256 180 252 172 254 163C249 154 244 146 237 136C228 154 217 174 205 194Z';

export default {
  title: 'Swim without armbands',
  seed: 263,
  washes: [
    // the pool water
    { c: PAL.sky, o: 0.58, d: pool + transformPath(headDry + armDry, K), rule: 'evenodd' },
    { c: PAL.sky, o: 0.35, t: K, d: 'M60 196C40 226 100 250 170 252C232 252 290 238 304 206C300 176 240 168 170 170C110 170 64 178 60 196Z' },
    { c: PAL.slate, o: 0.25, t: K, d: 'M108 192C104 210 140 218 166 218C196 218 226 210 228 194C220 186 196 184 166 184C136 184 112 186 108 192Z' },
    // cap, face and the arm
    { c: PAL.red, o: 0.82, t: K, d: 'M122 136C120 110 140 98 162 98C184 98 200 114 198 136C186 128 134 128 122 136Z' },
    { c: PAL.rose, o: 0.4, t: K, d: 'M126 138C140 130 182 130 194 138C198 160 182 178 160 178C138 178 122 162 126 138ZM118 142C114 146 118 154 126 154ZM202 142C206 146 202 154 194 154ZM151 176L169 176L170 188L150 188ZM191 186C204 160 216 136 229 114C233 105 240 105 243 113C251 128 259 142 267 156C272 166 270 176 264 177C258 177 254 170 256 163C250 152 244 141 237 130C226 150 214 172 203 192Z' },
    { c: PAL.rose, o: 0.5, t: K, d: 'M134 156C134 151 142 151 142 156C142 161 134 161 134 156ZM178 156C178 151 186 151 186 156C186 161 178 161 178 156Z' },
    { c: PAL.rose, o: 0.3, t: K, d: 'M150 186C136 186 118 190 106 200C120 206 150 208 168 204C188 204 196 196 194 186Z' },
    // the poolside and the armbands
    { c: PAL.grey, o: 0.22, d: 'M188 294L394 192L394 294Z' },
    { c: PAL.sky, o: 0.45, d: 'M182 294L394 189L394 197L196 294Z' },
    { c: PAL.terracotta, o: 0.82, d: transformPath(bandShape, A1) + transformPath(bandShape, A2) },
    { c: PAL.terracotta, o: 0.6, d: transformPath(bandHole, A1) + transformPath(bandHole, A2) },
  ],
  whites:
    transformPath(drops.join(''), K) +
    'M40 140c10-3 22-3 30 0c-8 2-20 2-30 0ZM300 64c12-3 24-3 34 0c-10 2-22 2-34 0ZM60 30c8-2 16-2 22 0c-6 2-14 2-22 0ZM230 236c8-2 16-2 22 0c-6 2-14 2-22 0Z' +
    transformPath('M150 104C156 102 166 102 170 104C164 106 156 106 150 104Z', K) +
    transformPath(bandShine, A1) +
    transformPath(bandShine, A2),
  lines:
    paths([cap, head, ears, neck, arm, hand], K) + paths([edge]) + paths([band, bandTop], A1) + paths([band, bandTop], A2),
  fine:
    paths([capLines, face, shoulders, fingers, ...drops, splash, ripples], K) +
    paths([waterLines, tiles]) +
    paths([bandSeam, valve, bandHole], A1) +
    paths([bandSeam, valve, bandHole], A2),
  fills: `<circle cx="148" cy="148" r="3.2" transform="${K}"/><circle cx="172" cy="148" r="3.2" transform="${K}"/>`,
  glints: `<circle cx="149.2" cy="146.8" r="1.1" transform="${K}"/><circle cx="173.2" cy="146.8" r="1.1" transform="${K}"/>`,
};
