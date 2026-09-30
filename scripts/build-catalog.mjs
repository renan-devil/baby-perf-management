// Builds src/data/catalog.json from the editable catalogue files:
//   catalog/subjects.tsv          subjects and domains (EN / FR / PT)
//   catalog/early/skills.tsv      catalogue A: our 0–6 year skills
//   catalog/early/links.tsv       links inside A, and bridges to Marble
//   catalog/marble/*.json         pinned copy of the Marble Skill Taxonomy v1
//   catalog/translations/*.tsv    FR / PT translations of Marble names (optional)
// Run: npm run build:catalog. Graph checks (cycles, ages) run in src/data/catalog.test.ts.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

export function readTsv(text) {
  const [header, ...lines] = text.split('\n').filter((l) => l.trim() !== '');
  const cols = header.split('\t');
  return lines.map((line) => {
    const cells = line.split('\t');
    return Object.fromEntries(cols.map((c, i) => [c, (cells[i] ?? '').trim()]));
  });
}

const r1 = (x) => Math.round(x * 10) / 10;

/** Same formulas as src/domain/cdf.ts (percentilesFromP75 / percentilesFromWindow). */
export function parseAge(code) {
  const [kind, value] = code.split(':');
  const fromP75 = (p75) => ({ p25: r1(0.75 * p75), p50: r1(0.87 * p75), p75: r1(p75), p90: r1(1.15 * p75) });
  switch (kind) {
    case 'cdc22': // CDC 2022: age by which ≥ 75 % of children have the skill
      return { percentiles: fromP75(Number(value)), percentilesConfidence: 'estimated' };
    case 'cdc': // CDC 2004–2021 and other sources giving the typical (≈ 50 %) age
    case 'est':
      return { percentiles: fromP75(Number(value) / 0.87), percentilesConfidence: 'estimated' };
    case 'who': {
      const [p1, p50, p99] = value.split('/').map(Number);
      const sd = (p99 - p1) / (2 * 2.3263);
      return {
        percentiles: { p25: r1(p50 - 0.6745 * sd), p50: r1(p50), p75: r1(p50 + 0.6745 * sd), p90: r1(p50 + 1.2816 * sd) },
        percentilesConfidence: 'measured',
      };
    }
    case 'goal': {
      const [a, b] = value.split('-').map(Number);
      return { ageStart: a, ageEnd: b };
    }
    case 'none':
      return {};
    default:
      throw new Error(`Unknown age code: ${code}`);
  }
}

const ltext = (row, field) => {
  const t = { en: row[`${field}_en`] };
  if (row[`${field}_fr`]) t.fr = row[`${field}_fr`];
  if (row[`${field}_pt`]) t.pt = row[`${field}_pt`];
  return t;
};
const llist = (row, field) => {
  const split = (s) => (s ? s.split(' | ').map((x) => x.trim()) : []);
  const l = { en: split(row[`${field}_en`]) };
  if (row[`${field}_fr`]) l.fr = split(row[`${field}_fr`]);
  if (row[`${field}_pt`]) l.pt = split(row[`${field}_pt`]);
  return l;
};

// Marble subject/domain → our subject.
const MARBLE_SUBJECT = {
  Mathematics: 'mathematics',
  English: 'literacy',
  Science: 'thinking',
  'Learning to Learn': 'thinking',
  'Personal & Social Development': 'social',
  'Life Skills': 'autonomy',
  History: 'history',
  Computing: 'computing',
};
const MARBLE_DOMAIN_SUBJECT = { 'Speaking & Listening': 'communication', 'Handwriting & Transcription': 'hands' };
const ENGLISH_SPECIFIC = new Set(['Phonics & Word Reading', 'Spelling & Word Study', 'Grammar & Punctuation']);
const slug = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const marbleDomainId = (domain) => `marble.${slug(domain)}`;

export function buildCatalog() {
  const errors = [];

  // Subjects and domains
  const subjects = [];
  const domains = [];
  for (const row of readTsv(read('catalog/subjects.tsv'))) {
    if (row.type === 'subject') subjects.push({ id: row.id, name: ltext(row, 'name'), color: row.color, order: Number(row.order) });
    else domains.push({ id: row.id, subjectId: row.parent, name: ltext(row, 'name'), order: Number(row.order) });
  }

  // Translations of Marble texts (id \t name_fr \t name_pt)
  const tr = new Map();
  const trPath = 'catalog/translations/marble-names.tsv';
  if (existsSync(join(root, trPath))) for (const row of readTsv(read(trPath))) tr.set(row.id, row);

  // Catalogue A
  const skills = [];
  for (const row of readTsv(read('catalog/early/skills.tsv'))) {
    const domain = domains.find((d) => d.id === row.domain);
    if (!domain) errors.push(`Skill ${row.id}: unknown domain ${row.domain}`);
    const s = {
      id: row.id,
      subjectId: domain?.subjectId ?? 'unknown',
      domainId: row.domain,
      kind: row.kind,
      name: ltext(row, 'name'),
      description: ltext(row, 'definition'),
      evidence: llist(row, 'definition'),
      activities: llist(row, 'activities'),
      ...parseAge(row.age),
      source: row.source,
      origin: 'own',
    };
    if (row.literacy_language) s.literacyLanguage = row.literacy_language;
    if (s.kind === 'milestone' && !s.percentiles) errors.push(`Milestone ${s.id} has no percentiles`);
    if (s.kind === 'learning_goal' && s.ageStart === undefined) errors.push(`Learning goal ${s.id} has no age range`);
    skills.push(s);
  }

  // Marble
  const marble = JSON.parse(read('catalog/marble/topics.json')).topics;
  const marbleDomains = new Map();
  for (const t of marble) {
    const subjectId = MARBLE_DOMAIN_SUBJECT[t.domain] ?? MARBLE_SUBJECT[t.subject];
    if (!subjectId) {
      errors.push(`Marble topic ${t.id}: unmapped subject ${t.subject}`);
      continue;
    }
    const domainId = marbleDomainId(t.domain ?? t.subject);
    if (!marbleDomains.has(domainId)) marbleDomains.set(domainId, { id: domainId, subjectId, name: t.domain ?? t.subject });
    const names = tr.get(t.id);
    const name = { en: t.name ?? t.description.slice(0, 60) };
    if (names?.name_fr) name.fr = names.name_fr;
    if (names?.name_pt) name.pt = names.name_pt;
    const s = {
      id: t.id,
      subjectId,
      domainId,
      kind: 'learning_goal',
      type: t.type.toLowerCase(),
      name,
      description: { en: t.description },
      evidence: { en: t.evidence },
      activities: { en: [] },
      ageStart: t.ageRangeStart ?? undefined,
      ageEnd: t.ageRangeEnd ?? undefined,
      source: 'Marble Skill Taxonomy v1',
      origin: 'marble',
      marbleId: t.id,
      centrality: t.centrality ?? undefined,
    };
    if (t.assessmentPrompt) s.prompt = { en: t.assessmentPrompt };
    if (t.subject === 'English' && ENGLISH_SPECIFIC.has(t.domain)) s.literacyLanguage = 'en';
    skills.push(s);
  }
  const domainTr = new Map();
  const dPath = 'catalog/translations/marble-domains.tsv';
  if (existsSync(join(root, dPath))) for (const row of readTsv(read(dPath))) domainTr.set(row.en, row);
  let order = 100;
  for (const d of marbleDomains.values()) {
    const t = domainTr.get(d.name);
    const name = { en: d.name };
    if (t?.fr) name.fr = t.fr;
    if (t?.pt) name.pt = t.pt;
    domains.push({ id: d.id, subjectId: d.subjectId, name, order: order++ });
  }

  // Dependencies
  const ids = new Set();
  for (const s of skills) {
    if (ids.has(s.id)) errors.push(`Duplicate skill id ${s.id}`);
    ids.add(s.id);
  }
  const dependencies = [];
  for (const row of readTsv(read('catalog/early/links.tsv'))) {
    for (const id of [row.prerequisite, row.skill]) if (!ids.has(id)) errors.push(`Link ${row.prerequisite} → ${row.skill}: unknown skill ${id}`);
    if (!['hard', 'soft'].includes(row.strength)) errors.push(`Link ${row.prerequisite} → ${row.skill}: bad strength`);
    const bridge = row.skill.startsWith('mt_') || row.prerequisite.startsWith('mt_');
    dependencies.push({ skillId: row.skill, prerequisiteId: row.prerequisite, strength: row.strength, reason: row.reason, origin: bridge ? 'bridge' : 'own' });
  }
  for (const d of JSON.parse(read('catalog/marble/dependencies.json')).dependencies) {
    dependencies.push({ skillId: d.topicId, prerequisiteId: d.prerequisiteId, strength: d.strength, reason: d.reason, origin: 'marble' });
  }

  // Parent-friendly summaries
  const clusters = JSON.parse(read('catalog/marble/clusters.json')).clusters.map((c) => ({
    subjectId: MARBLE_DOMAIN_SUBJECT[c.domain] ?? MARBLE_SUBJECT[c.subject],
    domainId: marbleDomainId(c.domain ?? c.subject),
    ageStart: c.ageRangeStart,
    summary: c.summary,
  }));

  const manifest = JSON.parse(read('catalog/marble/manifest.json'));
  const catalog = {
    version: `A-${new Date().toISOString().slice(0, 10)}+marble-${manifest.taxonomyVersion}`,
    subjects,
    domains,
    skills,
    dependencies,
    clusters,
  };
  return { catalog, errors };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { catalog, errors } = buildCatalog();
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
  const out = join(root, 'src/data/catalog.json');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(catalog));
  const own = catalog.skills.filter((s) => s.origin === 'own').length;
  console.log(
    `catalog: ${catalog.skills.length} skills (${own} own, ${catalog.skills.length - own} Marble), ` +
      `${catalog.dependencies.length} links, ${catalog.subjects.length} subjects, ${catalog.domains.length} domains`,
  );
}
