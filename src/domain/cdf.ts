// Cumulative distribution of a milestone: F(t) = share of children who have the skill by age t.
// Piecewise linear through (p25, .25), (p50, .5), (p75, .75), (p90, .9), with linear tails
// that keep the slope of the nearest segment, clamped to [0, 1].

import type { Percentiles, Skill } from './types';

export function cdf(p: Percentiles, t: number): number {
  const pts: [number, number][] = [
    [p.p25, 0.25],
    [p.p50, 0.5],
    [p.p75, 0.75],
    [p.p90, 0.9],
  ];
  if (t <= pts[0][0]) {
    const slope = 0.25 / Math.max(p.p50 - p.p25, 1e-6);
    return clamp01(0.25 - (pts[0][0] - t) * slope);
  }
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    if (t <= x1) return x1 === x0 ? y1 : y0 + ((t - x0) / (x1 - x0)) * (y1 - y0);
  }
  const slope = 0.15 / Math.max(p.p90 - p.p75, 1e-6);
  return clamp01(0.9 + (t - p.p90) * slope);
}

function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}

/**
 * Normal approximation from WHO-style windows (1st, 50th, 99th percentile) to our
 * percentile points. sd = (p99 − p1) / (2 × 2.326).
 */
export function percentilesFromWindow(p1: number, p50: number, p99: number): Percentiles {
  const sd = (p99 - p1) / (2 * 2.3263);
  const r = (x: number) => Math.round(x * 10) / 10;
  return { p25: r(p50 - 0.6745 * sd), p50: r(p50), p75: r(p50 + 0.6745 * sd), p90: r(p50 + 1.2816 * sd) };
}

/**
 * Estimate full percentiles when a source only gives the age by which ~75 % of children
 * have the skill (CDC 2022 checklists). Ratios approximate the typical spread of Denver-type
 * norms (p25 ≈ 0.75·p75, p50 ≈ 0.87·p75, p90 ≈ 1.15·p75). Always marked as "estimated".
 */
export function percentilesFromP75(p75: number): Percentiles {
  const r = (x: number) => Math.round(x * 10) / 10;
  return { p25: r(0.75 * p75), p50: r(0.87 * p75), p75: r(p75), p90: r(1.15 * p75) };
}

/** Typical age of a skill in months (p50 for milestones, start of range for learning goals). */
export function typicalAgeMonths(skill: Skill): number | undefined {
  if (skill.percentiles) return skill.percentiles.p50;
  if (skill.ageStart !== undefined) return skill.ageStart * 12;
  return undefined;
}
