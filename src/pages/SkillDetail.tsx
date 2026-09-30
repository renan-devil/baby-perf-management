import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { domainById, graph, isFallback, skillById, tr, trList, unlockCounts } from '../catalog';
import { ageInMonths } from '../domain/age';
import { achievementPercentile } from '../domain/progress';
import { useLocale } from '../i18n';
import { useData } from '../store/DataContext';
import { useProgress } from '../store/useProgress';
import { monthsText, SkillRow, StatusBadge, SubjectLabel, typicalAgeText } from '../ui/common';
import { LogSheet } from '../ui/LogSheet';

export function SkillDetail() {
  const { id = '' } = useParams();
  const { t } = useTranslation();
  const locale = useLocale();
  const { child, observations, log, deleteObservation, readOnly } = useData();
  const progress = useProgress();
  const [logging, setLogging] = useState(false);
  const skill = skillById.get(id);
  if (!skill || !progress || !child) return <div className="page">{t('skill.notFound')}</div>;

  const status = progress.statusOf(skill);
  const state = progress.states.get(skill.id);
  const i = graph.index.get(skill.id)!;
  const prereqs = graph.in[i];
  const unlocks = graph.out[i];
  const history = observations.filter((o) => o.skillId === skill.id).sort((a, b) => b.observedOn.localeCompare(a.observedOn));
  const evidence = trList(skill.evidence, locale);
  const activities = trList(skill.activities, locale);
  const description = tr(skill.description, locale);
  const percentile = state?.achievedOn ? achievementPercentile(skill, ageInMonths(child.birthDate, state.achievedOn)) : undefined;
  const prompt = skill.prompt ? tr(skill.prompt, locale).replace(/\{\{name\}\}/g, child.firstName) : '';

  return (
    <div className="page">
      <p>
        <SubjectLabel subjectId={skill.subjectId} /> · <span className="muted">{tr(domainById.get(skill.domainId)?.name, locale)}</span>
      </p>
      <h1>{tr(skill.name, locale)}</h1>
      {isFallback(skill.name, locale) && <p className="muted small">{t('common.notTranslated')}</p>}
      <p>
        <StatusBadge status={status} />
      </p>

      {!readOnly && (
        <div className="row">
          {!status.done && (
            <button className="btn primary" onClick={() => log([{ skillId: skill.id, status: 'achieved' }])}>
              ✓ {t('skill.achievedToday')}
            </button>
          )}
          <button className="btn" onClick={() => setLogging(true)}>
            {t('skill.logOther')}
          </button>
          <Link className="btn" to={`/map?focus=${encodeURIComponent(skill.id)}`}>
            {t('skill.onMap')}
          </Link>
        </div>
      )}

      {description && evidence[0] !== description && <p>{description}</p>}
      {evidence.length > 0 && (
        <section>
          <h3>{t('skill.evidence')}</h3>
          <ul>
            {evidence.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </section>
      )}
      {prompt && (
        <p className="callout">
          <strong>{t('skill.ask')}</strong> {prompt}
        </p>
      )}
      {activities.length > 0 && (
        <section>
          <h3>{t('skill.activities')}</h3>
          <ul>
            {activities.map((a) => (
              <li key={a}>💡 {a}</li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h3>{t('skill.reference')}</h3>
        <p>
          {typicalAgeText(skill, t)}
          {skill.percentiles && (
            <>
              {' '}
              · {t('skill.median', { age: monthsText(skill.percentiles.p50, t) })} ·{' '}
              {t(skill.percentilesConfidence === 'measured' ? 'skill.measured' : 'skill.estimated')}
            </>
          )}
        </p>
        {skill.kind === 'learning_goal' && <p className="muted small">{t('skill.learningGoalNote')}</p>}
        {percentile !== undefined && <p>{t('skill.percentile', { p: percentile, rest: 100 - percentile })}</p>}
        <p className="muted small">
          {t('skill.source')}: {skill.source}
        </p>
      </section>

      <section>
        <h3>{t('skill.prerequisites', { count: prereqs.length })}</h3>
        <div className="cards">
          {prereqs.map((e) => {
            const s = skillById.get(e.from)!;
            return (
              <SkillRow
                key={e.from}
                skill={s}
                status={progress.statusOf(s)}
                extra={<span className="muted small">{e.strength === 'hard' ? t('link.hard') : t('link.soft')} · {e.reason}</span>}
              />
            );
          })}
        </div>
      </section>
      <section>
        <h3>{t('skill.unlocks', { count: unlockCounts.get(skill.id) ?? 0 })}</h3>
        <div className="cards">
          {unlocks.slice(0, 20).map((e) => {
            const s = skillById.get(e.to)!;
            return <SkillRow key={e.to} skill={s} status={progress.statusOf(s)} />;
          })}
        </div>
      </section>

      <section>
        <h3>{t('skill.history')}</h3>
        {history.length === 0 && <p className="muted">{t('skill.noHistory')}</p>}
        <ul className="plain">
          {history.map((o) => (
            <li key={o.id}>
              {o.observedOn} · {t(`obs.${o.status}`)}
              {o.approximate && <span className="muted small"> ({t('skill.approximate')})</span>}
              {o.languages?.length ? <span className="muted small"> · {o.languages.map((l) => t(`lang.${l}`)).join(', ')}</span> : null}
              {o.note && <span className="muted small"> · {o.note}</span>}
              {!readOnly && (
                <button className="link-btn" onClick={() => confirm(t('skill.confirmDelete')) && deleteObservation(o.id)}>
                  {t('common.delete')}
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
      {logging && <LogSheet initial={skill} onClose={() => setLogging(false)} />}
    </div>
  );
}
