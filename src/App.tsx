import { useTranslation } from 'react-i18next';
import { HashRouter, NavLink, Route, Routes, Link } from 'react-router-dom';
import { useData } from './store/DataContext';
import { About } from './pages/About';
import { Alerts } from './pages/Alerts';
import { CheckIn } from './pages/CheckIn';
import { Journal } from './pages/Journal';
import { ProgressPage } from './pages/Progress';
import { Settings } from './pages/Settings';
import { Setup } from './pages/Setup';
import { SkillDetail } from './pages/SkillDetail';
import { SkillMap } from './pages/SkillMap';
import { Skills } from './pages/Skills';
import { Today } from './pages/Today';

export function App() {
  const { t } = useTranslation();
  const { loading, error, child, readOnly } = useData();

  if (loading) return <p className="page">{t('common.loading')}</p>;

  return (
    <HashRouter>
      <header className="topbar">
        <Link to="/" className="brand">
          <img src="icon.svg" alt="" width={24} height={24} /> {child?.firstName ?? t('app.name')}
        </Link>
        {readOnly && <span className="badge tone-neutral">{t('app.readOnly')}</span>}
        <NavLink to="/settings" className="icon-btn" aria-label={t('settings.title')}>
          ⚙
        </NavLink>
      </header>
      {error && <p className="callout serious page">{error}</p>}
      <main>
        {!child ? (
          <Routes>
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Setup />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Today />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/skill/:id" element={<SkillDetail />} />
            <Route path="/map" element={<SkillMap />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Today />} />
          </Routes>
        )}
      </main>
      {child && (
        <nav className="bottombar">
          <NavLink to="/" end>
            <span aria-hidden>⌂</span>
            {t('nav.today')}
          </NavLink>
          <NavLink to="/skills">
            <span aria-hidden>☰</span>
            {t('nav.skills')}
          </NavLink>
          <NavLink to="/map">
            <span aria-hidden>⋔</span>
            {t('nav.map')}
          </NavLink>
          <NavLink to="/progress">
            <span aria-hidden>↗</span>
            {t('nav.progress')}
          </NavLink>
          {!readOnly && (
            <NavLink to="/journal">
              <span aria-hidden>✎</span>
              {t('nav.journal')}
            </NavLink>
          )}
        </nav>
      )}
    </HashRouter>
  );
}
