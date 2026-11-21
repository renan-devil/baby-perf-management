// Fly in a plane: a passenger plane, seen from the side with its row of round windows, flies over
// fluffy clouds, with the sun shining in the corner.
import { PAL, paths, rays, transformPath } from '../story-pictures/lib.mjs';

const f = (n) => Math.round(n * 10) / 10;
const dot = (x, y, r, ry = r) => `M${f(x - r)} ${f(y)}a${r} ${ry} 0 1 0 ${f(2 * r)} 0a${r} ${ry} 0 1 0 ${f(-2 * r)} 0Z`;

// The cloud bank: the top edge is the outline of a row of overlapping puffs.
const puffs = [[-10, 262, 32], [40, 248, 30], [92, 240, 32], [146, 250, 27], [196, 240, 33], [252, 250, 28], [304, 240, 32], [356, 250, 30], [410, 262, 32]];
const top = [];
for (let x = 0; x <= 400; x += 2) {
  let y = 300;
  for (const [cx, cy, r] of puffs) if (Math.abs(x - cx) < r) y = Math.min(y, cy - Math.sqrt(r * r - (x - cx) * (x - cx)));
  top.push([x, y]);
}
const cloudTop = `M${top.map(([x, y]) => `${x} ${f(y)}`).join('L')}`;
const cloudShade = puffs
  .filter(([cx]) => cx > 0 && cx < 400)
  .map(([cx, cy, r]) => `M${f(cx - r * 0.8)} ${f(cy + r * 0.2)}C${f(cx - r * 0.4)} ${f(cy + r * 0.75)} ${f(cx + r * 0.4)} ${f(cy + r * 0.75)} ${f(cx + r * 0.8)} ${f(cy + r * 0.2)}C${f(cx + r * 0.4)} ${f(cy + r * 0.45)} ${f(cx - r * 0.4)} ${f(cy + r * 0.45)} ${f(cx - r * 0.8)} ${f(cy + r * 0.2)}Z`).join('');
const cloudCurls = 'M60 266c6 -6 14 -6 18 0M178 262c6 -6 14 -6 18 0M286 264c6 -6 14 -6 18 0M330 282c5 -5 12 -5 16 0M120 286c5 -5 12 -5 16 0';
const smallCloud = 'M168 70C164 58 178 50 188 54C192 42 210 40 218 50C228 46 240 54 236 64C242 68 238 76 230 76L176 76C168 76 166 72 168 70Z';

// The sun in the corner
const sun = dot(352, 52, 21);

// The plane, flying right and climbing a little
const PT = 'translate(0 -6) rotate(-5 210 140)';
const inP = (d) => transformPath(d, PT);
const body = 'M60 118C90 124 120 124 160 123L320 122C354 122 368 134 368 144C368 154 356 160 340 160L130 162C100 162 76 148 56 124Z';
const fin = 'M120 123L78 68C74 62 62 60 58 64L60 118';
const finShape = `${fin}C80 122 100 123 120 123Z`;
const tailWing = 'M98 142L62 158C57 160 57 165 62 165L108 152Z';
const wing = 'M238 150L150 204C144 208 132 208 132 202L178 154Z';
const engine = 'M196 170L236 170C244 170 246 184 236 186L196 186C192 184 192 172 196 170Z';
const intake = 'M236 170C232 174 232 182 236 186';
const cockpit = 'M336 128L352 128L360 137L338 137Z';
const cockpitBar = 'M346 128L347 137';
const doors = 'M318 128L330 128L330 154L318 154ZM112 132L122 132L122 152L112 152Z';
const stripe = 'M84 146C150 147 300 147 364 147L365 151C300 152 150 152 88 151Z';
const windows = Array.from({ length: 13 }, (_, i) => dot(138 + i * 13.5, 136, 3.4)).join('');
// Paper left around the plane, so its colours stay clean (the sun sits on bare paper).
const planeHalo = 'M46 116L52 56L84 56L126 116L322 114C362 114 378 132 376 146C374 162 358 168 340 168L250 168L252 184C222 200 182 220 152 218C128 218 118 210 124 198L162 170L132 170C112 170 90 176 66 174C50 172 44 156 48 140Z';

const sky = `M14 ${f(top[0][1])}L14 130C12 76 50 36 120 28C200 18 270 20 300 34C306 62 322 84 350 92C372 98 388 110 390 150L390 ${f(top[top.length - 1][1])}L${top
  .slice()
  .reverse()
  .map(([x, y]) => `${x} ${f(y)}`)
  .join('L')}Z`;

const speed = 'M8 112L36 110M4 130L42 127M10 148L38 146';

export default {
  title: 'Fly in a plane',
  seed: 233,
  washes: [
    { c: PAL.sky, o: 0.45, d: `${sky}${inP(planeHalo)}${smallCloud}`, rule: 'evenodd' },
    { c: PAL.sky, o: 0.4, d: `${cloudShade}M200 80C210 84 230 84 236 78C230 74 210 74 200 80Z` },
    { c: PAL.grey, o: 0.25, d: cloudShade },
    { c: PAL.ochre, o: 0.8, d: sun },
    { c: PAL.red, o: 0.85, d: inP(`${finShape}${stripe}`) },
    { c: PAL.grey, o: 0.4, d: inP(`${wing}${tailWing}${engine}M130 162C100 162 76 148 62 130C90 150 140 156 200 158C260 158 320 158 352 156C346 159 344 160 340 160Z`) },
    { c: PAL.slate, o: 0.5, d: inP(`${cockpit}M236 170C232 174 232 182 236 186C244 184 244 172 236 170Z`) },
    { c: PAL.sky, o: 0.45, d: inP(windows) },
  ],
  lines: paths([body, fin, tailWing, wing, engine], PT) + paths([sun, cloudTop, smallCloud]),
  fine:
    paths([intake, cockpit, cockpitBar, doors, 'M84 146C150 147 300 147 364 147M88 151C150 152 300 152 365 151', windows], PT) +
    paths([
    rays(352, 52, 27, 40, 12, 7, 8),
    cloudCurls,
    'M184 68c4 -4 10 -4 12 0',
    ]),
  once: `<path d="${speed}" stroke-dasharray="12 5"/>`,
};
