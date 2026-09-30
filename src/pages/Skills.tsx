import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { catalog, domainById, normalise, subjectsOrdered, tr } from '../catalog';
import { typicalAgeMonths } from '../domain/cdf';
import { useLocale } from '../i18n';
import { useProgress } from '../store/useProgress';
import { Empty, SkillRow, SubjectDot } from '../ui/common';

type AgeFilter = 'around' | 'all';
type StatusFilter = 'all' | 'todo' | 'done';

export function Skills() {
  const { t } = useTranslation();
  const locale = useLocale();
  const progress = useProgress();
  const [subject, setSubject] = useState<string>('all');
  const [age, setAge] = useState<AgeFilter>('around');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(150);

  const filtered = useMemo(() => {
    if (!progress) return [];
    const q = normalise(query);
    return catalog.skills
      .filter((s) => subject === 'all' || s.subjectId === subject)
      .filter((s) => {
        if (age === 'all') return true;
        const ta = typicalAgeMonths(s);
        return ta === undefined || ta <= progress.ageMonths + 18;
      })
      .filter((s) => {
        if (status === 'all') return true;
        const done = progress.statusOf(s).done;
        return status === 'done' ? done : !done;
      })
      .filter((s) => !q || normalise(tr(s.name, locale)).includes(q) || normalise(s.name.en).includes(q))
      .sort((a, b) => (typicalAgeMonths(a) ?? 999) - (typicalAgeMonths(b) ?? 999));
  }, [progress, subject, age, status, query, locale]);

  if (!progress) return null;
  const groups = new Map<string, typeof filtered>();
  for (const s of filtered.slice(0, limit)) {
    if (!groups.has(s.domainId)) groups.set(s.domainId, []);
    groups.get(s.domainId)!.push(s);
  }
  const groupList = [...groups].sort(
    (a, b) => (domainById.get(a[0])?.order ?? 0) - (domainById.get(b[0])?.order ?? 0) || a[0].localeCompare(b[0]),
  );

  return (
    <div className="page">
      <h1>{t('skills.title')}</h1>
      <input className="input" placeholder={t('skills.search')} value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="chips">
        <button className={subject === 'all' ? 'chip on' : 'chip'} onClick={() => setSubject('all')}>
          {t('skills.allSubjects')}
        </button>
        {subjectsOrdered.map((s) => (
          <button key={s.id} className={subject === s.id ? 'chip on' : 'chip'} onClick={() => setSubject(s.id)}>
            <SubjectDot subjectId={s.id} /> {tr(s.name, locale)}
          </button>
        ))}
      </div>
      <div className="filters">
        <select className="input" value={age} onChange={(e) => setAge(e.target.value as AgeFilter)} aria-label={t('skills.age')}>
          <option value="around">{t('skills.aroundAge')}</option>
          <option value="all">{t('skills.allAges')}</option>
        </select>
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)} aria-label={t('skills.status')}>
          <option value="all">{t('skills.allStatus')}</option>
          <option value="todo">{t('skills.todo')}</option>
          <option value="done">{t('skills.done')}</option>
        </select>
      </div>
      <p className="muted small">{t('skills.count', { count: filtered.length })}</p>
      {groupList.length === 0 && <Empty>{t('skills.none')}</Empty>}
      {groupList.map(([domainId, skills]) => (
        <section key={domainId}>
          <h3>{tr(domainById.get(domainId)?.name, locale)}</h3>
          <div className="cards">
            {skills.map((s) => (
              <SkillRow key={s.id} skill={s} status={progress.statusOf(s)} />
            ))}
          </div>
        </section>
      ))}
      {filtered.length > limit && (
        <button className="btn" onClick={() => setLimit((l) => l + 150)}>
          {t('skills.more')}
        </button>
      )}
    </div>
  );
}
