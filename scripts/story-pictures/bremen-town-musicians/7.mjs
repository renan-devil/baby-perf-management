import { PAL, hatch, transformPath } from '../lib.mjs';
import { compose, dot, place, robber } from './characters.mjs';

// The Bremen Town Musicians, 7: through the lit window of the little house, a table covered with
// good things to eat (sausages, bread, cheese, a cake and a pile of gold) and the robbers eating and
// laughing all around it.
const frameOut = 'M38 34L362 34L362 254L38 254Z';
const frameIn = 'M54 48L346 48L346 240L54 240Z';
const sill = 'M26 254L374 254L378 268L22 268Z';
const table = 'M54 198L346 198M54 212L346 212';
const sausages = 'M86 196C82 188 90 184 96 190C100 184 108 184 110 190C114 184 122 186 122 194C116 200 92 200 86 196Z';
const plate = 'M78 199C90 202 120 202 132 199';
const bread = 'M140 198C138 182 152 174 166 176C180 178 188 188 186 198Z';
const breadMarks = 'M152 182l4 6M162 179l4 6M172 181l4 6';
const cheese = 'M206 198L206 182L250 172L250 198Z';
const holes = dot(216, 190, 2.5) + dot(232, 186, 2) + dot(240, 192, 2.6);
const cake = 'M264 198L264 180C264 176 300 176 300 180L300 198Z';
const cream = 'M264 182C270 188 276 182 282 188C288 182 294 188 300 182';
const cherry = dot(282, 172, 4);
const gold = dot(310, 196, 6, 3) + dot(312, 190, 6, 3) + dot(308, 184, 6, 3);
const FOOD = 'translate(200 198) scale(1.2) translate(-200 -198)';
const food = (d) => transformPath(d, FOOD);
const laugh = 'M84 92q4 -6 8 0M96 84q4 -6 8 0M304 84q4 -6 8 0M316 92q4 -6 8 0';

export default compose({
  title: 'The robbers’ feast',
  seed: 67,
  washes: [
    { c: PAL.slate, o: 0.7, d: `M0 0L400 0L400 300L0 300Z${frameOut}`, rule: 'evenodd' },
    { c: PAL.ink, o: 0.3, d: `M0 0L400 0L400 300L0 300Z${frameOut}`, rule: 'evenodd' },
    { c: PAL.ochre, o: 0.4, d: frameIn },
    { c: PAL.terracotta, o: 0.7, d: `${frameOut}${frameIn}${sill}`, rule: 'evenodd' },
    { c: PAL.terracotta, o: 0.6, d: 'M54 198L346 198L346 240L54 240Z' },
    { c: PAL.red, o: 0.8, d: food(sausages) },
    { c: PAL.ochre, o: 0.95, d: food(`${bread}${cheese}${gold}`) },
    { c: PAL.terracotta, o: 0.5, d: food(bread) },
    { c: PAL.rose, o: 0.85, d: food(cake) },
    { c: PAL.red, o: 0.9, d: food(cherry) },
  ],
  after: [{ c: PAL.terracotta, o: 0.6, d: food(holes) }],
  whites: food('M264 180C264 176 300 176 300 180L300 184C294 188 288 182 282 188C276 182 270 188 264 182Z'),
  lines: [frameOut, frameIn, sill, table],
  fine: [...[sausages, plate, bread, breadMarks, cheese, holes, cake, cream, cherry, gold, 'M282 168l2 -6'].map(food), laugh, hatch(70, 228, 330, 228, 9, 6, 100, 4), 'M10 30l30 0M10 90l30 0M360 60l30 0M360 140l30 0M10 180l30 0M360 230l30 0'],
  parts: [
    place(robber({ tint: PAL.sky }), 'translate(110 204) scale(0.84)'),
    place(robber({ tint: PAL.green }), 'translate(200 200) scale(0.92)'),
    place(robber({ tint: PAL.ochre }), 'translate(290 204) scale(0.84)'),
  ],
});
