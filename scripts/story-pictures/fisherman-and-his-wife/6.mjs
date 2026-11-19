import { PAL, hatch, transformPath } from '../lib.mjs';
import { I_ARMS, I_SIL_QUEEN, compose, ilsebill, place, throne } from './characters.mjs';

// The Fisherman and His Wife, 6: Queen Ilsebill sits on a tall golden throne, with a golden crown on
// her head, a red cloak and a sceptre in her hand. Through the castle window, the sea has turned
// grey and churning.
const floor = 'M0 262C90 260 200 264 300 261C340 260 370 262 400 261';
const T = 'translate(200 262) scale(1.25)';
const sceptre = 'M27 -50L27 -110';
const win = 'M42 168L42 102C42 76 102 76 102 102L102 168Z';
const waves = 'M44 140q7 -8 14 0q7 -8 14 0q7 -8 14 0q7 -8 14 0M44 156q7 -8 14 0q7 -8 14 0q7 -8 14 0q7 -8 14 0';

export default compose({
  title: 'Queen Ilsebill on her golden throne',
  seed: 66,
  washes: [
    { c: PAL.red, o: 0.6, d: 'M146 262L254 262L292 300L108 300Z' },
    { c: PAL.grey, o: 0.75, d: 'M44 132q7 -8 14 0q7 -8 14 0q7 -8 14 0q7 -8 14 0L100 166L44 166Z' },
    { c: PAL.slate, o: 0.45, d: 'M44 132q7 -8 14 0q7 -8 14 0q7 -8 14 0q7 -8 14 0L100 166L44 166Z' },
    { c: PAL.grey, o: 0.3, d: `${floor}L400 300L0 300Z` },
    { c: PAL.ochre, o: 0.9, d: transformPath('M27 -110m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0Z', T) },
  ],
  lines: [floor, win, transformPath(sceptre, T)],
  fine: [
    waves,
    'M72 84L72 168M42 124L102 124',
    transformPath('M27 -110m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0Z', T),
    'M146 262L108 300M254 262L292 300',
    hatch(16, 284, 100, 288, 4, 6, 165, 4),
    hatch(300, 284, 390, 288, 4, 6, 165, 6),
  ],
  parts: [
    place(throne({ cut: I_SIL_QUEEN }), T),
    place(ilsebill({ pose: 'sit', mood: 'proud', arms: I_ARMS.sceptre, head: 'crown', apron: false, cape: true }), T),
  ],
});
