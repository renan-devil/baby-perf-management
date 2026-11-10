import { PAL, hatch, rays, tufts } from '../lib.mjs';
import { PETER_ARMS, compose, dot, peter, place, right, sheep, wolf } from './characters.mjs';

// The Boy Who Cried Wolf, 4: one evening, as the sun goes down, a real wolf creeps out of the dark
// wood towards the sheep, and Peter shouts "WOLF!" with all his might.
const ground = 'M0 262C100 257 300 255 400 262';
const groundWash = `${ground}L400 300L0 300Z`;

// the sunset sky, in bands
const skyRose = 'M0 40C120 30 300 50 400 36L400 190C300 196 120 184 0 194Z';
const skyGold = 'M0 176C120 168 300 184 400 172L400 264L0 264Z';

// the dark wood on the left: a row of shaggy treetops above a few trunks (its edge is inked only
// above the wolf, so no line crosses him)
const woodEdge = 'M0 20C14 10 34 20 36 38C50 28 72 40 68 64C86 62 98 84 88 104C104 110 108 134 96 148C110 160 106 186 92 194';
const wood = `M0 264L0 20${woodEdge.slice(woodEdge.indexOf('C'))}C102 212 96 240 100 264Z`;
const crowns = 'M36 38C30 50 34 64 46 70M68 64C60 72 58 86 66 94M88 104C78 110 76 124 82 132M96 148C86 154 84 168 90 176';
const trunks = 'M20 262L22 200M44 262L46 214';

// the setting sun, low in the sky
const sun = dot(252, 194, 20);

// shout marks around Peter
const shout = 'M324 132C318 140 318 154 324 162M312 124C304 136 304 158 312 170M396 132C400 140 400 154 396 162';

export default compose({
  title: 'A real wolf',
  seed: 94,
  washes: [
    { c: PAL.slate, o: 0.3, d: 'M0 0L400 0L400 52C300 60 120 44 0 56Z' },
    { c: PAL.rose, o: 0.38, d: skyRose },
    { c: PAL.ochre, o: 0.5, d: skyGold },
    { c: PAL.red, o: 0.45, d: sun },
    { c: PAL.ochre, o: 0.6, d: sun },
    { c: PAL.green, o: 0.55, d: groundWash },
    { c: PAL.slate, o: 0.3, d: groundWash },
    { c: PAL.slate, o: 0.92, d: wood },
    { c: PAL.slate, o: 0.5, d: wood },
    { c: PAL.ink, o: 0.35, d: 'M0 264L0 90C30 80 60 110 70 150C80 190 84 230 90 264Z' },
  ],
  lines: [ground, woodEdge],
  fine: [sun, rays(252, 194, 26, 36, 11, 9, 10), crowns, trunks, shout, tufts([[112, 259], [262, 256], [334, 257], [392, 261]], 8, 16), hatch(110, 288, 380, 288, 8, 7, 168, 17)],
  parts: [
    place(wolf(), 'translate(136 266) scale(1.05)'),
    place(sheep({ head: 'munch' }), 'translate(306 266) scale(-0.95 0.95)'),
    place(peter({ mood: 'shout', arms: [PETER_ARMS.up, right(PETER_ARMS.up)] }), 'translate(362 262) scale(1.2)'),
  ],
});
