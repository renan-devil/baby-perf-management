import { PAL, hatch } from '../lib.mjs';
import { bench, compose, dot, merge, oval, place, shoePair, shoemaker } from './characters.mjs';

// The Elves and the Shoemaker, 4: every morning there are more finished shoes, until the workbench is
// covered with them, and customers queue at the door of the busy little shop. Ding-a-ling!
const floor = 'M0 272C90 269 200 274 300 271C340 270 370 272 400 271';

// a tall boot (heel at 0,0, toe to the right), for the farmer
const bootBody = 'M0 0C-1 -10 0 -26 2 -30L13 -30C13 -20 14 -12 22 -10C30 -8 34 -5 34 -1L34 0Z';
const boot = (c) => ({ lines: [bootBody], fine: ['M2 -30C4 -33 11 -33 13 -30', 'M0 -2L34 -2'], washes: [{ c, o: 0.8, d: bootBody }] });
const bootPair = (c) => merge(place(boot(c), 'translate(10 -4)'), boot(c));

// The open door on the right, with the snowy street showing through, and the little bell above it.
const door = 'M314 272L314 112C314 88 392 88 392 112L392 272';
const openLeaf = 'M314 112L298 120L298 268L314 272';
const bell = 'M346 76C346 66 360 66 360 76L362 80L344 80Z';
const ring = 'M338 68q-4 6 0 12M368 68q4 6 0 12M332 64q-6 10 0 20M374 64q6 10 0 20';
const shelf = 'M34 112L240 112L240 120L34 120ZM60 120L60 134L74 120M214 120L214 134L200 120';

// Customers waiting: a little girl, a grandmother and a farmer in a straw hat (feet at 0,0).
function person({ h, coat, hair = PAL.grey, hat = false, plaits = false }) {
  const r = h * 0.13;
  const hy = -h + r;
  const head = oval(0, hy, r, r * 1.05);
  const body = `M${-r * 0.6} ${hy + r}C${-r * 1.4} ${hy + r * 2} ${-r * 1.5} ${-h * 0.25} ${-r * 1.5} -2L${r * 1.5} -2C${r * 1.5} ${-h * 0.25} ${r * 1.4} ${hy + r * 2} ${r * 0.6} ${hy + r}Z`;
  const hairD = hat
    ? `M${-r * 1.7} ${hy - r * 0.6}C${-r} ${hy - r * 1.1} ${r} ${hy - r * 1.1} ${r * 1.7} ${hy - r * 0.6}C${r} ${hy - r * 0.2} ${-r} ${hy - r * 0.2} ${-r * 1.7} ${hy - r * 0.6}ZM${-r * 0.8} ${hy - r * 0.7}C${-r * 0.8} ${hy - r * 1.8} ${r * 0.8} ${hy - r * 1.8} ${r * 0.8} ${hy - r * 0.7}Z`
    : `M${-r} ${hy}C${-r * 1.1} ${hy - r * 1.3} ${r * 1.1} ${hy - r * 1.3} ${r} ${hy}C${r * 0.5} ${hy - r * 0.6} ${-r * 0.5} ${hy - r * 0.6} ${-r} ${hy}Z`;
  const extra = plaits ? dot(-r * 1.2, hy + r * 0.6, r * 0.35) + dot(r * 1.2, hy + r * 0.6, r * 0.35) : '';
  return {
    lines: [head, body, hairD],
    fine: [extra, `M${-r * 0.4} ${hy - r * 0.05}l0 0.5M${r * 0.4} ${hy - r * 0.05}l0 0.5`, `M${-r * 0.35} ${hy + r * 0.45}q${r * 0.35} ${r * 0.3} ${r * 0.7} 0`].filter(Boolean),
    washes: [
      { c: PAL.rose, o: 0.3, d: head },
      { c: coat, o: 0.75, d: body },
      { c: hat ? PAL.ochre : hair, o: 0.75, d: hairD + extra },
    ],
  };
}

const pairs = [
  [44, 174, PAL.terracotta],
  [92, 174, PAL.ochre],
  [140, 174, PAL.terracotta],
  [188, 174, PAL.rose],
  [56, 190, PAL.ochre],
  [152, 190, PAL.terracotta],
];

export default compose({
  title: 'Shoes for everyone',
  seed: 74,
  washes: [
    { c: PAL.ochre, o: 0.3, d: 'M0 270C100 267 200 272 300 269C340 268 370 270 400 269L400 294C300 296 100 295 0 294Z' },
    // the snowy street through the door
    { c: PAL.sky, o: 0.3, d: `${door}Z` },
    { c: PAL.ochre, o: 0.6, d: `${openLeaf}Z` },
    { c: PAL.ochre, o: 0.85, d: bell },
    { c: PAL.ochre, o: 0.65, d: 'M34 112L240 112L240 120L34 120Z' },
  ],
  lines: [floor, door, openLeaf, bell, shelf],
  fine: [hatch(14, 284, 300, 286, 10, 8, 172, 4), ring, 'M353 80l0 3', 'M306 150l0 6'],
  parts: [
    place(bench({ w: 190, h: 76 }), 'translate(135 272) scale(1.1)'),
    ...pairs.map(([x, y, c]) => place(shoePair({ c }), `translate(${x} ${y})`)),
    place(bootPair(PAL.slate), 'translate(100 190)'),
    place(shoePair({ c: PAL.red }), 'translate(206 190) scale(0.75)'),
    ...[[44, PAL.ochre], [94, PAL.red], [144, PAL.slate], [194, PAL.terracotta]].map(([x, c]) => place(shoePair({ c }), `translate(${x} 112)`)),
    place(person({ h: 146, coat: PAL.green, hat: true }), 'translate(370 266)'),
    place(person({ h: 124, coat: PAL.slate, hair: PAL.grey }), 'translate(346 270)'),
    place(person({ h: 84, coat: PAL.red, hair: PAL.terracotta, plaits: true }), 'translate(328 274)'),
    place(
      shoemaker({
        mood: 'shut',
        tilt: -6,
        arms: [
          [[-20, -104, 10], [-34, -98, 9], [-46, -96, 9], [-58, -100, 9]],
          [[20, -104, 10], [32, -112, 9], [38, -126, 9], [40, -138, 9]],
        ],
      }),
      'translate(262 272) scale(1.05)',
    ),
  ],
});
