import { PAL, hatch } from '../lib.mjs';
import { M_ARMS, compose, dot, mother, place, pot } from './characters.mjs';

// Sweet Porridge, 4: the mother has forgotten the words! Golden porridge billows up out of the little
// pot, over the table and in thick drips down to the kitchen floor, where it spreads into a great
// puddle round her feet. She throws up her hands: oh dear, oh dear! Blub, blub, splodge!
// the floor line only shows beyond the puddle
const floor = 'M340 263C360 262 380 262 400 261';
const tableTop = 'M22 168L202 168L202 180L22 180Z';
// the band's lower edge, broken where the drips pour over it
const tableInk = 'M22 180L22 168L202 168L202 180M22 180L60 180M88 180L93 180M107 180L123 180M147 180L153 180M167 180L202 180';
const legs = 'M34 180L36 262M48 180L48 262M188 180L186 262M174 180L174 262';
const legFill = 'M34 180L48 180L48 262L36 262ZM174 180L188 180L186 262L174 262Z';
const P = 'translate(112 169) scale(1.45)';

// the great heap of porridge billowing out of the pot's mouth (84 to 140 at y 121)
const heap =
  'M84 122C66 116 60 96 74 86C70 70 88 58 102 64C108 48 132 46 140 62C156 58 168 74 160 88C172 98 162 116 140 122';
// porridge on the table top, behind the pot (the pot's belly spans 92 to 132)
const layer = 'M20 174C16 160 40 154 60 158C72 160 80 160 92 161L132 161C150 156 176 152 194 158C208 162 208 172 204 176Z';
const layerLines = ['M20 174C16 160 40 154 60 158C72 160 80 160 90 161', 'M134 161C150 156 176 152 194 158C208 162 208 172 204 176'];
// thick drips pouring over the front of the table: long ones reach the floor and flare into the
// puddle (open at the bottom), short ones end in a round blob
const f = (n) => Math.round(n * 10) / 10;
const tongue = (x, w, y2, long) => {
  const [l, r, k] = [x - w / 2, x + w / 2, y2 - 172];
  const left = `M${f(l)} 172C${f(l - 2)} ${f(172 + k * 0.4)} ${f(l + 2)} ${f(172 + k * 0.7)} ${f(l - (long ? 8 : 0))} ${y2}`;
  const right = `M${f(r + (long ? 8 : 0))} ${y2}C${f(r - 2)} ${f(172 + k * 0.7)} ${f(r + 2)} ${f(172 + k * 0.4)} ${f(r)} 172`;
  const bottom = long ? `L${f(r + 8)} ${y2}` : `C${f(l)} ${f(y2 + w * 0.7)} ${f(r)} ${f(y2 + w * 0.7)} ${f(r)} ${y2}`;
  return { ink: long ? [left, right] : [`${left}${bottom.replace(/^C/, 'C')}C${f(r + 2)} ${f(172 + k * 0.7)} ${f(r - 2)} ${f(172 + k * 0.4)} ${f(r)} 172`], fill: `${left}${bottom}C${f(r - 2)} ${f(172 + k * 0.7)} ${f(r + 2)} ${f(172 + k * 0.4)} ${f(r)} 172Z` };
};
const drips = [tongue(70, 18, 262, true), tongue(100, 12, 214), tongue(135, 20, 262, true), tongue(160, 12, 204)];
// the puddle spreading over the floor, right round the mother's feet (its far edge stops behind her)
const puddle =
  'M-4 258C10 252 20 254 30 256C40 258 50 260 54 260L94 260L117 260L153 260C166 256 180 254 198 255C220 252 240 256 262 254C284 250 300 256 318 258C340 260 362 264 368 272C372 282 352 286 330 288C250 296 100 296 -4 296Z';
const puddleTop = ['M-4 258C10 252 20 254 30 256C40 258 50 260 54 260', 'M86 260L117 260', 'M153 260C166 256 180 254 198 255C220 252 240 256 264 255', 'M336 259C350 262 364 266 368 272C372 282 352 286 330 288'];
const porridge = `${layer}${drips.map((t) => t.fill).join('')}${puddle}${heap}Z`;
const bubbles = [dot(96, 80, 4), dot(132, 74, 3), dot(116, 100, 2.6), dot(148, 98, 2.2), dot(84, 104, 2), dot(40, 276, 3.4), dot(150, 282, 2.6), dot(232, 272, 3), dot(342, 276, 2.4), dot(176, 166, 2.2), dot(40, 166, 2)];
// blobs of porridge flying out of the heap, and "blub" marks
const blobs = 'M58 52C54 46 60 40 66 44C70 50 64 56 58 52ZM170 48C168 42 176 38 180 44C182 50 174 52 170 48ZM186 82C186 78 192 76 194 80C194 84 188 86 186 82Z';
const pops = 'M64 34l-3 -7M72 36l3 -8M162 36l-4 -6M174 32l2 -8M196 72l6 -4M198 84l7 1';
// alarm marks round the mother's head
const alarm = 'M244 98l-10 -6M240 116l-12 -2M248 80l-6 -9M358 98l10 -6M362 116l12 -2M352 80l6 -9';
const sweat = 'M336 112c-3 5 -3 8 0 9c3 -1 3 -4 0 -9Z';

export default compose({
  title: 'Oh dear, oh dear!',
  seed: 149,
  washes: [
    { c: PAL.grey, o: 0.25, d: 'M0 258C100 255 200 260 300 257C340 256 370 258 400 257L400 298C300 300 100 299 0 298Z' },
    { c: PAL.terracotta, o: 0.6, d: legFill },
    { c: PAL.ochre, o: 0.8, d: tableTop },
    { c: PAL.terracotta, o: 0.45, d: tableTop },
    { c: PAL.sky, o: 0.8, d: sweat },
  ],
  after: [{ c: PAL.ochre, o: 0.85, d: `${porridge}${blobs}` }],
  lines: [floor, tableInk, legs, heap, ...layerLines, ...drips.flatMap((t) => t.ink), ...puddleTop],
  fine: [...bubbles, blobs, pops, alarm, sweat, 'M76 96q6 -6 12 -2M142 80q6 -2 10 4', hatch(10, 284, 390, 288, 10, 7, 172, 9)],
  parts: [
    place(pot({ inside: 'flood' }), P),
    place(mother({ mood: 'wow', tilt: 4, arms: M_ARMS.up }), 'translate(300 274) scale(1.15)'),
  ],
});
