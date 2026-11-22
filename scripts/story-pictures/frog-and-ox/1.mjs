import { PAL, rays, tufts } from '../lib.mjs';
import { compose, dot, frog, lilyPad, ox, place } from './characters.mjs';

// The Frog and the Ox, 1 (cover): a little green frog sits on her lily pad by the pond and gazes up,
// and up, and up at the big brown ox standing in the meadow.
const OXT = 'translate(278 228) scale(1.25)';
const PADT = 'translate(92 254) scale(1.4)';
const FROGT = 'translate(90 254) scale(1.65)';
const meadow = 'M0 196C80 190 160 194 240 190C300 187 360 190 400 188L400 300L0 300Z';
const horizon = 'M0 196C20 194.5 38 193.6 52 193.2M128 192.4C136 192.4 142 192.5 146 192.5';
const pond = 'M8 252C6 228 60 218 120 220C180 222 214 236 210 256C206 276 160 290 100 288C40 286 10 274 8 252Z';
const ripples = 'M150 272c8 -3 16 -3 24 0M30 270c6 -2 12 -2 18 0M168 236c6 -2 12 -2 18 0';
// reeds at the edge of the pond, with a bulrush or two
const reeds = 'M198 236C196 220 196 206 200 190M206 240C206 224 208 214 214 202M18 234C16 222 14 212 10 202';
const rushes = 'M197 205C195 198 197 190 200 186C203 190 203 198 201 205ZM9 210C7 203 8 196 10 192C13 196 13 203 11 210Z';
// a second little lily pad with a flower bud
const bud = 'M168 254C166 248 170 242 172 240C174 242 178 248 176 254Z';

export default compose({
  title: 'The Frog and the Ox',
  seed: 307,
  washes: [
    { c: PAL.green, o: 0.36, d: meadow },
    { c: PAL.sky, o: 0.55, d: pond },
    { c: PAL.ochre, o: 0.7, d: dot(52, 52, 14) },
    { c: PAL.rose, o: 0.8, d: bud },
    { c: PAL.ochre, o: 0.7, d: rushes },
  ],
  lines: [horizon, pond],
  fine: [
    ripples,
    reeds,
    rushes,
    bud,
    dot(52, 52, 14),
    rays(52, 52, 19, 28, 9, 4),
    tufts([[230, 196], [384, 192], [250, 234], [370, 236], [312, 268], [220, 286]], 9, 5),
  ],
  parts: [place(lilyPad(70), PADT), place(lilyPad(30), 'translate(172 256)'), place(ox(), OXT), place(frog({ mood: 'wow', look: [1.3, -1.4] }), FROGT)],
});
