import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { skillById, trList } from '../catalog';
import { todayIso } from '../domain/age';
import { useLocale } from '../i18n';
import { useData } from '../store/DataContext';
import { useProgress } from '../store/useProgress';
import { AgeText, Empty, SkillRow } from '../ui/common';
import { LogSheet } from '../ui/LogSheet';

export function Today() {
  const { t } = useTranslation();
  const locale = useLocale();
  const { child, observations, readOnly } = useData();
  const progress = useProgress();
  const [logging, setLogging] = useState(false);
  if (!child || !progress) return null;

  const recent = [...observations].sort((a, b) => b.observedOn.localeCompare(a.observedOn) || b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  return (
    <div className="page">
      <section className="hero">
        <h1>{child.firstName}</h1>
        <p className="hero-age">
          <AgeText birthDate={child.birthDate} at={todayIso()} />
        </p>
        {!readOnly && (
          <button className="btn primary big" onClick={() => setLogging(true)}>
            + {t('today.log')}
          </button>
        )}
      </section>

      {progress.alerts.length > 0 && (
        <Link to="/alerts" className="callout serious">
          <strong>!</strong> {t('today.alerts', { count: progress.alerts.length })}
        </Link>
      )}

      <section>
        <h2>{t('today.upNext')}</h2>
        <p className="muted small">{t('today.upNextHelp')}</p>
        {progress.upNext.length ? (
          <div className="cards">
            {progress.upNext.map((s) => {
              const acts = trList(s.skill.activities, locale);
              return (
                <SkillRow
                  key={s.skill.id}
                  skill={s.skill}
                  status={progress.statusOf(s.skill)}
                  extra={
                    <>
                      {acts[0] && <span className="activity">💡 {acts[0]}</span>}
                      <span className="muted small">{s.unlocks > 0 ? t('today.unlocks', { count: s.unlocks }) : t('today.timely')}</span>
                    </>
                  }
                />
              );
            })}
          </div>
        ) : (
          <Empty>{t('today.nothingNext')}</Empty>
        )}
        {!readOnly && (
          <Link to="/checkin" className="btn">
            {t('today.checkin')}
          </Link>
        )}
      </section>

      <section>
        <h2>{t('today.recent')}</h2>
        {recent.length ? (
          <ul className="plain">
            {recent.map((o) => (
              <li key={o.id} className="muted small">
                {o.observedOn} · {t(`obs.${o.status}`)} · <RecentName id={o.skillId} />
              </li>
            ))}
          </ul>
        ) : (
          <Empty>{t('today.noRecent')}</Empty>
        )}
      </section>
      {logging && <LogSheet onClose={() => setLogging(false)} />}
    </div>
  );
}

function RecentName({ id }: { id: string }) {
  const locale = useLocale();
  const skill = skillById.get(id);
  if (!skill) return <>{id}</>;
  return <Link to={`/skill/${encodeURIComponent(id)}`}>{skill.name[locale] ?? skill.name.en}</Link>;
}

