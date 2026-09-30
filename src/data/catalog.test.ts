// Graph checks on the real catalogue (APP_SPEC §5.5). Run `npm run build:catalog` first.
import { describe, expect, it } from 'vitest';
import { ageInconsistencies, buildGraph, orphans, topologicalSort } from '../domain/graph';
import type { Catalog } from '../domain/types';
import raw from './catalog.json';

const catalog = raw as unknown as Catalog;
const g = buildGraph(catalog.skills, catalog.dependencies);

describe('catalogue', () => {
  it('has unique ids and valid references', () => {
    const ids = new Set(catalog.skills.map((s) => s.id));
    expect(ids.size).toBe(catalog.skills.length);
    const domains = new Set(catalog.domains.map((d) => d.id));
    const subjects = new Set(catalog.subjects.map((s) => s.id));
    for (const s of catalog.skills) {
      expect(domains.has(s.domainId), s.id).toBe(true);
      expect(subjects.has(s.subjectId), s.id).toBe(true);
    }
    for (const d of catalog.dependencies) {
      expect(ids.has(d.skillId), d.skillId).toBe(true);
      expect(ids.has(d.prerequisiteId), d.prerequisiteId).toBe(true);
    }
  });

  it('is a directed acyclic graph', () => {
    expect(topologicalSort(g).cyclic).toEqual([]);
  });

  it('has no hard link whose prerequisite is typically much later', () => {
    const own = catalog.dependencies.filter((d) => d.origin !== 'marble');
    const issues = ageInconsistencies(catalog.skills, own, 3).map(
      (i) => `${i.dep.prerequisiteId} (${i.prereqAge} m) → ${i.dep.skillId} (${i.skillAge} m)`,
    );
    expect(issues).toEqual([]);
  });

  it('links every own skill into the graph, except behaviours', () => {
    const orphanIds = new Set(orphans(g));
    const own = catalog.skills.filter((s) => s.origin === 'own' && s.kind !== 'behaviour' && orphanIds.has(s.id));
    expect(own.map((s) => s.id)).toEqual([]);
  });

  it('has milestone percentiles in increasing order', () => {
    for (const s of catalog.skills) {
      if (!s.percentiles) continue;
      const p = s.percentiles;
      expect(p.p25 <= p.p50 && p.p50 <= p.p75 && p.p75 <= p.p90, s.id).toBe(true);
    }
  });
});
