import { PAL, hatch, tufts } from '../lib.mjs';
import { GB_ARMS, compose, fox, gingerbread, place } from './characters.mjs';

// The Gingerbread Man, 4: he has come to a wide river and cannot swim. Out from behind a bush comes
// the Fox, with his bushy red tail and a very big smile: "Hello, little man..."
const GY = 272;
const river = 'M0 122C100 116 220 120 400 114L400 212C260 218 120 214 0 218Z';
// the river is left unpainted round the Gingerbread Man, so he stays gingerbread-brown
const halo = 'M88 218C88 206 92 199 98 195C89 184 91 151 116 149C141 151 143 184 134 195C140 199 144 206 144 218Z';
// the banks' lines stop where the two of them stand in front of the river
const banks = 'M0 122C60 119 120 118 226 117M292 116C330 115 370 115 400 114M0 218C30 217 50 216 74 216M158 215C180 215 196 215 206 215';
const ripples = 'M18 150q8 -4 16 0t16 0M176 140q8 -4 16 0t16 0M318 134q8 -4 16 0t16 0M20 190q8 -4 16 0t16 0M172 184q8 -4 16 0M360 160q6 -3 12 0t12 0';
const farBank = 'M0 122C100 116 220 120 400 114L400 94C300 100 200 98 100 102C60 104 20 106 0 108Z';
const reeds = 'M30 118q-2 -14 -6 -22M36 118q1 -14 4 -24M300 116q-2 -12 -6 -20M306 116q2 -12 6 -22';
// the bush he stepped out from
const bush = 'M340 228C330 218 334 200 348 198C348 184 364 176 376 184C384 172 400 174 404 186L404 230C380 234 356 234 340 228Z';
// a worried little wobble beside the Gingerbread Man
const worry = 'M62 140q-4 -6 0 -12M54 154q-6 -4 -6 -10';

export default compose({
  title: 'Hello, little man',
  seed: 64,
  washes: [
    { c: PAL.green, o: 0.3, d: farBank },
    { c: PAL.sky, o: 0.55, d: `${river}${halo}`, rule: 'evenodd' },
    { c: PAL.green, o: 0.4, d: 'M0 218C120 214 260 218 400 212L400 300L0 300Z' },
    { c: PAL.green, o: 0.65, d: bush },
  ],
  lines: [banks],
  fine: [
    ripples,
    reeds,
    worry,
    'M340 228C330 218 334 200 348 198C348 184 364 176 376 184C384 172 400 174 404 186',
    'M356 210c3 -5 8 -5 10 0M380 196c3 -5 8 -5 10 0',
    tufts([[22, 254], [176, 262], [214, 252]], 9, 2),
    hatch(20, 290, 380, 292, 12, 7, 172, 2),
  ],
  parts: [
    place(gingerbread({ arms: GB_ARMS.down, mood: 'worried' }), `translate(116 ${GY}) scale(1.4)`),
    place(fox({ mood: 'sly' }), `translate(286 ${GY}) scale(-1.18 1.18)`),
  ],
});
