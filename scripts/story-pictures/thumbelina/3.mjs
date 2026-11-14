import { PAL, hatch, transformPath } from '../lib.mjs';
import { at, compose, dot, place, thumbCutBelow, thumbelina } from './characters.mjs';

// Thumbelina, 3: Thumbelina floats away down the stream on a lily pad, pulled along by a white
// butterfly on a ribbon.
const water = 'M0 196C60 190 120 198 200 192C280 186 340 196 400 190L400 300L0 300Z';
const ripples = 'M36 238l-24 -2M40 252l-26 4M18 214q20 -5 40 0M300 222q24 -6 48 0M330 256q20 -5 40 0M20 266q24 -6 48 0M240 280q20 -5 40 0M120 288q24 -5 48 0';
const pad = 'M50 236C50 214 100 202 164 202C228 202 280 214 280 236C280 258 228 270 168 270L176 248L150 270C96 268 50 258 50 236Z';
const padVeins = 'M163 236L80 232M163 236L110 214M163 236L170 206M163 236L236 212M163 236L262 236M163 236L118 262';
const padRim = 'M54 244C70 262 120 272 150 272M180 272C230 272 270 260 278 244';
const flower = 'M246 226C240 214 246 204 254 208C258 198 268 200 268 210C278 206 282 218 272 224C264 230 252 230 246 226Z';
// the butterfly (body centre at 0,0), wings open, flying to the right
const bfUp = 'M-1 -4C-10 -22 -34 -42 -48 -32C-58 -22 -46 -6 -2 2Z';
const bfUp2 = 'M1 -4C10 -22 34 -42 48 -32C58 -22 46 -6 2 2Z';
const bfLow = 'M-1 2C-20 4 -36 16 -30 28C-24 36 -8 26 -1 8ZM1 2C20 4 36 16 30 28C24 36 8 26 1 8Z';
const bfBody = 'M-2 -8C-4 0 -3 10 0 14C3 10 4 0 2 -8C1 -11 -1 -11 -2 -8Z';
const bfFeelers = 'M0 -10C-2 -20 -8 -24 -12 -26M1 -10C4 -20 10 -22 14 -24';
const BF = 'translate(316 96) rotate(8) scale(1.2)';
const bf = (d) => transformPath(d, BF);
const TH = 'translate(160 238) scale(1.4)';
const ARMS = [
  [[-12, -62, 6], [-16, -52, 5.5], [-18, -42, 5], [-18, -36, 5]],
  [[12, -62, 6], [22, -64, 5.5], [32, -72, 5], [38, -80, 5]],
];
const cutWater = transformPath(thumbCutBelow(-30), TH);
const cutPad = transformPath(thumbCutBelow(-25), TH);
const [hx, hy] = at(38, -80, TH);
const [bx, by] = at(0, 12, BF);
const ribbon = `M${hx} ${hy}C${hx + 30} ${hy - 30} ${bx - 50} ${by + 40} ${bx} ${by}`;
const ribbon2 = `M${hx} ${hy + 3}C${hx + 30} ${hy - 26} ${bx - 50} ${by + 44} ${bx + 1} ${by + 3}`;

export default compose({
  title: 'On the lily pad',
  seed: 103,
  washes: [
    { c: PAL.sky, o: 0.55, d: water + cutWater, rule: 'evenodd' },
    { c: PAL.green, o: 0.85, d: pad + cutPad, rule: 'evenodd' },
    { c: PAL.ochre, o: 0.3, d: pad + cutPad, rule: 'evenodd' },
    { c: PAL.rose, o: 0.8, d: flower },
    { c: PAL.red, o: 0.8, d: `${ribbon}L${bx + 1} ${by + 3}C${bx - 50} ${by + 44} ${hx + 30} ${hy - 26} ${hx} ${hy + 3}Z` },
    { c: PAL.grey, o: 0.25, d: bf(`${bfUp}${bfUp2}${bfLow}`) },
    { c: PAL.slate, o: 0.6, d: bf('M-48 -32C-58 -22 -52 -14 -44 -12C-40 -20 -40 -28 -36 -38C-42 -38 -46 -36 -48 -32ZM48 -32C58 -22 52 -14 44 -12C40 -20 40 -28 36 -38C42 -38 46 -36 48 -32Z') },
  ],
  lines: ['M0 196C60 190 120 198 200 192C280 186 340 196 400 190', pad, ribbon, flower, ...[bfUp, bfUp2, bfLow, bfBody].map(bf)],
  fine: [ripples, padVeins, padRim, ribbon2, bf(bfFeelers), 'M256 214q4 6 8 0', hatch(300, 200, 390, 210, 6, 8, 170, 9)],
  fills: `<path d="${bf(bfBody)}"/><path d="${bf(dot(-26, -22, 3.2) + dot(26, -22, 3.2) + dot(0, -11, 3))}"/>`,
  parts: [place(thumbelina({ arms: ARMS, mood: 'happy' }), TH)],
});
