import { PAL, hatch, rays, transformPath, tufts } from '../lib.mjs';
import { compose, duckling, hen, place } from './characters.mjs';

// The Ugly Duckling, 3: in the farmyard a puffed-up turkey and two hens laugh at the big grey
// duckling, who hangs his head.
const f = (n) => Math.round(n * 10) / 10;
const ground = 'M0 250C100 246 200 252 300 248C340 247 370 249 400 247';
const post = 'M294 150L296 250M308 150L306 249M292 151L310 150';

// The turkey (feet at 0,0, facing right): a big fan tail spread behind a round puffed-out body.
const FAN = [-18, -58, 52];
const fanEdge = (() => {
  const [cx, cy, r] = FAN;
  let d = '';
  const n = 9;
  for (let i = 0; i <= n; i++) {
    const a = ((186 + (i / n) * 136) * Math.PI) / 180;
    const [x, y] = [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    if (i === 0) d += `M${f(cx + Math.cos(a) * 30)} ${f(cy + Math.sin(a) * 30)}L${f(x)} ${f(y)}`;
    else {
      const m = ((186 + ((i - 0.5) / n) * 136) * Math.PI) / 180;
      d += `Q${f(cx + Math.cos(m) * (r + 12))} ${f(cy + Math.sin(m) * (r + 12))} ${f(x)} ${f(y)}`;
    }
  }
  return d;
})();
const fanStripes = (() => {
  const [cx, cy, r] = FAN;
  let d = '';
  for (let i = 1; i < 9; i++) {
    const a = ((186 + (i / 9) * 136) * Math.PI) / 180;
    d += `M${f(cx + Math.cos(a) * 34)} ${f(cy + Math.sin(a) * 34)}L${f(cx + Math.cos(a) * (r - 2))} ${f(cy + Math.sin(a) * (r - 2))}`;
  }
  return d;
})();
const fanBand = `M${f(FAN[0] - 48)} ${f(FAN[1] - 20)}C${FAN[0] - 30} ${FAN[1] - 52} ${FAN[0] + 30} ${FAN[1] - 54} ${FAN[0] + 48} ${FAN[1] - 22}`;
const tBody = 'M-34 -50C-40 -80 -10 -94 12 -86C30 -80 36 -60 30 -40C24 -22 4 -16 -12 -18C-28 -22 -32 -36 -34 -50Z';
const tWing = 'M-22 -60C-6 -70 14 -64 18 -48C4 -40 -14 -44 -22 -60';
const tNeck = 'M16 -84C20 -98 20 -112 32 -116C42 -120 52 -112 50 -102C48 -96 40 -94 37 -88C34 -82 32 -76 29 -70';
const tSnood = 'M46 -114C53 -115 57 -106 55 -96C51 -99 50 -106 46 -110Z';
const tWattle = 'M38 -96C41 -88 36 -82 33 -88Z';
const tBeak = 'M50 -109L59 -108L50 -105ZM50 -103L57 -97L49 -100Z';
const tLegs = 'M-8 -18L-10 0M-18 1L-10 0L-2 1M8 -18L8 0M0 1L8 0L16 1';
const tMarks = 'M35 -108q3.5 -3.5 7 0M-14 -56l10 2M-8 -60l10 2M-2 -74l2 4M8 -78l2 4M-6 -82l2 4';
const TT = 'translate(106 250) scale(1.25)';
const fanFill = `${fanEdge}L${f(FAN[0])} ${f(FAN[1])}Z`;

const laughs = rays(176, 106, 14, 24, 5, 3, -80) + rays(262, 72, 12, 22, 5, 8, 160) + rays(296, 168, 10, 18, 3, 11, 150);

export default compose({
  title: 'The farmyard laughs',
  seed: 73,
  washes: [
    { c: PAL.ochre, o: 0.3, d: 'M0 246C100 242 200 248 300 244C340 243 370 245 400 243L400 290C300 294 100 292 0 290Z' },
    { c: PAL.ochre, o: 0.4, d: 'M294 150L308 150L306 249L296 250Z' },
    { c: PAL.ochre, o: 0.5, d: transformPath(fanFill, TT) },
    { c: PAL.terracotta, o: 0.4, d: transformPath(`${fanBand}L${f(FAN[0] + 30)} ${f(FAN[1] - 14)}C${FAN[0] + 10} ${FAN[1] - 30} ${FAN[0] - 10} ${FAN[1] - 30} ${FAN[0] - 30} ${FAN[1] - 12}Z`, TT) },
    { c: PAL.terracotta, o: 0.7, d: transformPath(tBody, TT) },
    { c: PAL.slate, o: 0.35, d: transformPath(`${tWing}Z`, TT) },
    { c: PAL.sky, o: 0.75, d: transformPath(`${tNeck}L16 -84Z`, TT) },
    { c: PAL.red, o: 0.85, d: transformPath(tSnood + tWattle, TT) },
    { c: PAL.ochre, o: 0.9, d: transformPath(tBeak, TT) },
  ],
  lines: [ground, post, ...[fanEdge, tBody, tWing, tNeck, tLegs, tSnood].map((d) => transformPath(d, TT))],
  fine: [
    laughs,
    ...[fanStripes, fanBand, tWattle, tBeak, tMarks].map((d) => transformPath(d, TT)),
    hatch(20, 268, 380, 270, 10, 8, 172, 5),
    tufts([[16, 249], [180, 250], [392, 247]], 9, 6),
  ],
  parts: [
    place(duckling({ head: 48, legs: true }), 'translate(228 221) scale(-1.45 1.45)'),
    place(hen({ laughing: true }), 'translate(300 152) scale(-1 1)'),
    place(hen({ laughing: true }), 'translate(338 252) scale(-1.1 1.1)'),
  ],
});
