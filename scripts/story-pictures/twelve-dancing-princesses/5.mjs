import { PAL, hatch } from '../lib.mjs';
import { P_ARMS, at, bedEnd, compose, place, princess, sparkles, youngest } from './characters.mjs';

// Picture 5: the eldest princess taps her bed three times, and it sinks into the floor: there is a
// secret staircase going down, down, down into the dark. Two of her sisters watch; behind them
// stand the other little beds, all in a row.
const E = 'translate(82 272) scale(1.45)';
const [tx, ty] = at(45, -58, E);
const win = 'M188 128L188 70C188 40 242 40 242 70L242 128Z';
const moon = 'M222 62C214 62 209 70 211 78C213 85 221 88 228 85C222 83 218 78 218 72C218 67 220 64 222 62Z';
const glitter = sparkles([[150, 186, 4], [272, 190, 5], [290, 236, 3.5], [132, 236, 3]]);
// the opening in the floor, in perspective (far edge y = 198, near edge y = 256), with stone steps
// going down from the far edge, darker and darker
const hole = 'M162 198L256 198L274 256L144 256Z';
const xl = (y) => 162 - ((y - 198) * 18) / 58; // left edge of the hole at height y
const xr = (y) => 256 + ((y - 198) * 18) / 58;
const rows = [[198, 208, 211], [211, 221, 224], [224, 234, 237], [237, 247, 250]]; // riser top, tread top, next
const stepLines = rows.map(([, t, n]) => `M${xl(t) + 8} ${t}L${xr(t) - 8} ${t}M${xl(n) + 8} ${n}L${xr(n) - 8} ${n}`).join('');
const stepWashes = rows.map(([a, , n], i) => ({ c: PAL.ink, o: 0.12 + i * 0.13, d: `M${xl(a)} ${a}L${xr(a)} ${a}L${xr(n)} ${n}L${xl(n)} ${n}Z` }));
const walls = `M${xl(198)} 198L${xl(198) + 8} 206L${xl(256) + 8} 256M${xr(198)} 198L${xr(198) - 8} 206L${xr(256) - 8} 256`;
const wallWash = `M162 198L170 206L${xl(256) + 8} 256L144 256ZM256 198L248 206L${xr(256) - 8} 256L274 256Z`;
const taps = `M${tx + 6} ${ty - 6}l5 -5M${tx + 9} ${ty + 1}l7 0M${tx + 6} ${ty + 8}l5 5`;

export default compose({
  title: 'The Secret Staircase',
  seed: 4105,
  washes: [
    { c: PAL.ochre, o: 0.16, d: 'M10 166L390 166L390 280L10 280Z' },
    { c: PAL.slate, o: 0.6, d: win },
    { c: PAL.ochre, o: 0.9, d: moon },
    { c: PAL.grey, o: 0.6, d: hole },
    ...stepWashes,
    { c: PAL.ink, o: 0.5, d: wallWash },
    { c: PAL.ink, o: 0.5, d: 'M144 250L274 250L274 256L144 256Z' },
    { c: PAL.grey, o: 0.35, d: 'M40 270C60 262 120 262 140 270C120 278 60 278 40 270Z' },
  ],
  lines: [hole, 'M136 166L304 166', win],
  fine: [stepLines, walls, taps, moon, 'M215 46L215 128M188 92L242 92', hatch(20, 276, 380, 276, 9, 6, 180, 5)],
  parts: [
    ...[146, 189, 232, 275].map((x, i) => place(bedEnd({ quilt: [PAL.green, PAL.sky, PAL.ochre, PAL.rose][i], empty: true }), `translate(${x} 166) scale(0.62)`)),
    place(princess({ who: 'eldest', mood: 'happy', look: 1, arms: P_ARMS.tap }), E),
    glitter,
    place(youngest({ mood: 'wow', look: -1 }), 'translate(326 232) scale(1.12)'),
    place(princess({ who: 'sister', dress: PAL.green, hair: PAL.slate, mood: 'smile', arms: P_ARMS.clap }), 'translate(366 228) scale(1.04)'),
  ],
});
