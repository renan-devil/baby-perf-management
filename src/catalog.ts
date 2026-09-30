// The catalogue, loaded once, with indexes and the skill graph.

import raw from './data/catalog.json';
import { buildGraph, descendantCounts } from './domain/graph';
import type { Catalog, Domain, LList, LText, Locale, Skill, Subject } from './domain/types';

export const catalog = raw as unknown as Catalog;
export const graph = buildGraph(catalog.skills, catalog.dependencies);
export const unlockCounts = descendantCounts(graph);

export const skillById = new Map<string, Skill>(catalog.skills.map((s) => [s.id, s]));
export const subjectById = new Map<string, Subject>(catalog.subjects.map((s) => [s.id, s]));
export const domainById = new Map<string, Domain>(catalog.domains.map((d) => [d.id, d]));
export const subjectsOrdered = [...catalog.subjects].sort((a, b) => a.order - b.order);

export function tr(text: LText | undefined, locale: Locale): string {
  if (!text) return '';
  return text[locale] ?? text.en;
}

export function trList(list: LList | undefined, locale: Locale): string[] {
  if (!list) return [];
  return list[locale] ?? list.en;
}

/** Whether a text is shown in English because no translation exists yet. */
export function isFallback(text: LText | undefined, locale: Locale): boolean {
  return !!text && locale !== 'en' && !text[locale];
}

// Validated categorical palette (dataviz reference instance), light and dark steps.
// Subjects take slots in their fixed order; History and Computing (6+) share a neutral grey.
const SLOTS_LIGHT = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948'];
const SLOTS_DARK = ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#008300', '#9085e9', '#e66767'];

export function subjectColor(subjectId: string, dark: boolean): string {
  const s = subjectById.get(subjectId);
  if (!s || s.order > 8) return dark ? '#9a9993' : '#8a8984';
  return (dark ? SLOTS_DARK : SLOTS_LIGHT)[s.order - 1];
}

export function searchSkills(query: string, locale: Locale, limit = 30): Skill[] {
  const q = normalise(query);
  if (!q) return [];
  const scored: { s: Skill; score: number }[] = [];
  for (const s of catalog.skills) {
    const local = normalise(tr(s.name, locale));
    const en = normalise(s.name.en);
    const i = local.indexOf(q);
    const j = en.indexOf(q);
    if (i < 0 && j < 0) continue;
    scored.push({ s, score: (i === 0 || j === 0 ? 0 : 1) + (s.origin === 'own' ? 0 : 0.5) });
  }
  return scored.sort((a, b) => a.score - b.score).slice(0, limit).map((x) => x.s);
}

export function normalise(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
}
