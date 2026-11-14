import { PAL, hatch, transformPath } from '../lib.mjs';
import { compose, place, thumbelina } from './characters.mjs';

// Thumbelina, 1 (cover): a tiny girl, no bigger than a thumb, sits inside a big open red tulip and
// smiles.
const leafL = 'M196 300C150 290 96 262 56 214C108 220 166 254 198 286';
const leafR = 'M204 300C250 290 304 262 344 214C292 220 234 254 202 286';
const outerL = 'M198 266C150 262 112 228 98 172C94 154 96 138 100 124C118 140 146 152 170 162';
const outerR = 'M202 266C250 262 288 228 302 172C306 154 304 138 300 124C282 140 254 152 230 162';
const backL = 'M154 162C126 136 118 100 126 70C146 88 164 116 176 148';
const backR = 'M246 162C274 136 282 100 274 70C254 88 236 116 224 148';
const front = 'M126 150C146 160 174 166 200 166C226 166 254 160 274 150C272 204 246 252 200 266C154 252 128 204 126 150Z';
const veins = 'M200 172C198 200 198 232 200 260M168 170C170 200 180 232 196 260M232 170C230 200 220 232 204 260';
const T = 'translate(200 292) scale(1.2 1.05) translate(-200 -266)';
const t = (d) => transformPath(d, T);
const ARMS = [
  [[-12, -62, 6], [-20, -56, 5.5], [-28, -50, 5], [-34, -46, 5]],
  [[12, -62, 6], [20, -56, 5.5], [28, -50, 5], [34, -46, 5]],
];

export default compose({
  title: 'Thumbelina in the tulip',
  seed: 101,
  washes: [
    { c: PAL.green, o: 0.7, d: `${leafL}Z${leafR}Z` },
    { c: PAL.red, o: 0.72, d: t(`${backL}Z${backR}Z`) },
    { c: PAL.red, o: 0.78, d: t(`${outerL}Z${outerR}Z`) },
  ],
  after: [
    { c: PAL.red, o: 0.82, d: t(front) },
    { c: PAL.terracotta, o: 0.35, d: t('M140 190C160 230 180 252 200 262C176 240 160 214 152 176Z') },
  ],
  lines: [leafL, leafR, ...[outerL, outerR, backL, backR, front].map(t)],
  fine: [
    t(veins),
    'M90 236C130 258 166 278 194 294M310 236C270 258 234 278 206 294',
    t(hatch(240, 220, 262, 180, 5, 9, 120, 6)),
    'M60 80l0 14M53 87l14 0M340 60l0 12M334 66l12 0M330 150l0 10M325 155l10 0',
  ],
  parts: [place(thumbelina({ pose: 'upper', arms: ARMS, mood: 'happy' }), 'translate(200 254) scale(1.8)')],
});
