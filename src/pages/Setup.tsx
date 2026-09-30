// First run: create the child profile, or import Constance's Excel history.

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { todayIso } from '../domain/age';
import type { Locale } from '../domain/types';
import { useData } from '../store/DataContext';
import { importSeed, seedCount } from './importSeed';

export function Setup() {
  const { t } = useTranslation();
  const data = useData();
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [weeks, setWeeks] = useState('');
  const [busy, setBusy] = useState(false);

  const create = async () => {
    if (!name || !birth) return;
    setBusy(true);
    await data.saveChild({ firstName: name, birthDate: birth, gestationalWeeks: weeks ? Number(weeks) : null, homeLanguages: ['fr'] as Locale[] });
    setBusy(false);
  };

  return (
    <div className="page narrow">
      <h1>{t('setup.title')}</h1>
      <section className="card stack">
        <h2>{t('setup.importTitle')}</h2>
        <p className="muted">{t('setup.importHelp', { count: seedCount })}</p>
        <button className="btn primary" disabled={busy} onClick={async () => { setBusy(true); await importSeed(data); setBusy(false); }}>
          {t('setup.import')}
        </button>
      </section>
      <p className="muted center">{t('setup.or')}</p>
      <section className="card stack">
        <h2>{t('setup.newTitle')}</h2>
        <label className="field">
          {t('settings.firstName')}
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="field">
          {t('settings.birthDate')}
          <input className="input" type="date" max={todayIso()} value={birth} onChange={(e) => setBirth(e.target.value)} />
        </label>
        <label className="field">
          {t('settings.gestationalWeeks')}
          <input className="input" type="number" min={22} max={42} value={weeks} onChange={(e) => setWeeks(e.target.value)} />
        </label>
        <button className="btn" disabled={busy || !name || !birth} onClick={create}>
          {t('setup.create')}
        </button>
      </section>
    </div>
  );
}
