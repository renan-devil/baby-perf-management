import { PAL } from '../lib.mjs';
import { G_ARMS, compose, dot, girl, neighbour, place } from './characters.mjs';

// Sweet Porridge, 5: a river of golden porridge pours out of the little house's door and flows down
// the street, past the next house (it oozes from that window too); a neighbour has climbed onto his
// roof and waves his arms. The little girl comes running home, cups her hands round her mouth and
// calls as loud as she can: "STOP, LITTLE POT!"
const f = (n) => Math.round(n * 10) / 10;
// the little girl's house (left) and the next house, with terracotta roofs
const wallA = 'M22 178L22 104L118 104L118 178';
const roofA = 'M10 108L70 58L130 108Z';
const doorA = 'M56 178L56 140C56 130 84 130 84 140L84 178';
const winA = 'M30 118L48 118L48 136L30 136ZM92 118L110 118L110 136L92 136Z';
const wallB = 'M146 178L146 112L242 112L242 178';
const roofB = 'M134 114L196 66L258 114Z';
const chimney = 'M220 86L220 68L234 68L234 97';
const doorB = 'M178 178L178 146C178 136 202 136 202 146L202 178';
const winB = 'M216 128L234 128L234 146L216 146Z';
const bars = 'M39 118L39 136M30 127L48 127M101 118L101 136M92 127L110 127M225 128L225 146';
const tiles = 'M40 92l12 -2M80 84l14 2M58 72l12 0M162 96l14 -2M210 92l12 2M188 80l12 0';
// the street (its line hidden where the porridge covers it), and the river of porridge pouring out
// of both doors and flowing down the street towards us
const street = 'M0 178L22 178M118 178L146 178M242 178L400 178';
const river = 'M56 178L84 178L178 178L202 178C214 196 236 214 250 236C258 252 244 276 236 300L-4 300L-4 226C20 214 44 200 56 178Z';
const riverInk = ['M56 178C44 200 20 214 -4 226', 'M202 178C214 196 236 214 250 236C258 252 244 276 236 300'];
// porridge filling the doorways, and oozing out of the next house's window and down its wall
const inDoors = 'M56 178L56 156C62 150 68 154 74 150C78 148 84 152 84 156L84 178ZM178 178L178 160C184 154 190 158 196 154C200 152 202 156 202 160L202 178Z';
const inDoorsInk = 'M56 156C62 150 68 154 74 150C78 148 84 152 84 156M178 160C184 154 190 158 196 154C200 152 202 156 202 160';
const ooze = 'M216 146L234 146C236 154 232 162 234 170C230 176 224 174 224 168C224 160 218 158 218 166C216 172 210 170 212 162C214 156 212 150 216 146Z';
const flow = 'M68 192C58 210 44 228 28 246M128 190C126 216 120 246 112 282M188 192C198 214 208 240 212 272M96 214C88 232 80 252 70 272';
const waves = 'M30 266q10 -6 20 0M150 230q10 -6 20 0M178 274q10 -6 20 0M160 200q8 -5 16 0';
const bubbles = [dot(46, 236, 3.2), dot(150, 256, 2.6), dot(220, 250, 2.2), dot(16, 276, 2.6), dot(96, 192, 2.2), dot(84, 290, 2)].join('');
const cobbles = 'M270 196l12 0M318 190l10 0M366 200l12 0M290 222l10 0M380 232l12 0M262 262l10 0M370 272l10 0M300 292l12 0M352 182l10 0';
// the shout: lines fanning out from her cupped hands, and three big "!" marks
const G = 'translate(334 288) scale(-1.5 1.5)';
const shout = 'M300 164L278 152M298 177L272 176M300 190L278 200';
const bang = (x, y, h, tilt) => {
  const t = (tilt * Math.PI) / 180;
  const [dx, dy] = [Math.sin(t), -Math.cos(t)];
  const top = [x + dx * h, y + dy * h];
  const bot = [x + dx * h * 0.32, y + dy * h * 0.32];
  return `M${f(bot[0] - 2.4)} ${f(bot[1])}L${f(top[0] - 4)} ${f(top[1])}L${f(top[0] + 4)} ${f(top[1])}L${f(bot[0] + 2.4)} ${f(bot[1])}Z${dot(f(x), f(y), 3.2)}`;
};
const bangs = bang(284, 150, 28, -16) + bang(262, 170, 22, -34) + bang(304, 120, 22, -4);

export default compose({
  title: 'Stop, little pot!',
  seed: 151,
  washes: [
    { c: PAL.ochre, o: 0.35, d: `${wallA}Z${wallB}Z` },
    { c: PAL.terracotta, o: 0.8, d: `${roofA}${roofB}` },
    { c: PAL.terracotta, o: 0.6, d: `${chimney}Z` },
    { c: PAL.sky, o: 0.55, d: `${winA}${winB}` },
    { c: PAL.slate, o: 0.6, d: 'M56 156L56 140C56 130 84 130 84 140L84 156ZM178 160L178 146C178 136 202 136 202 146L202 160Z' },
    { c: PAL.red, o: 0.85, d: bangs },
  ],
  after: [{ c: PAL.ochre, o: 0.88, d: `${river}${inDoors}${ooze}` }],
  lines: [wallA, roofA, doorA, winA, wallB, roofB, chimney, doorB, winB, street, ...riverInk, ooze, bangs],
  fine: [bars, tiles, inDoorsInk, flow, waves, bubbles, shout, cobbles],
  parts: [place(neighbour(), 'translate(196 68) scale(0.72)'), place(girl({ mood: 'shout', arms: G_ARMS.cup, legs: 'run', tilt: 4 }), G)],
});
