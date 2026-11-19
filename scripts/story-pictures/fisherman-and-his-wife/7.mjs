import { PAL, hatch } from '../lib.mjs';
import { F_ARMS, I_ARMS, I_SIL_EMPRESS, compose, fisherman, ilsebill, place, throne } from './characters.mjs';

// The Fisherman and His Wife, 7: Empress Ilsebill sits on a throne as high as a house, on top of a
// great flight of steps, with a crown as big as a bucket. Far below, the fisherman looks tiny: he
// stands on tiptoe, waves and shouts up to her, "Wife! Are you happy now?" Through the window, the sea
// is black.
const floor = 'M0 268C90 266 200 270 300 267C340 266 370 268 400 267';
const T = 'translate(200 150) scale(0.72)';
const tiers = 'M118 268L118 238L136 238L136 208L152 208L152 178L166 178L166 150L234 150L234 178L248 178L248 208L264 208L264 238L282 238L282 268';
const ledges = 'M136 238L264 238M152 208L248 208M166 178L234 178';
const carpet = 'M190 150L190 268M210 150L210 268';
const win = 'M318 150L318 92C318 66 374 66 374 92L374 150Z';

export default compose({
  title: 'Empress Ilsebill on her enormous throne',
  seed: 67,
  washes: [
    { c: PAL.ochre, o: 0.55, d: `${tiers}Z` },
    { c: PAL.grey, o: 0.3, d: `${tiers}Z` },
    { c: PAL.red, o: 0.72, d: 'M190 150L210 150L210 268L190 268Z' },
    { c: PAL.ink, o: 0.55, d: 'M320 118q7 -8 14 0q7 -8 14 0q7 -8 14 0q7 -8 12 0L372 148L320 148Z' },
    { c: PAL.slate, o: 0.6, d: 'M320 118q7 -8 14 0q7 -8 14 0q7 -8 14 0q7 -8 12 0L372 148L320 148Z' },
    { c: PAL.grey, o: 0.3, d: `${floor}L400 300L0 300Z` },
  ],
  lines: [floor, tiers, win],
  fine: [
    ledges,
    carpet,
    'M190 162L210 162M190 192L210 192M190 222L210 222M190 252L210 252',
    'M346 74L346 150M318 112L374 112',
    'M320 132q7 -8 14 0q7 -8 14 0q7 -8 14 0q7 -8 12 0',
    hatch(16, 284, 390, 288, 12, 6, 165, 4),
    'M92 206l7 -7M96 216l10 -3M86 198l3 -9', // the fisherman's shout reaching up
  ],
  parts: [
    place(throne({ h: 175, cut: I_SIL_EMPRESS }), T),
    place(ilsebill({ pose: 'sit', mood: 'proud', arms: I_ARMS.lap, head: 'bigCrown', apron: false, cape: true }), T),
    place(fisherman({ mood: 'shout', arms: F_ARMS.wave, look: [1, -1.5] }), 'translate(70 268) scale(0.5)'),
  ],
});
