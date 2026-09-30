import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useTranslation } from 'react-i18next';
import { App } from './App';
import './i18n';
import { Login } from './pages/Login';
import { DataProvider } from './store/DataContext';
import type { Snapshot } from './store/repo';
import { loadShared, supabase, SupabaseRepo } from './store/supabaseRepo';
import './styles.css';

const SHARE_KEY = 'ct-share-token';

/** Read-only view opened from a share link (#/share/<token>). */
function SharedRoot({ token }: { token: string }) {
  const { t } = useTranslation();
  const [snap, setSnap] = useState<Snapshot | null | undefined>();
  useEffect(() => {
    loadShared(token).then(setSnap).catch(() => setSnap(null));
  }, [token]);
  if (snap === undefined) return <p className="page">{t('common.loading')}</p>;
  if (snap === null) return <p className="page">{t('share.invalid')}</p>;
  return (
    <DataProvider initial={snap} readOnly>
      <App />
    </DataProvider>
  );
}

/** Cloud mode: sign in first, then load the family's data. */
function CloudRoot() {
  const { t } = useTranslation();
  const [ready, setReady] = useState<'checking' | 'in' | 'out'>('checking');
  useEffect(() => {
    supabase!.auth.getSession().then(({ data }) => setReady(data.session ? 'in' : 'out'));
    const { data } = supabase!.auth.onAuthStateChange((_e, session) => setReady(session ? 'in' : 'out'));
    return () => data.subscription.unsubscribe();
  }, []);
  if (ready === 'checking') return <p className="page">{t('common.loading')}</p>;
  if (ready === 'out') return <Login />;
  return (
    <DataProvider repo={new SupabaseRepo(supabase!)}>
      <App />
    </DataProvider>
  );
}

function Root() {
  const m = location.hash.match(/^#\/share\/([a-f0-9]+)/);
  if (m) {
    sessionStorage.setItem(SHARE_KEY, m[1]);
    history.replaceState(null, '', `${location.pathname}#/`);
  }
  const shareToken = sessionStorage.getItem(SHARE_KEY);
  if (shareToken) return <SharedRoot token={shareToken} />;
  if (supabase) return <CloudRoot />;
  return (
    <DataProvider>
      <App />
    </DataProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
