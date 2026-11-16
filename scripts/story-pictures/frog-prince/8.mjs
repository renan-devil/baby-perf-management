import { PAL, zed } from '../lib.mjs';
import { compose, frog, moon, place, princessHead, star } from './characters.mjs';

// The Frog Prince, 8: at night, the frog sleeps on the very edge of the princess's pillow, and the
// princess lies with her back turned to him, cross even in her sleep. Hmph! The moon looks in.
const floor = 'M0 272C90 269 200 274 300 271C340 270 370 272 400 271';
// the bed, seen from the side: tall headboard on the left, low footboard on the right
const headboard = 'M26 272L26 128C26 112 56 112 56 128L56 272M26 150L56 150';
const footboard = 'M372 272L372 196C372 186 388 186 388 196L388 272';
const mattress = 'M56 206L372 206M56 236L372 236';
const pillow = 'M60 202C54 186 62 168 82 170L156 172C172 172 176 192 168 204C140 208 90 208 60 202Z';
const blanket = 'M150 204C156 188 168 182 186 180C200 178 200 178 200 178C232 180 250 176 270 176C310 176 360 180 372 196L372 238C300 244 200 244 140 240C136 228 140 214 150 204Z';
const fold = 'M156 206C176 196 200 194 222 198';
const pattern = 'M220 200l0 0M250 214l0 0M290 202l0 0M320 220l0 0M200 226l0 0M346 206l0 0';
// everything on the bed (pillow, blanket, mattress) stays out of the night-time wash of the room
const bedShape = 'M56 236L56 200C54 186 62 168 82 170L156 172C160 172 163 175 165 179C174 177 186 177 200 178C232 180 250 176 270 176C310 176 360 180 372 196L372 236Z';
// the window with the moon and stars
const win = 'M250 40L350 40L350 130L250 130ZM300 40L300 130M250 85L350 85';

export default compose({
  title: 'Goodnight, frog. Hmph!',
  seed: 58,
  washes: [
    { c: PAL.slate, o: 0.32, rule: 'evenodd', d: `M0 20C100 12 300 12 400 20L400 272L0 272Z${bedShape}` },
    { c: PAL.slate, o: 0.55, d: 'M250 40L350 40L350 130L250 130Z' },
    { c: PAL.terracotta, o: 0.7, d: 'M26 272L26 128C26 112 56 112 56 128L56 272ZM372 272L372 196C372 186 388 186 388 196L388 272Z' },
    { c: PAL.rose, o: 0.55, d: blanket },
  ],
  lines: [floor, headboard, footboard, mattress, pillow, blanket, win],
  fine: [fold, star(4).replace(/(-?\d+) (-?\d+)/g, (m, x, y) => `${+x + 270} ${+y + 60}`), star(3).replace(/(-?\d+) (-?\d+)/g, (m, x, y) => `${+x + 334} ${+y + 112}`), zed(76, 130, 8), zed(88, 112, 11)],
  once: pattern.replace(/l0 0/g, 'l0.1 0'),
  parts: [
    place(moon(16), 'translate(326 62)'),
    place(frog({ mood: 'shut' }), 'translate(76 194) scale(0.95)'),
    place(princessHead({ mood: 'crossShut', crown: false }), 'translate(146 178) rotate(-62) scale(1.6)'),
  ],
});
