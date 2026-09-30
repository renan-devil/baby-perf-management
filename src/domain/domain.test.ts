import { describe, expect, it } from 'vitest';
import { ageInMonths, calendarAge, correctedAgeInMonths, dateAtAge } from './age';
import { cdf, percentilesFromP75, percentilesFromWindow } from './cdf';
import {
  ageInconsistencies,
  buildGraph,
  descendantCounts,
  descendants,
  neighbourhood,
  topologicalSort,
  transitiveReduction,
} from './graph';
import {
  achievementPercentile,
  cumulativeCurve,
  developmentalAge,
  impliedAchieved,
  milestoneLabel,
  skillStates,
  upNext,
} from './progress';
import type { Dependency, Observation, Skill } from './types';

const BIRTH = '2022-02-04';

function skill(id: string, extra: Partial<Skill> = {}): Skill {
  return {
    id,
    subjectId: 'mobility',
    domainId: 'mobility.gross',
    kind: 'milestone',
    name: { en: id },
    description: { en: '' },
    evidence: { en: [] },
    activities: { en: [] },
    source: 'test',
    origin: 'own',
    ...extra,
  };
}
const dep = (prerequisiteId: string, skillId: string, strength: 'hard' | 'soft' = 'hard'): Dependency => ({
  prerequisiteId,
  skillId,
  strength,
  reason: '',
  origin: 'own',
});
const obs = (skillId: string, status: Observation['status'], observedOn: string): Observation => ({
  id: `${skillId}-${observedOn}`,
  childId: 'c',
  skillId,
  status,
  observedOn,
  createdAt: observedOn,
});

describe('age', () => {
  it('computes Constance age on 2026-09-30', () => {
    expect(calendarAge(BIRTH, '2026-09-30')).toEqual({ years: 4, months: 7, days: 26 });
    expect(ageInMonths(BIRTH, '2026-09-30')).toBeCloseTo(55.85, 1);
  });
  it('round-trips month ages to dates', () => {
    expect(dateAtAge(BIRTH, 10)).toBe('2022-12-04');
    expect(ageInMonths(BIRTH, dateAtAge(BIRTH, 29))).toBeCloseTo(29, 0);
  });
  it('corrects age for prematurity only before 24 months and 37 weeks', () => {
    expect(correctedAgeInMonths(6, 32)).toBeCloseTo(6 - (8 * 7) / 30.4375, 5);
    expect(correctedAgeInMonths(6, 39)).toBe(6);
    expect(correctedAgeInMonths(30, 30)).toBe(30);
  });
});

describe('cdf', () => {
  const p = { p25: 10, p50: 12, p75: 14, p90: 16 };
  it('passes through the percentile points and is monotone', () => {
    expect(cdf(p, 10)).toBeCloseTo(0.25);
    expect(cdf(p, 12)).toBeCloseTo(0.5);
    expect(cdf(p, 13)).toBeCloseTo(0.625);
    expect(cdf(p, 16)).toBeCloseTo(0.9);
    let prev = -1;
    for (let t = 0; t < 30; t += 0.25) {
      const f = cdf(p, t);
      expect(f).toBeGreaterThanOrEqual(prev);
      expect(f).toBeGreaterThanOrEqual(0);
      expect(f).toBeLessThanOrEqual(1);
      prev = f;
    }
    expect(cdf(p, 0)).toBe(0);
    expect(cdf(p, 30)).toBe(1);
  });
  it('converts a WHO window (walking alone 8.2 / 12.0 / 17.6) to percentiles', () => {
    const w = percentilesFromWindow(8.2, 12.0, 17.6);
    expect(w.p50).toBe(12);
    expect(w.p75).toBeCloseTo(13.4, 1);
    // Walking at 10 months ≈ 15th–20th percentile (APP_SPEC §5.3).
    const pct = achievementPercentile(skill('walk', { percentiles: w }), 10)!;
    expect(pct).toBeGreaterThanOrEqual(10);
    expect(pct).toBeLessThanOrEqual(22);
  });
  it('estimates percentiles from a CDC 75th percentile', () => {
    const e = percentilesFromP75(24);
    expect(e.p75).toBe(24);
    expect(e.p25).toBeLessThan(e.p50);
    expect(e.p90).toBeGreaterThan(e.p75);
  });
});

describe('graph', () => {
  const skills = ['a', 'b', 'c', 'd'].map((id) => skill(id));
  const deps = [dep('a', 'b'), dep('b', 'c'), dep('a', 'c'), dep('c', 'd', 'soft')];
  const g = buildGraph(skills, deps);

  it('sorts topologically and detects cycles', () => {
    expect(topologicalSort(g)).toEqual({ order: ['a', 'b', 'c', 'd'], cyclic: [] });
    const cyc = buildGraph(skills, [...deps, dep('d', 'a')]);
    expect(topologicalSort(cyc).cyclic.sort()).toEqual(['a', 'b', 'c', 'd']);
  });
  it('counts descendants', () => {
    const c = descendantCounts(g);
    expect(c.get('a')).toBe(3);
    expect(c.get('c')).toBe(1);
    expect(c.get('d')).toBe(0);
    expect([...descendants(g, ['b'], ['hard'])]).toEqual(['c']);
  });
  it('hides redundant edges for display', () => {
    const edges = neighbourhood(g, 'b', 2).edges;
    const reduced = transitiveReduction(edges).map((e) => `${e.from}>${e.to}`).sort();
    expect(reduced).toEqual(['a>b', 'b>c', 'c>d']);
  });
  it('flags hard prerequisites typically learned much later than the dependent skill', () => {
    const s = [skill('x', { kind: 'learning_goal', ageStart: 7 }), skill('y', { kind: 'learning_goal', ageStart: 4 })];
    expect(ageInconsistencies(s, [dep('x', 'y')])).toHaveLength(1);
    expect(ageInconsistencies(s, [dep('y', 'x')])).toHaveLength(0);
  });
});

describe('progress', () => {
  const walk = skill('walk', { percentiles: { p25: 11, p50: 12, p75: 13.4, p90: 14.6 } });

  it('keeps the first achievement date and the latest status', () => {
    const st = skillStates([obs('walk', 'emerging', '2022-11-01'), obs('walk', 'achieved', '2022-12-04'), obs('walk', 'lost', '2023-03-01')]);
    expect(st.get('walk')).toMatchObject({ status: 'lost', achievedOn: '2022-12-04' });
  });
  it('labels milestones as in APP_SPEC §4.2', () => {
    const st = (o: Observation[]) => skillStates(o).get('walk');
    expect(milestoneLabel(walk, st([obs('walk', 'achieved', '2022-12-04')]), 20, BIRTH)).toBe('early');
    expect(milestoneLabel(walk, st([obs('walk', 'achieved', '2023-02-04')]), 20, BIRTH)).toBe('in_window');
    expect(milestoneLabel(walk, undefined, 8, BIRTH)).toBe('not_expected_yet');
    expect(milestoneLabel(walk, undefined, 12, BIRTH)).toBe('in_window_pending');
    expect(milestoneLabel(walk, undefined, 16, BIRTH)).toBe('discuss');
    // Long past the window and never logged: most likely just not logged.
    expect(milestoneLabel(walk, undefined, 40, BIRTH)).toBe('unlogged');
    expect(milestoneLabel(walk, st([obs('walk', 'not_yet', '2025-06-01')]), 40, BIRTH)).toBe('discuss');
    expect(milestoneLabel(walk, st([obs('walk', 'lost', '2023-02-04')]), 16, BIRTH)).toBe('regression');
  });
  it('implies prerequisites of achieved skills, except those recorded otherwise', () => {
    const g = buildGraph(['a', 'b', 'c', 'd', 'e'].map((id) => skill(id)), [dep('a', 'b'), dep('b', 'c'), dep('d', 'c', 'soft'), dep('e', 'c')]);
    const st = skillStates([obs('c', 'achieved', '2024-01-01'), obs('e', 'not_yet', '2024-01-01')]);
    expect([...impliedAchieved(g, st)].sort()).toEqual(['a', 'b', 'd']);
    expect([...impliedAchieved(g, st, ['hard'])].sort()).toEqual(['a', 'b']);
  });
  it('does not suggest long-overdue unlogged milestones', () => {
    const baby = skill('coo', { percentiles: { p25: 2, p50: 3, p75: 4, p90: 5 } });
    const g = buildGraph([baby], []);
    expect(upNext([baby], g, () => false, skillStates([]), 56)).toHaveLength(0);
    expect(upNext([baby], g, () => false, skillStates([]), 10)).toHaveLength(1);
  });
  it('builds a cumulative curve whose expected count tends to the number of milestones', () => {
    const ms = [walk, skill('sit', { percentiles: { p25: 5, p50: 6, p75: 7, p90: 8 } })];
    const curve = cumulativeCurve(ms, new Map([['sit', 5]]), 24, 6, 1);
    expect(curve[0].expected).toBe(0);
    expect(curve.at(-1)!.expected).toBe(2);
    expect(curve[6].child).toBe(1);
    expect(curve[10].child).toBeNull();
    expect(curve[6].low).toBeLessThanOrEqual(curve[6].expected);
  });
  it('finds a developmental age by bisection', () => {
    const ms = Array.from({ length: 10 }, (_, i) =>
      skill(`m${i}`, { percentiles: { p25: 2 * i + 1, p50: 2 * i + 2, p75: 2 * i + 3, p90: 2 * i + 4 } }),
    );
    const t = developmentalAge(ms, 5)!;
    expect(t).toBeGreaterThan(9);
    expect(t).toBeLessThan(12);
    expect(developmentalAge(ms.slice(0, 3), 1)).toBeUndefined();
  });
  it('suggests ready, age-appropriate skills with at most N per subject', () => {
    const skills = [
      skill('a', { kind: 'learning_goal', ageStart: 4, subjectId: 'math' }),
      skill('b', { kind: 'learning_goal', ageStart: 4, subjectId: 'math' }),
      skill('c', { kind: 'learning_goal', ageStart: 4, subjectId: 'math' }),
      skill('d', { kind: 'learning_goal', ageStart: 9, subjectId: 'math' }),
      skill('e', { kind: 'learning_goal', ageStart: 4, subjectId: 'social' }),
      skill('f', { kind: 'learning_goal', ageStart: 4, subjectId: 'social' }),
    ];
    const g = buildGraph(skills, [dep('e', 'f')]);
    const st = skillStates([]);
    const res = upNext(skills, g, () => false, st, 56, { limit: 10, perSubject: 2 });
    const ids = res.map((r) => r.skill.id);
    expect(ids).not.toContain('d'); // too old
    expect(ids).not.toContain('f'); // prerequisite missing
    expect(ids.filter((id) => ['a', 'b', 'c'].includes(id))).toHaveLength(2);
    expect(ids).toContain('e');
  });
});
