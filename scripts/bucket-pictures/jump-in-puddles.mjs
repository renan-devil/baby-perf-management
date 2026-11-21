// Jump in puddles: yellow wellington boots landing in a puddle, a crown of splash and drops, a little rain.
import { PAL, paths, transformPath } from '../story-pictures/lib.mjs';

// A wellington boot seen from the side, toe to the right, drawn with the back of its heel at (0,0).
const bootShape =
  'M0 -2C0 -34 1 -66 2 -96C14 -99 28 -99 40 -98C40 -78 41 -58 44 -42C58 -36 76 -30 86 -22C94 -16 96 -8 94 0L-2 0Z';
const bootOutline =
  'M2 -96C1 -66 0 -34 0 -4C0 -1 -2 0 -2 0L94 0C96 -8 94 -16 86 -22C76 -30 58 -36 44 -42C41 -58 40 -78 40 -98';
const bootTop = 'M2 -96C6 -103 36 -104 40 -98C36 -93 6 -92 2 -96Z';
const bootBand = 'M1 -86C14 -89 28 -89 40 -88';
const bootSole = 'M-1 -7C30 -7 60 -7 93 -7M28 -7L30 0';
const bootShine = 'M8 -82C8 -60 8 -40 9 -20C11 -40 12 -62 12 -82Z';

// Two boots, one just behind the other; only the back one's heel, back and top show.
const B1 = 'translate(144 234) scale(1.15)';
const B2 = 'translate(176 244) scale(1.15)';
const backBoot = 'M2 -96C1 -66 0 -34 0 -4C0 -1 -2 0 -2 0L24 0M1 -86C10 -88 18 -88 24 -88';
const backBootShape = 'M-2 0L25 0L25 -90L40 -92L40 -98C28 -99 14 -99 2 -96C1 -66 0 -34 0 -4Z';

// Legs in red tights, knees bent from the landing, coming down from above the picture.
const frontLeg = 'M184 132C188 110 196 86 206 66C196 46 186 26 178 8M218 134C226 110 236 82 244 56C246 46 240 38 232 30C224 22 216 14 210 6';
const backLeg = 'M152 122C156 100 164 78 174 58C166 40 156 22 148 6';
const knee = 'M226 50c4 4 6 8 6 12';

// The puddle, and the splash rising around the boots like a crown, a drop above each point.
const puddle = 'M40 258C38 238 118 230 214 230C312 230 392 238 388 258C386 276 300 284 214 284C120 284 42 278 40 258Z';
const crownLeft =
  'M150 244C146 230 142 214 138 198C136 206 134 212 132 216C128 206 122 196 116 188C116 198 116 208 114 216C108 208 102 202 96 198C98 208 100 216 100 224C94 218 86 214 80 212C88 222 96 234 100 248';
const crownRight =
  'M284 248C290 234 294 214 296 198C298 206 300 212 302 216C306 206 312 196 318 188C318 198 318 208 320 216C326 208 332 202 338 198C336 208 334 216 334 224C340 218 348 214 354 212C346 222 338 236 334 250';
const crownFront =
  'M138 254C148 246 156 246 164 250C172 243 182 243 190 250C200 244 210 244 218 250C228 243 238 243 246 250C256 244 266 244 274 250C280 245 288 246 294 254';
// Each side of the crown is drawn small, then made taller from its base.
const CL = 'translate(124 246) scale(1.3) translate(-124 -246)';
const CR = 'translate(310 248) scale(1.3) translate(-310 -248)';
const crown = transformPath(crownLeft, CL) + transformPath(crownRight, CR);
const balls = [
  ...[[138, 188, 3.6], [116, 178, 4], [94, 188, 3.6], [76, 204, 3.4]].map(([x, y, r]) => [124 + (x - 124) * 1.3, 246 + (y - 246) * 1.3, r]),
  ...[[296, 188, 3.6], [318, 178, 4], [340, 188, 3.6], [358, 204, 3.4]].map(([x, y, r]) => [310 + (x - 310) * 1.3, 248 + (y - 248) * 1.3, r]),
].map(([x, y, r]) => `M${x - r} ${y}C${x - r} ${y - r * 1.3} ${x + r} ${y - r * 1.3} ${x + r} ${y}C${x + r} ${y + r * 1.3} ${x - r} ${y + r * 1.3} ${x - r} ${y}Z`);
const drop = (x, y, s = 1, a = 0) =>
  transformPath('M0 -6C-3 -1 -4 2 -4 4C-4 7 4 7 4 4C4 2 3 -1 0 -6Z', `translate(${x} ${y}) rotate(${a}) scale(${s})`);
const drops = [
  drop(52, 170, 1.1, -45),
  drop(86, 132, 1, -25),
  drop(130, 128, 0.9, -8),
  drop(34, 214, 0.9, -65),
  drop(382, 170, 1.1, 45),
  drop(348, 132, 1, 25),
  drop(304, 128, 0.9, 8),
  drop(380, 222, 0.9, 65),
];
const ripples = 'M60 260C70 270 100 276 130 278M300 278C330 276 360 270 370 260M190 274c14 3 34 3 48 0';
const rain =
  'M40 40l-5 16M74 76l-5 16M30 110l-5 16M108 24l-5 16M120 90l-4 12M330 36l-5 16M362 80l-5 16M290 92l-5 16M380 116l-4 12M276 30l-5 16M262 132l-4 12';

export default {
  title: 'Jump in puddles',
  seed: 277,
  washes: [
    // the puddle and its reflections
    { c: PAL.sky, o: 0.62, d: 'M42 256C40 238 120 232 214 232C310 232 390 240 386 258C384 274 300 282 214 282C120 282 44 276 42 256Z' },
    { c: PAL.slate, o: 0.28, d: 'M90 262C120 250 300 250 340 262C320 272 120 274 90 262Z' },
    { c: PAL.ochre, o: 0.35, d: 'M150 252C160 262 156 270 166 278L196 278C188 268 196 262 190 252ZM210 254C230 262 270 262 290 254C282 262 260 268 236 268C224 266 216 262 210 254Z' },
    // raincoat, tights, boots
    { c: PAL.red, o: 0.7, d: 'M152 124C156 100 164 78 174 58C166 40 156 22 148 6L210 6C216 14 224 22 232 30C240 38 246 46 244 56C236 82 226 110 218 136L184 134Z' },
    { c: PAL.slate, o: 0.3, d: 'M152 124C156 100 164 78 174 58C166 40 156 22 148 6L178 8C186 26 196 46 206 66C196 86 188 110 184 134Z' },
    { c: PAL.ochre, o: 0.88, d: transformPath(bootShape, B2) + transformPath(backBootShape, B1) },
    { c: PAL.terracotta, o: 0.3, d: transformPath(backBootShape, B1) + transformPath('M30 -42C50 -34 76 -26 88 -18C94 -10 94 -4 92 -1L30 -1Z', B2) },
    // the splash
    { c: PAL.sky, o: 0.6, d: transformPath(crownLeft + 'Z', CL) + transformPath(crownRight + 'Z', CR) + drops.join('') + balls.join('') },
    { c: PAL.sky, o: 0.5, d: crownFront + 'L292 258L138 258Z' },
  ],
  whites: transformPath(bootShine, B2) + transformPath('M14 -96C20 -99 30 -99 36 -98C30 -96 20 -96 14 -96Z', B2),
  lines:
    paths([frontLeg, backLeg, puddle, crown, crownFront]) +
    paths([bootOutline, bootTop], B2) +
    paths([backBoot, bootTop], B1),
  fine: paths([knee, ...drops, ...balls, ripples, rain]) + paths([bootBand, bootSole], B2),
};
