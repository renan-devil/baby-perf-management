// The skill graph: a directed acyclic graph where an edge prerequisite → skill means
// "skill depends on prerequisite". All algorithms are linear or near-linear in size.

import { typicalAgeMonths } from './cdf';
import type { Dependency, Skill, Strength } from './types';

export interface Edge {
  from: string; // prerequisite
  to: string; // dependent skill
  strength: Strength;
  reason: string;
}

export interface SkillGraph {
  ids: string[];
  index: Map<string, number>;
  /** Outgoing edges (prerequisite → dependents), by node index. */
  out: Edge[][];
  /** Incoming edges (dependent ← prerequisites), by node index. */
  in: Edge[][];
}

export function buildGraph(skills: Pick<Skill, 'id'>[], deps: Dependency[]): SkillGraph {
  const ids = skills.map((s) => s.id);
  const index = new Map(ids.map((id, i) => [id, i]));
  const out: Edge[][] = ids.map(() => []);
  const inn: Edge[][] = ids.map(() => []);
  for (const d of deps) {
    const a = index.get(d.prerequisiteId);
    const b = index.get(d.skillId);
    if (a === undefined || b === undefined || a === b) continue;
    const e: Edge = { from: d.prerequisiteId, to: d.skillId, strength: d.strength, reason: d.reason };
    out[a].push(e);
    inn[b].push(e);
  }
  return { ids, index, out, in: inn };
}

/**
 * Kahn's algorithm. Returns a topological order (prerequisites first) and the nodes left
 * over, which are exactly the nodes on or downstream of a cycle (empty if the graph is a DAG).
 */
export function topologicalSort(g: SkillGraph): { order: string[]; cyclic: string[] } {
  const indeg = g.in.map((e) => e.length);
  const queue: number[] = [];
  indeg.forEach((d, i) => d === 0 && queue.push(i));
  const order: string[] = [];
  for (let head = 0; head < queue.length; head++) {
    const i = queue[head];
    order.push(g.ids[i]);
    for (const e of g.out[i]) {
      const j = g.index.get(e.to)!;
      if (--indeg[j] === 0) queue.push(j);
    }
  }
  const cyclic = g.ids.filter((_, i) => indeg[i] > 0);
  return { order, cyclic };
}

/** Hard edges whose prerequisite is typically learned later than the dependent skill. */
export function ageInconsistencies(
  skills: Skill[],
  deps: Dependency[],
  toleranceMonths = 6,
): { dep: Dependency; prereqAge: number; skillAge: number }[] {
  const byId = new Map(skills.map((s) => [s.id, s]));
  const issues: { dep: Dependency; prereqAge: number; skillAge: number }[] = [];
  for (const d of deps) {
    if (d.strength !== 'hard') continue;
    const a = byId.get(d.prerequisiteId);
    const b = byId.get(d.skillId);
    if (!a || !b) continue;
    const ta = typicalAgeMonths(a);
    const tb = typicalAgeMonths(b);
    if (ta === undefined || tb === undefined) continue;
    if (ta > tb + toleranceMonths) issues.push({ dep: d, prereqAge: ta, skillAge: tb });
  }
  return issues;
}

/** Skills with no incoming and no outgoing edge. */
export function orphans(g: SkillGraph): string[] {
  return g.ids.filter((_, i) => g.in[i].length === 0 && g.out[i].length === 0);
}

/** All ancestors (transitive prerequisites) of a set of skills, following the given strengths. */
export function ancestors(g: SkillGraph, start: Iterable<string>, strengths: Strength[] = ['hard', 'soft']): Set<string> {
  return walk(g, start, strengths, 'in');
}

/** All descendants (skills transitively unlocked) of a set of skills. */
export function descendants(g: SkillGraph, start: Iterable<string>, strengths: Strength[] = ['hard', 'soft']): Set<string> {
  return walk(g, start, strengths, 'out');
}

function walk(g: SkillGraph, start: Iterable<string>, strengths: Strength[], dir: 'in' | 'out'): Set<string> {
  const seen = new Set<string>();
  const stack: string[] = [];
  for (const s of start) stack.push(s);
  while (stack.length) {
    const id = stack.pop()!;
    const i = g.index.get(id);
    if (i === undefined) continue;
    for (const e of g[dir][i]) {
      if (!strengths.includes(e.strength)) continue;
      const next = dir === 'in' ? e.from : e.to;
      if (!seen.has(next)) {
        seen.add(next);
        stack.push(next);
      }
    }
  }
  return seen;
}

/**
 * Number of distinct descendants of every node (its "unlock value"), computed with bitsets
 * in reverse topological order: O(V · V / 32) words, ~0.1 s for 2,000 nodes.
 */
export function descendantCounts(g: SkillGraph): Map<string, number> {
  const n = g.ids.length;
  const words = Math.ceil(n / 32);
  const bits: Uint32Array[] = new Array(n);
  const { order } = topologicalSort(g);
  const result = new Map<string, number>();
  for (let k = order.length - 1; k >= 0; k--) {
    const i = g.index.get(order[k])!;
    const b = new Uint32Array(words);
    for (const e of g.out[i]) {
      const j = g.index.get(e.to)!;
      b[j >>> 5] |= 1 << (j & 31);
      const bj = bits[j];
      if (bj) for (let w = 0; w < words; w++) b[w] |= bj[w];
    }
    bits[i] = b;
    let count = 0;
    for (let w = 0; w < words; w++) count += popcount(b[w]);
    result.set(g.ids[i], count);
  }
  return result;
}

function popcount(x: number): number {
  x -= (x >>> 1) & 0x55555555;
  x = (x & 0x33333333) + ((x >>> 2) & 0x33333333);
  return (((x + (x >>> 4)) & 0x0f0f0f0f) * 0x01010101) >>> 24;
}

/**
 * Transitive reduction of a sub-graph for display: drop edge a → c when c is also reachable
 * from a through another path inside the sub-graph. The dependency itself still exists.
 */
export function transitiveReduction(edges: Edge[]): Edge[] {
  const adj = new Map<string, string[]>();
  for (const e of edges) {
    if (!adj.has(e.from)) adj.set(e.from, []);
    adj.get(e.from)!.push(e.to);
  }
  const reachableAvoiding = (from: string, target: string): boolean => {
    const stack = (adj.get(from) ?? []).filter((x) => x !== target);
    const seen = new Set(stack);
    while (stack.length) {
      const x = stack.pop()!;
      if (x === target) return true;
      for (const y of adj.get(x) ?? []) {
        if (!seen.has(y)) {
          seen.add(y);
          stack.push(y);
        }
      }
    }
    return false;
  };
  return edges.filter((e) => !reachableAvoiding(e.from, e.to));
}

/** Nodes within `depth` steps upstream and downstream of a skill (focus view). */
export function neighbourhood(g: SkillGraph, id: string, depth: number): { nodes: Set<string>; edges: Edge[] } {
  const nodes = new Set<string>([id]);
  const edges: Edge[] = [];
  const expand = (dir: 'in' | 'out') => {
    let frontier = [id];
    for (let d = 0; d < depth; d++) {
      const next: string[] = [];
      for (const x of frontier) {
        const i = g.index.get(x);
        if (i === undefined) continue;
        for (const e of g[dir][i]) {
          edges.push(e);
          const y = dir === 'in' ? e.from : e.to;
          if (!nodes.has(y)) {
            nodes.add(y);
            next.push(y);
          }
        }
      }
      frontier = next;
    }
  };
  expand('in');
  expand('out');
  const unique = new Map(edges.map((e) => [`${e.from}>${e.to}`, e]));
  return { nodes, edges: [...unique.values()] };
}
