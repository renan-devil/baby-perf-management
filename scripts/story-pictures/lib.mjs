// Shared look for all story pictures: cream paper, wobbly doubled ink, loose watercolour washes.
export const PAL = {
  ochre: '#e0a43a',
  terracotta: '#d9774a',
  green: '#8fb36a',
  sky: '#8ec5e6',
  rose: '#e58f8f',
  red: '#d9483b',
  slate: '#6b7a8f',
  grey: '#a9a39a',
  ink: '#2b2622',
  paper: '#fbf6ea',
};

/** Paths drawn inside a scaled group keep their line width. */
export function paths(list, t) {
  return list.map((d) => `<path d="${d}"${t ? ` transform="${t}" vector-effect="non-scaling-stroke"` : ''}/>`).join('');
}

/** Deterministic pseudo-random numbers, so the files are stable. */
export function rng(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const f1 = (n) => Math.round(n * 10) / 10;

/** Short parallel strokes along a segment A→B (hatching), each of length len at angle (deg). */
export function hatch(ax, ay, bx, by, n, len, angle, seed = 1, jitter = 0.35) {
  const r = rng(seed);
  const a = (angle * Math.PI) / 180;
  let d = '';
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n + (r() - 0.5) * (0.6 / n);
    const x = ax + (bx - ax) * t + (r() - 0.5) * 2;
    const y = ay + (by - ay) * t + (r() - 0.5) * 2;
    const l = len * (1 - jitter / 2 + r() * jitter);
    d += `M${f1(x)} ${f1(y)}l${f1(Math.cos(a) * l)} ${f1(Math.sin(a) * l)}`;
  }
  return d;
}

/** Scratchy sun/burst rays around (cx,cy). */
export function rays(cx, cy, r1, r2, count, seed = 1, offset = 0) {
  const r = rng(seed);
  let d = '';
  for (let i = 0; i < count; i++) {
    const a = ((i / count) * 360 + offset + (r() - 0.5) * 10) * (Math.PI / 180);
    const a1 = r1 + r() * 3;
    const a2 = r2 + (r() - 0.5) * 8;
    d += `M${f1(cx + Math.cos(a) * a1)} ${f1(cy + Math.sin(a) * a1)}L${f1(cx + Math.cos(a) * a2)} ${f1(cy + Math.sin(a) * a2)}`;
  }
  return d;
}

/** Little grass tufts (3 blades each) at the given base points. */
export function tufts(points, h = 9, seed = 3) {
  const r = rng(seed);
  let d = '';
  for (const [x, y] of points) {
    const k = h * (0.7 + r() * 0.6);
    d += `M${f1(x - 3)} ${f1(y)}q-1 ${f1(-k * 0.6)} -4 ${f1(-k * 0.9)}M${f1(x)} ${f1(y)}q1 ${f1(-k * 0.7)} 0 ${f1(-k * 1.15)}M${f1(x + 3)} ${f1(y)}q2 ${f1(-k * 0.5)} 5 ${f1(-k * 0.8)}`;
  }
  return d;
}

/** A hand-drawn "z" mark (for sleeping) of size s, top-left at (x,y). */
export function zed(x, y, s) {
  return `M${f1(x)} ${f1(y + s * 0.05)}L${f1(x + s)} ${f1(y)}L${f1(x + s * 0.05)} ${f1(y + s)}L${f1(x + s * 1.05)} ${f1(y + s * 0.95)}`;
}

/**
 * Builds one standalone SVG.
 * pic = { title, washes: [{c, o?, d}], whites?, lines, fine?, once?, fills?, glints?, seed? }
 *  - washes: watercolour shapes (path data), one group per colour, multiplied over the paper
 *  - whites: paper-coloured shapes painted over the washes (eye whites, highlights)
 *  - lines / fine: ink drawn twice (main + thin offset pass) for a scratchy doubled line
 *  - once: ink drawn a single time (dotted lines, small marks)
 *  - fills / glints: solid ink shapes (pupils) and paper glints on top
 */
export function svg(pic) {
  const s = pic.seed ?? 3;
  const washes = pic.washes
    .map(
      (w, i) =>
        `<g filter="url(#w${i % 3})" opacity="${w.o ?? 0.72}" fill="${w.c}" style="mix-blend-mode:multiply"><path d="${w.d}"${w.rule ? ` fill-rule="${w.rule}"` : ''}${w.t ? ` transform="${w.t}"` : ''}/></g>`,
    )
    .join('\n');
  const washFilter = (id, seed, scale) => `<filter id="${id}" filterUnits="userSpaceOnUse" x="-20" y="-20" width="440" height="340" color-interpolation-filters="sRGB">
<feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="3" seed="${seed}" result="warp"/>
<feDisplacementMap in="SourceGraphic" in2="warp" scale="${scale}" xChannelSelector="R" yChannelSelector="G" result="shape"/>
<feGaussianBlur in="shape" stdDeviation="0.7" result="soft"/>
<feTurbulence type="fractalNoise" baseFrequency="0.11" numOctaves="2" seed="${seed + 20}" result="grain"/>
<feColorMatrix in="grain" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -1.1 1.3" result="grainA"/>
<feComposite in="soft" in2="grainA" operator="in" result="tex"/>
<feMorphology in="soft" operator="erode" radius="1.7" result="inner"/>
<feComposite in="soft" in2="inner" operator="out" result="rim"/>
<feMerge><feMergeNode in="tex"/><feMergeNode in="rim"/></feMerge>
</filter>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
<title>${pic.title}</title>
<defs>
<filter id="grain" filterUnits="userSpaceOnUse" x="0" y="0" width="400" height="300" color-interpolation-filters="sRGB">
<feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="${s}"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.42 0 0 0 0 0.36 0 0 0 0 0.28 0.16 0 0 0 -0.05"/>
</filter>
<filter id="pen" filterUnits="userSpaceOnUse" x="-20" y="-20" width="440" height="340" color-interpolation-filters="sRGB">
<feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="${s + 1}" result="n"/>
<feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G"/>
</filter>
<filter id="pen2" filterUnits="userSpaceOnUse" x="-20" y="-20" width="440" height="340" color-interpolation-filters="sRGB">
<feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="2" seed="${s + 7}" result="n"/>
<feDisplacementMap in="SourceGraphic" in2="n" scale="6.5" xChannelSelector="G" yChannelSelector="B"/>
</filter>
${washFilter('w0', s + 2, 12)}
${washFilter('w1', s + 5, 14)}
${washFilter('w2', s + 9, 11)}
<g id="lines">${pic.lines}</g>
<g id="fine">${pic.fine ?? ''}</g>
${pic.defsExtra ?? ''}
</defs>
<rect width="400" height="300" fill="${PAL.paper}"/>
<rect width="400" height="300" filter="url(#grain)"/>
${washes}
${pic.whites ? `<path fill="${PAL.paper}" filter="url(#pen)" d="${pic.whites}"/>` : ''}
<g fill="none" stroke="${PAL.ink}" stroke-linecap="round" stroke-linejoin="round">
<use href="#lines" filter="url(#pen)" stroke-width="2.1"/>
<use href="#lines" filter="url(#pen2)" stroke-width="1.05" opacity="0.7" stroke-dasharray="46 3 30 4 60 2" transform="translate(1.7 -1.3)"/>
<use href="#fine" filter="url(#pen)" stroke-width="1.25"/>
<use href="#fine" filter="url(#pen2)" stroke-width="0.7" opacity="0.55" transform="translate(1 0.9)"/>
<g filter="url(#pen)" stroke-width="1.6">${pic.once ?? ''}</g>
</g>
<g fill="${PAL.ink}" filter="url(#pen)">${pic.fills ?? ''}</g>
<g fill="${PAL.paper}">${pic.glints ?? ''}</g>
</svg>
`;
}
