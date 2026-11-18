import { PAL, hatch } from '../lib.mjs';
import { FG_ARMS, at, cinderella, compose, godmother, place, sparkles, wand } from './characters.mjs';

// Cinderella, 3: alone by the kitchen fireplace, Cinderella sits on a little stool in her patched
// apron and cries, tears running down her cheeks. Beside her, in a shower of sparkles, a small round
// old lady appears: her fairy godmother, smiling kindly, her silver star-tipped wand raised.
const floor = 'M8 272C120 269 290 269 394 272';
// the fireplace: a stone chimney breast with a mantel shelf, a dark arched opening, logs and flames
const chimney = 'M16 272L16 112L136 112L136 272';
const mantel = 'M6 100L146 100L146 112L6 112Z';
const opening = 'M34 272L34 190C34 160 118 160 118 190L118 272Z';
const stones = 'M16 146L34 146M118 146L136 146M16 186L34 186M118 196L136 196M16 230L34 230M118 236L136 236M25 112L25 146M127 146L127 196M25 186L25 230M127 236L127 272';
const logs = 'M46 268C44 262 50 258 56 260L98 260C104 258 108 264 104 268ZM52 258C50 252 56 248 62 250L92 250C98 248 102 254 98 258Z';
const flames = 'M50 250C42 232 52 218 56 202C62 216 66 224 68 234C70 214 76 198 80 180C88 198 94 214 94 232C98 224 100 216 104 208C112 224 110 240 102 250Z';
const inner = 'M60 250C56 240 62 232 66 224C70 232 74 238 76 244C80 232 82 222 84 214C90 226 92 240 88 250Z';
// the little wooden stool under Cinderella (its ends show on each side of her skirt)
const stoolEnds = 'M162 226L152 226L152 236L162 236M248 226L258 226L258 236L248 236';
const stoolLegs = 'M155 236L153 272M255 236L257 272';

const gmT = 'translate(330 270) scale(-1.62 1.62)';
const [hx, hy] = at(44, -74, gmT);

export default compose({
  title: 'Crying by the Fire',
  seed: 1203,
  washes: [
    { c: PAL.grey, o: 0.3, d: 'M14 270C120 262 290 262 388 270C384 280 290 284 200 284C120 284 16 280 14 270Z' },
    { c: PAL.grey, o: 0.75, d: `${chimney}Z${mantel}${opening}`, rule: 'evenodd' },
    { c: PAL.terracotta, o: 0.3, d: mantel },
    { c: PAL.slate, o: 0.9, d: `${opening}${flames}`, rule: 'evenodd' },
    { c: PAL.ink, o: 0.3, d: `${opening}${flames}`, rule: 'evenodd' },
    { c: PAL.terracotta, o: 0.9, d: logs },
    { c: PAL.red, o: 0.85, d: flames },
    { c: PAL.ochre, o: 1, d: flames },
    { c: PAL.ochre, o: 0.4, d: 'M30 272C30 246 52 232 76 232C100 232 122 246 122 272Z' },
    { c: PAL.terracotta, o: 0.85, d: 'M162 226L152 226L152 236L162 236ZM248 226L258 226L258 236L248 236ZM153 236L157 236L155 272L151 272ZM253 236L257 236L259 272L255 272Z' },
  ],
  after: [{ c: PAL.ochre, o: 0.9, d: inner }],
  lines: [floor, chimney, mantel, opening, logs, stoolEnds, stoolLegs],
  fine: [stones, flames, inner, hatch(138, 262, 150, 266, 3, 5, -100, 4)],
  parts: [
    place(cinderella({ sit: true, mood: 'sad', tilt: -8 }), 'translate(205 226) scale(1.45)'),
    place(godmother({ mood: 'smile', arms: FG_ARMS.wave, tilt: 4 }), gmT),
    wand(hx, hy, hx - 24, hy - 34, 9),
    sparkles([
      [hx - 38, hy - 50, 7],
      [hx - 4, hy - 58, 5],
      [266, 150, 4],
      [hx + 24, hy - 44, 4],
      [386, 150, 5],
      [386, 226, 5],
      [276, 210, 4],
      [370, 70, 5],
    ]),
  ],
});
