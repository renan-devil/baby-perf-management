// Invitation-only sign-in by email code (works inside the installed phone app, where
// magic links would open in the browser instead).

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../store/supabaseRepo';

export function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const send = async () => {
    setError('');
    const { error: e } = await supabase!.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false, emailRedirectTo: `${location.origin}${location.pathname}` },
    });
    if (e) setError(t('login.error', { message: e.message }));
    else setSent(true);
  };
  const verify = async () => {
    setError('');
    const { error: e } = await supabase!.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: 'email' });
    if (e) setError(t('login.error', { message: e.message }));
  };

  return (
    <div className="page narrow">
      <h1>
        <img src="icon.svg" alt="" width={32} height={32} /> {t('app.name')}
      </h1>
      <section className="card stack">
        <p className="muted">{t('login.help')}</p>
        <input className="input" type="email" autoComplete="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        {!sent ? (
          <button className="btn primary" disabled={!email} onClick={send}>
            {t('login.send')}
          </button>
        ) : (
          <>
            <p className="muted small">{t('login.sent')}</p>
            <input className="input" inputMode="numeric" autoComplete="one-time-code" placeholder="123456" value={code} onChange={(e) => setCode(e.target.value)} />
            <button className="btn primary" disabled={code.length < 6} onClick={verify}>
              {t('login.verify')}
            </button>
          </>
        )}
        {error && <p className="callout serious">{error}</p>}
      </section>
    </div>
  );
}
