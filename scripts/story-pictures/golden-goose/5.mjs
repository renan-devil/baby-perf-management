import { PAL, hatch } from '../lib.mjs';
import { PRINCESS_HEAD, at, burst, compose, dot, place, princess } from './characters.mjs';

// The Golden Goose, 5: at last the sad princess laughs! She leans at her palace window, holds her
// tummy and laughs and laughs (ha ha ha!) at the silly line going past below.
const P = 'translate(200 240) scale(1.95)';

// The palace tower with its battlements, and the arched window she looks out of.
const L = 96;
const R = 304;
const wallTop = `M${L} 40L${L} 18L120 18L120 32L146 32L146 18L172 18L172 32L228 32L228 18L254 18L254 32L280 32L280 18L${R} 18L${R} 40`;
const wallSides = `M${L} 40L${L} 294M${R} 40L${R} 294`;
const wall = `${wallTop}L${R} 294L${L} 294Z`;
const archIn = 'M132 240L132 110C132 30 268 30 268 110L268 240';
const archOut = 'M120 240L120 108C120 20 280 20 280 108L280 240';
const sill = 'M110 240L290 240L294 254L106 254Z';
const opening = `${archIn}Z`;
const rim = `${archOut}L268 240L268 110C268 30 132 30 132 110L132 240Z`;
const stones =
  `M${L} 76L120 76M280 76L${R} 76M${L} 120L120 120M280 120L${R} 120M${L} 164L120 164M280 164L${R} 164M${L} 206L120 206M280 206L${R} 206M${L} 276L${R} 276` +
  `M108 40L108 76M292 40L292 76M110 120L110 164M290 120L290 164M108 206L108 240M292 206L292 240M150 254L150 276M200 254L200 276M250 254L250 276`;

const [hx, hy] = at(P, ...PRINCESS_HEAD);
// Laughter: bursts on both sides of her head, bouncy "ha ha" loops and two happy tears.
const loops = (x, y, s) => `M${x} ${y}q${2 * s} ${-7 * s} ${4 * s} 0q${2 * s} ${-7 * s} ${4 * s} 0q${2 * s} ${-7 * s} ${4 * s} 0`;
const tears = dot(hx - 19, hy + 3, 2.4) + dot(hx + 18, hy - 2, 2.4);

export default compose({
  title: 'The princess laughs and laughs',
  seed: 75,
  washes: [
    { c: PAL.grey, o: 0.42, d: `${wall}${archOut}Z`, rule: 'evenodd' },
    { c: PAL.ochre, o: 0.15, d: `${wall}${archOut}Z`, rule: 'evenodd' },
    { c: PAL.slate, o: 0.3, d: opening },
    { c: PAL.ochre, o: 0.5, d: rim },
    { c: PAL.grey, o: 0.6, d: sill },
    { c: PAL.sky, o: 0.95, d: tears },
  ],
  lines: [wallTop, wallSides, archIn, archOut, sill],
  fine: [
    stones,
    tears,
    hatch(100, 290, 300, 290, 7, 6, 160, 4),
    burst(hx - 8, hy - 2, 46, 60, 5, 7, 150),
    burst(hx + 8, hy - 2, 46, 60, 5, 9, -30),
    loops(30, 92, 2.4),
    loops(332, 74, 2.4),
    loops(22, 160, 2),
    loops(342, 146, 2),
    loops(40, 222, 1.7),
    loops(330, 214, 1.7),
  ],
  parts: [place(princess({ mood: 'laugh', tilt: -8 }), P)],
});
