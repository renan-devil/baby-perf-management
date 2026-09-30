// Derived view of the child's progress: age, per-skill status, suggestions and alerts.

import { useMemo } from 'react';
import { catalog, graph, skillById, unlockCounts } from '../catalog';
import { ageInMonths, correctedAgeInMonths, todayIso } from '../domain/age';
import {
  impliedAchieved,
  learningLabel,
  milestoneLabel,
  skillStates,
  upNext,
  type SkillState,
  type Suggestion,
} from '../domain/progress';
import type { Skill } from '../domain/types';
import { useData } from './DataContext';

export type StatusCode =
  | 'early'
  | 'in_window'
  | 'later'
  | 'not_expected_yet'
  | 'in_window_pending'
  | 'discuss'
  | 'regression'
  | 'not_yet'
  | 'ready'
  | 'emerging'
  | 'achieved'
  | 'implied'
  | 'observed'
  | 'not_observed'
  | 'unlogged';

export type Tone = 'good' | 'implied' | 'progress' | 'serious' | 'critical' | 'neutral';

export interface StatusInfo {
  code: StatusCode;
  tone: Tone;
  done: boolean;
}

const TONE: Record<StatusCode, Tone> = {
  early: 'good',
  in_window: 'good',
  later: 'good',
  achieved: 'good',
  implied: 'implied',
  emerging: 'progress',
  in_window_pending: 'progress',
  ready: 'progress',
  discuss: 'serious',
  regression: 'critical',
  not_expected_yet: 'neutral',
  not_yet: 'neutral',
  observed: 'good',
  not_observed: 'neutral',
  unlogged: 'neutral',
};

export interface Progress {
  ageMonths: number;
  states: Map<string, SkillState>;
  implied: Set<string>;
  done: (id: string) => boolean;
  statusOf: (skill: Skill) => StatusInfo;
  upNext: Suggestion[];
  alerts: { skill: Skill; status: StatusInfo }[];
}

export function useProgress(): Progress | null {
  const { child, observations } = useData();
  return useMemo(() => {
    if (!child) return null;
    const raw = ageInMonths(child.birthDate, todayIso());
    const ageMonths = correctedAgeInMonths(raw, child.gestationalWeeks);
    const states = skillStates(observations);
    const implied = impliedAchieved(graph, states);
    const done = (id: string) => {
      const st = states.get(id);
      return (!!st?.achievedOn && st.status !== 'lost') || implied.has(id);
    };

    const statusOf = (skill: Skill): StatusInfo => {
      const st = states.get(skill.id);
      let code: StatusCode;
      if (skill.kind === 'behaviour') code = st ? 'observed' : 'not_observed';
      else if (st?.status === 'lost') code = 'regression';
      else if (skill.percentiles) {
        if (st?.achievedOn) code = milestoneLabel(skill, st, ageMonths, child.birthDate) as StatusCode;
        else if (st?.status === 'emerging') code = 'emerging';
        else if (implied.has(skill.id)) code = 'implied';
        else code = milestoneLabel(skill, undefined, ageMonths, child.birthDate) as StatusCode;
      } else code = learningLabel(skill, st, graph, done);
      return { code, tone: TONE[code], done: TONE[code] === 'good' || code === 'implied' };
    };

    const suggestions = upNext(catalog.skills, graph, done, states, ageMonths, { unlockCounts, limit: 6, perSubject: 2 });
    const alerts = catalog.skills
      .map((skill) => ({ skill, status: statusOf(skill) }))
      .filter((a) => a.status.code === 'discuss' || a.status.code === 'regression');
    return { ageMonths, states, implied, done, statusOf, upNext: suggestions, alerts };
  }, [child, observations]);
}

export function skillOrThrow(id: string): Skill {
  const s = skillById.get(id);
  if (!s) throw new Error(`Unknown skill ${id}`);
  return s;
}
