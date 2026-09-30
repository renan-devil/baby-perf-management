// Quick check-in: tick, subject by subject, what the child can do today among the skills
// expected around their age. Ticking a skill also implies its hard prerequisites.

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { catalog, subjectsOrdered, tr } from '../catalog';
import { typicalAgeMonths } from '../domain/cdf';
import { useLocale } from '../i18n';
import { useData } from '../store/DataContext';
import { useProgress } from '../store/useProgress';
import { StatusBadge, SubjectDot } from '../ui/common';

export function CheckIn() {
  const { t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();
  const { log } = useData();
  const progress = useProgress();
  const [subject, setSubject] = useState(subjectsOrdered[0].id);
  const [ticked, setTicked] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  const candidates = useMemo(() => {
    if (!progress) return [];
    return catalog.skills
      .filter((s) => s.subjectId === subject && s.kind !== 'behaviour' && !progress.statusOf(s).done)
      .filter((s) => {
        const ta = typicalAgeMonths(s);
        return ta !== undefined && ta <= progress.ageMonths + 12 && ta >= progress.ageMonths - 30;
      })
      .sort((a, b) => typicalAgeMonths(a)! - typicalAgeMonths(b)!);
  }, [progress, subject]);

  if (!progress) return null;
  const save = async () => {
    setSaving(true);
    try {
      await log([...ticked].map((skillId) => ({ skillId, status: 'achieved' as const, note: t('checkin.note') })));
      navigate('/');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <h1>{t('checkin.title')}</h1>
      <p className="muted">{t('checkin.help')}</p>
      <div className="chips">
        {subjectsOrdered.slice(0, 8).map((s) => (
          <button key={s.id} className={subject === s.id ? 'chip on' : 'chip'} onClick={() => setSubject(s.id)}>
            <SubjectDot subjectId={s.id} /> {tr(s.name, locale)}
          </button>
        ))}
      </div>
      <div className="cards">
        {candidates.map((s) => (
          <label key={s.id} className="check-row">
            <input
              type="checkbox"
              checked={ticked.has(s.id)}
              onChange={() => setTicked((x) => { const n = new Set(x); if (n.has(s.id)) n.delete(s.id); else n.add(s.id); return n; })}
            />
            <span className="skill-row-main">
              <span>{tr(s.name, locale)}</span>
              <span className="muted small">{tr(s.description, locale)}</span>
            </span>
            <StatusBadge status={progress.statusOf(s)} />
          </label>
        ))}
        {candidates.length === 0 && <p className="muted">{t('checkin.none')}</p>}
      </div>
      <div className="sticky-bar">
        <button className="btn primary" disabled={!ticked.size || saving} onClick={save}>
          {t('checkin.save', { count: ticked.size })}
        </button>
      </div>
    </div>
  );
}
