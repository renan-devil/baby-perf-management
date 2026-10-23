// Home screen: one card per application.

import { useTranslation } from 'react-i18next';

const APPS = [
  { href: '#/dev/', icon: '🌱', key: 'development' },
  { href: '#/administrative', icon: '🗂', key: 'administrative' },
  { href: '#/school', icon: '🎒', key: 'school' },
] as const;

export function Hub() {
  const { t } = useTranslation();
  return (
    <>
      <header className="topbar">
        <span className="brand">
          <img src="icon.svg" alt="" width={24} height={24} /> Constance
        </span>
        <a href="/api/logout" className="icon-btn" aria-label={t('hub.lock')} title={t('hub.lock')}>
          🔒
        </a>
      </header>
      <main className="page narrow">
        <h1>{t('hub.title')}</h1>
        <div className="app-cards">
          {APPS.map((a) => (
            <a key={a.key} href={a.href} className="card app-card">
              <span className="app-icon" aria-hidden>
                {a.icon}
              </span>
              <span>
                <strong>{t(`hub.${a.key}.name`)}</strong>
                <span className="muted small">{t(`hub.${a.key}.desc`)}</span>
              </span>
            </a>
          ))}
        </div>
      </main>
    </>
  );
}
