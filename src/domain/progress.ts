// Turning observations into per-skill state, statuses, curves and suggestions (APP_SPEC §4.2, §5).

import { ageInMonths } from './age';
import { cdf } from './cdf';
import { ancestors, descendantCounts, type SkillGraph } from './graph';
import type { Observation, ObservationStatus, Skill } from './types';

export interface SkillState {
  status: ObservationStatus;
  /** Date of the first "achieved" observation (kept even if later marked lost). */
  achievedOn?: string;
  lastObservedOn: string;
  approximate?: boolean;
}

/** Latest status per skill, from the full observation history. */
export function skillStates(observations: Observation[]): Map<string, SkillState> {
  const sorted = [...observations].sort(
    (a, b) => a.observedOn.localeCompare(b.observedOn) || a.createdAt.localeCompare(b.createdAt),
  );
  const states = new Map<string, SkillState>();
  for (const o of sorted) {
    const prev = states.get(o.skillId);
    const achievedOn = prev?.achievedOn ?? (o.status === 'achieved' ? o.observedOn : undefined);
    states.set(o.skillId, {
      status: o.status,
      achievedOn,
      lastObservedOn: o.observedOn,
      approximate: o.status === 'achieved' && !prev?.achievedOn ? o.approximate : prev?.approximate,
    });
  }
  return states;
}

/**
 * Skills implied as achieved: every hard prerequisite (transitively) of an achieved skill,
 * unless the family recorded something else for it.
 */
export function impliedAchieved(g: SkillGraph, states: Map<string, SkillState>): Set<string> {
  const achieved = [...states].filter(([, s]) => s.status === 'achieved').map(([id]) => id);
  const implied = ancestors(g, achieved, ['hard']);
  for (const id of [...implied]) if (states.has(id)) implied.delete(id);
  return implied;
}

export type MilestoneLabel =
  | 'early'
  | 'in_window'
  | 'later'
  | 'not_expected_yet'
  | 'in_window_pending'
  | 'discuss'
  | 'regression';

export type LearningLabel = 'not_yet' | 'ready' | 'emerging' | 'achieved' | 'implied';

/** Status label of a milestone (APP_SPEC §4.2 table). */
export function milestoneLabel(skill: Skill, state: SkillState | undefined, ageNow: number, birthIso: string): MilestoneLabel | undefined {
  const p = skill.percentiles;
  if (!p) return undefined;
  if (state?.status === 'lost') return 'regression';
  if (state?.achievedOn) {
    const a = ageInMonths(birthIso, state.achievedOn);
    if (a < p.p25) return 'early';
    if (a <= p.p90) return 'in_window';
    return 'later';
  }
  if (ageNow < p.p25) return 'not_expected_yet';
  if (ageNow <= p.p90) return 'in_window_pending';
  return 'discuss';
}

/** Status label of a learning goal: never "late". */
export function learningLabel(
  skill: Skill,
  state: SkillState | undefined,
  g: SkillGraph,
  done: (id: string) => boolean,
): LearningLabel {
  if (state?.status === 'achieved') return 'achieved';
  if (state?.status === 'emerging') return 'emerging';
  if (done(skill.id)) return 'implied';
  return hardPrereqsDone(g, skill.id, done) ? 'ready' : 'not_yet';
}

export function hardPrereqsDone(g: SkillGraph, id: string, done: (id: string) => boolean): boolean {
  const i = g.index.get(id);
  if (i === undefined) return true;
  return g.in[i].every((e) => e.strength !== 'hard' || done(e.from));
}

/** Percentile of an achievement: F(age at achievement) × 100. */
export function achievementPercentile(skill: Skill, ageAtAchievement: number): number | undefined {
  return skill.percentiles ? Math.round(cdf(skill.percentiles, ageAtAchievement) * 100) : undefined;
}

// ---------- Curves (§5.1, §5.2) ----------

export interface CurvePoint {
  age: number;
  child: number | null;
  expected: number;
  low: number;
  high: number;
}

/**
 * Cumulative curve for milestones: C(t) (child), E(t) = Σ F_i(t) and the approximate
 * 10–90 % band E ± 1.28·√V with V = Σ F_i (1 − F_i).
 */
export function cumulativeCurve(
  milestones: Skill[],
  achievedAges: Map<string, number>,
  maxAge: number,
  childAgeNow: number,
  step = 0.5,
): CurvePoint[] {
  const points: CurvePoint[] = [];
  const ages = [...achievedAges.values()];
  for (let t = 0; t <= maxAge + 1e-9; t += step) {
    let e = 0;
    let v = 0;
    for (const m of milestones) {
      const f = cdf(m.percentiles!, t);
      e += f;
      v += f * (1 - f);
    }
    const sd = Math.sqrt(v);
    points.push({
      age: Math.round(t * 100) / 100,
      child: t <= childAgeNow ? ages.filter((a) => a <= t).length : null,
      expected: round1(e),
      low: round1(Math.max(0, e - 1.28 * sd)),
      high: round1(e + 1.28 * sd),
    });
  }
  return points;
}

export function expectedCount(milestones: Skill[], t: number): number {
  return milestones.reduce((sum, m) => sum + cdf(m.percentiles!, t), 0);
}

/**
 * Developmental age: the age t* at which a typical child has as many of these milestones
 * as the child has (E(t*) = count), solved by bisection. Returns undefined when there are
 * too few milestones to say anything.
 */
export function developmentalAge(milestones: Skill[], count: number, maxAge = 96): number | undefined {
  if (milestones.length < 5) return undefined;
  let lo = 0;
  let hi = maxAge;
  if (count >= expectedCount(milestones, hi)) return hi;
  for (let k = 0; k < 50; k++) {
    const mid = (lo + hi) / 2;
    if (expectedCount(milestones, mid) < count) lo = mid;
    else hi = mid;
  }
  return round1((lo + hi) / 2);
}

function round1(x: number): number {
  return Math.round(x * 10) / 10;
}

// ---------- Up next (§5.6) ----------

export interface Suggestion {
  skill: Skill;
  unlocks: number;
  reason: 'timely' | 'unlocks';
}

/**
 * Candidates: not achieved (nor implied), all hard prerequisites done, age-appropriate.
 * Ranked by timeliness (milestones near p75 first), then unlock value, then centrality;
 * at most `perSubject` per subject for balance.
 */
export function upNext(
  skills: Skill[],
  g: SkillGraph,
  done: (id: string) => boolean,
  states: Map<string, SkillState>,
  ageNow: number,
  opts: { limit?: number; perSubject?: number; unlockCounts?: Map<string, number> } = {},
): Suggestion[] {
  const { limit = 5, perSubject = 2 } = opts;
  const unlock = opts.unlockCounts ?? descendantCounts(g);
  const candidates = skills.filter((s) => {
    if (s.kind === 'behaviour' || done(s.id)) return false;
    if (states.get(s.id)?.status === 'lost') return false;
    if (!hardPrereqsDone(g, s.id, done)) return false;
    if (s.percentiles) return s.percentiles.p25 <= ageNow + 6;
    if (s.ageStart !== undefined) return s.ageStart * 12 <= ageNow;
    return false;
  });
  const score = (s: Skill): number => {
    const u = unlock.get(s.id) ?? 0;
    const unlockScore = Math.log2(1 + u) + (s.centrality ?? 0);
    if (s.percentiles) {
      // Overdue or near p75: most timely.
      const timely = ageNow >= s.percentiles.p50 ? 3 : 2 - Math.min(2, (s.percentiles.p50 - ageNow) / 6);
      return 10 + timely + unlockScore;
    }
    // Emerging skills first, then young learning goals.
    const emerging = states.get(s.id)?.status === 'emerging' ? 5 : 0;
    const closeness = 1 - Math.min(1, (ageNow - (s.ageStart ?? 0) * 12) / 36);
    return emerging + closeness + unlockScore;
  };
  const ranked = candidates.map((s) => ({ s, sc: score(s) })).sort((a, b) => b.sc - a.sc);
  const perSubj = new Map<string, number>();
  const out: Suggestion[] = [];
  for (const { s } of ranked) {
    const n = perSubj.get(s.subjectId) ?? 0;
    if (n >= perSubject) continue;
    perSubj.set(s.subjectId, n + 1);
    out.push({ skill: s, unlocks: unlock.get(s.id) ?? 0, reason: s.percentiles ? 'timely' : 'unlocks' });
    if (out.length >= limit) break;
  }
  return out;
}
