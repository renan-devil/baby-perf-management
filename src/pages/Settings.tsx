import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { catalog } from '../catalog';
import type { Locale } from '../domain/types';
import { setLocale, useLocale } from '../i18n';
import { useData } from '../store/DataContext';
import type { Snapshot } from '../store/repo';
import { supabase, SupabaseRepo } from '../store/supabaseRepo';
import { downloadFile } from '../ui/common';
import { importSeed, seedCount } from './importSeed';

const LANGS: Locale[] = ['fr', 'en', 'pt'];

export function Settings() {
  const { t } = useTranslation();
  const locale = useLocale();
  const data = useData();
  const { child, observations, journal, repo } = data;
  const [name, setName] = useState(child?.firstName ?? '');
  const [birth, setBirth] = useState(child?.birthDate ?? '');
  const [weeks, setWeeks] = useState(child?.gestationalWeeks ? String(child.gestationalWeeks) : '');
  const [home, setHome] = useState<Locale[]>(child?.homeLanguages ?? []);
  const [msg, setMsg] = useState('');

  const saveProfile = async () => {
    await data.saveChild({ id: child?.id, firstName: name, birthDate: birth, gestationalWeeks: weeks ? Number(weeks) : null, homeLanguages: home });
    setMsg(t('settings.saved'));
  };

  const exportJson = () => {
    const snapshot: Snapshot = { child, observations, journal };
    downloadFile(`${child?.firstName ?? 'child'}-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify({ catalogVersion: catalog.version, ...snapshot }, null, 1));
  };
  const importJson = async (file: File) => {
    const parsed = JSON.parse(await file.text()) as Snapshot;
    if (!parsed.child || !Array.isArray(parsed.observations)) throw new Error('Invalid file');
    if (confirm(t('settings.confirmReplace'))) {
      await data.replaceAll({ child: parsed.child, observations: parsed.observations, journal: parsed.journal ?? [] });
      setMsg(t('settings.imported'));
    }
  };

  return (
    <div className="page narrow">
      <h1>{t('settings.title')}</h1>

      <section className="card stack">
        <h2>{t('settings.language')}</h2>
        <div className="seg">
          {LANGS.map((l) => (
            <label key={l} className={locale === l ? 'on' : ''}>
              <input type="radio" name="ui-lang" checked={locale === l} onChange={() => setLocale(l)} />
              {t(`lang.${l}`)}
            </label>
          ))}
        </div>
      </section>

      {child && !data.readOnly && (
        <section className="card stack">
          <h2>{t('settings.child')}</h2>
          <label className="field">
            {t('settings.firstName')}
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="field">
            {t('settings.birthDate')}
            <input className="input" type="date" value={birth} onChange={(e) => setBirth(e.target.value)} />
          </label>
          <label className="field">
            {t('settings.gestationalWeeks')}
            <input className="input" type="number" min={22} max={42} value={weeks} onChange={(e) => setWeeks(e.target.value)} />
          </label>
          <fieldset className="seg">
            <legend>{t('settings.homeLanguages')}</legend>
            {LANGS.map((l) => (
              <label key={l} className={home.includes(l) ? 'on' : ''}>
                <input type="checkbox" checked={home.includes(l)} onChange={() => setHome((x) => (x.includes(l) ? x.filter((y) => y !== l) : [...x, l]))} />
                {t(`lang.${l}`)}
              </label>
            ))}
          </fieldset>
          <button className="btn primary" onClick={saveProfile}>
            {t('common.save')}
          </button>
        </section>
      )}

      {repo instanceof SupabaseRepo ? <FamilySection repo={repo} childId={child?.id} /> : (
        <section className="card stack">
          <h2>{t('settings.storage')}</h2>
          <p className="muted">{t('settings.localMode')}</p>
        </section>
      )}

      {!data.readOnly && (
        <section className="card stack">
          <h2>{t('settings.data')}</h2>
          <button className="btn" onClick={exportJson}>
            ⬇ {t('settings.export')}
          </button>
          <label className="btn">
            ⬆ {t('settings.importFile')}
            <input type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0]).catch((err: Error) => setMsg(err.message))} />
          </label>
          <button className="btn" onClick={async () => { await importSeed(data); setMsg(t('settings.imported')); }}>
            {t('settings.importExcel', { count: seedCount })}
          </button>
          <button className="btn danger" onClick={() => confirm(t('settings.confirmDeleteAll')) && data.deleteAll()}>
            {t('settings.deleteAll')}
          </button>
        </section>
      )}
      {msg && <p className="callout">{msg}</p>}

      <section className="card stack">
        <Link to="/about">{t('about.title')}</Link>
        {supabase && (
          <button className="link-btn" onClick={() => supabase!.auth.signOut().then(() => location.reload())}>
            {t('settings.signOut')}
          </button>
        )}
      </section>
    </div>
  );
}

function FamilySection({ repo, childId }: { repo: SupabaseRepo; childId?: string }) {
  const { t } = useTranslation();
  const [members, setMembers] = useState<{ user_id: string; role: string }[]>([]);
  const [invites, setInvites] = useState<{ email: string; role: string }[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'editor' | 'viewer'>('editor');
  const [link, setLink] = useState('');
  const [error, setError] = useState('');

  const refresh = () => {
    repo.members().then(setMembers).catch(() => undefined);
    repo.invitations().then(setInvites).catch(() => undefined);
  };
  useEffect(refresh, [repo]);

  return (
    <section className="card stack">
      <h2>{t('settings.family')}</h2>
      <p className="muted small">{t('settings.familyHelp')}</p>
      <ul className="plain small">
        {members.map((m) => (
          <li key={m.user_id}>
            {m.user_id.slice(0, 8)}… · {t(`role.${m.role}`)}
          </li>
        ))}
        {invites.map((i) => (
          <li key={i.email}>
            {i.email} · {t(`role.${i.role}`)} · <em>{t('settings.pending')}</em>
          </li>
        ))}
      </ul>
      <div className="row">
        <input className="input" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <select className="input" value={role} onChange={(e) => setRole(e.target.value as 'editor' | 'viewer')}>
          <option value="editor">{t('role.editor')}</option>
          <option value="viewer">{t('role.viewer')}</option>
        </select>
        <button className="btn" onClick={() => repo.invite(email, role).then(() => { setEmail(''); refresh(); }).catch((e: Error) => setError(e.message))}>
          {t('settings.invite')}
        </button>
      </div>
      {childId && (
        <>
          <h3>{t('settings.share')}</h3>
          <p className="muted small">{t('settings.shareHelp')}</p>
          <div className="row">
            <button className="btn" onClick={() => repo.createShareLink(childId, 30).then((tok) => setLink(`${location.origin}${location.pathname}#/share/${tok}`)).catch((e: Error) => setError(e.message))}>
              {t('settings.createLink')}
            </button>
            <button className="btn" onClick={() => repo.revokeShareLinks(childId).then(() => setLink(''))}>
              {t('settings.revokeLinks')}
            </button>
          </div>
          {link && <input className="input" readOnly value={link} onFocus={(e) => e.target.select()} />}
        </>
      )}
      {error && <p className="callout serious">{error}</p>}
    </section>
  );
}
