// Shared types for the catalogue (reference data) and the family's records.

export type Locale = 'en' | 'fr' | 'pt';

/** A text available in several languages. English is always present (fallback). */
export interface LText {
  en: string;
  fr?: string;
  pt?: string;
}

/** A list of texts (e.g. evidence items) in several languages. */
export interface LList {
  en: string[];
  fr?: string[];
  pt?: string[];
}

export type SkillKind = 'milestone' | 'learning_goal' | 'behaviour';
export type Strength = 'hard' | 'soft';

/** Percentile points, in months: age by which 25/50/75/90 % of children have the skill. */
export interface Percentiles {
  p25: number;
  p50: number;
  p75: number;
  p90: number;
}

export interface Subject {
  id: string;
  name: LText;
  color: string;
  order: number;
}

export interface Domain {
  id: string;
  subjectId: string;
  name: LText;
  order: number;
}

export interface Skill {
  id: string;
  subjectId: string;
  domainId: string;
  kind: SkillKind;
  type?: string;
  name: LText;
  description: LText;
  evidence: LList;
  activities: LList;
  prompt?: LText;
  /** Milestones only. */
  percentiles?: Percentiles;
  percentilesConfidence?: 'measured' | 'estimated';
  /** Learning goals only (years, inclusive). */
  ageStart?: number;
  ageEnd?: number;
  literacyLanguage?: 'en' | 'fr' | 'pt';
  source: string;
  origin: 'own' | 'marble';
  marbleId?: string;
  centrality?: number;
}

export interface Dependency {
  skillId: string;
  prerequisiteId: string;
  strength: Strength;
  reason: string;
  origin: 'own' | 'marble' | 'bridge';
}

export interface Cluster {
  subjectId: string;
  domainId: string;
  ageStart: number;
  summary: string;
}

export interface Catalog {
  version: string;
  subjects: Subject[];
  domains: Domain[];
  skills: Skill[];
  dependencies: Dependency[];
  clusters: Cluster[];
}

// ---------- Family records ----------

export type ObservationStatus = 'not_yet' | 'emerging' | 'achieved' | 'lost';

export interface Child {
  id: string;
  firstName: string;
  birthDate: string; // ISO date
  gestationalWeeks?: number | null;
  homeLanguages: Locale[];
  /** Version of the built-in history (catalog/seed) already imported for this child. */
  seedVersion?: number;
}

export interface Observation {
  id: string;
  childId: string;
  skillId: string;
  status: ObservationStatus;
  observedOn: string; // ISO date
  languages?: Locale[];
  note?: string;
  approximate?: boolean;
  catalogVersion?: string;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  childId: string;
  date: string;
  text: string;
  photo?: string; // data URL (local mode) or storage path (cloud mode)
  skillIds: string[];
  createdAt: string;
}
