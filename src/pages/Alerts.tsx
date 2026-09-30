import { useTranslation } from 'react-i18next';
import { useProgress } from '../store/useProgress';
import { Empty, SkillRow } from '../ui/common';

export function Alerts() {
  const { t } = useTranslation();
  const progress = useProgress();
  if (!progress) return null;
  return (
    <div className="page">
      <h1>{t('alerts.title')}</h1>
      <p className="callout">{t('alerts.explain')}</p>
      {progress.alerts.length === 0 && <Empty>{t('alerts.none')}</Empty>}
      <div className="cards">
        {progress.alerts.map((a) => (
          <SkillRow key={a.skill.id} skill={a.skill} status={a.status} />
        ))}
      </div>
    </div>
  );
}
