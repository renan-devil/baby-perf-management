import { PAL, hatch, zed } from '../lib.mjs';
import { compose, dot, place, thumbHead, toad } from './characters.mjs';

// Thumbelina, 2: Thumbelina sleeps in her walnut-shell cradle on the windowsill, and a big wet toad
// peeps in through the broken window pane.
const sill = 'M0 256L400 256M0 276C130 274 270 277 400 275';
const frame = 'M236 256L236 36L394 36L394 256M236 36C290 33 350 38 394 36';
// the jagged hole in the pane, round the toad's head
const hole = 'M236 222L244 200L238 178L262 166L270 146L290 156L310 132L326 152L348 140L356 166L378 170L374 194L394 204';
const holeFill = `${hole}L394 256L236 256Z`;
const cracks = 'M262 166L254 128M270 146L276 102M310 132L314 84M348 140L366 106M378 170L394 160M244 200L236 192M276 102l-10 -12M314 84l10 -14';
const shell = 'M18 206C20 244 70 264 124 264C178 264 226 244 228 206';
const shellRim = 'M18 206C60 216 186 216 228 206C214 198 32 198 18 206Z';
const wrinkles = 'M40 228C62 242 86 246 108 246M136 250C162 250 186 242 206 228M66 254C88 260 108 262 124 262M54 220q10 8 26 10M168 234q16 -4 30 -12';
const pillow = 'M24 196C14 168 34 144 66 146C96 148 108 170 100 192C90 206 40 210 24 196Z';
const blanket = 'M70 204C90 186 176 178 228 196C224 212 190 218 156 218C120 218 84 216 70 204Z';
const moon = 'M86 50C74 58 72 78 86 88C68 90 58 76 60 64C62 50 74 44 86 50Z';

export default compose({
  title: 'The toad at the window',
  seed: 102,
  washes: [
    { c: PAL.sky, o: 0.35, d: `M236 36L394 36L394 256L236 256Z${holeFill}`, rule: 'evenodd' },
    { c: PAL.ochre, o: 0.85, d: moon },
    { c: PAL.ochre, o: 0.5, d: 'M0 256L400 256L400 276C270 277 130 274 0 276Z' },
    { c: PAL.terracotta, o: 0.4, d: 'M0 256L400 256L400 276C270 277 130 274 0 276Z' },
    { c: PAL.terracotta, o: 0.75, d: `${shell}Z` },
    { c: PAL.ochre, o: 0.6, d: `${shell}Z` },
    { c: PAL.ochre, o: 0.7, d: shellRim },
    { c: PAL.sky, o: 0.6, d: pillow },
  ],
  after: [{ c: PAL.red, o: 0.55, d: blanket }, { c: PAL.rose, o: 0.5, d: blanket }],
  lines: [sill, frame, hole, shell, shellRim, pillow, blanket],
  fine: [
    cracks,
    wrinkles,
    'M130 190q24 10 48 8M176 202q22 2 44 -2',
    hatch(20, 266, 380, 266, 12, 6, 170, 4),
    zed(120, 140, 11),
    zed(144, 112, 14),
    zed(174, 80, 17),
    dot(150, 40, 1.5) + dot(200, 66, 1.5) + dot(30, 110, 1.5) + dot(206, 140, 1.4),
  ],
  parts: [
    place(thumbHead({ mood: 'sleep' }), 'translate(66 178) rotate(-22) scale(1.7)'),
    place(toad(), 'translate(316 256) scale(1.08)'),
  ],
});
