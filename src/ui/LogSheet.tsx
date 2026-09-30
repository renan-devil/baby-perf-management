// "Log a skill" dialog: search a skill (or start from one), pick a status and a date.

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { searchSkills, tr } from '../catalog';
import { todayIso } from '../domain/age';
import type { Locale, ObservationStatus, Skill } from '../domain/types';
import { useLocale } from '../i18n';
import { useData } from '../store/DataContext';
import { Modal, SubjectDot } from './common';

const STATUSES: ObservationStatus[] = ['achieved', 'emerging', 'not_yet', 'lost'];
const LANGS: Locale[] = ['fr', 'en', 'pt'];

export function LogSheet({ initial, onClose }: { initial?: Skill; onClose: () => void }) {
  const { t } = useTranslation();
  const locale = useLocale();
  const { log, child } = useData();
  const [skill, setSkill] = useState<Skill | undefined>(initial);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<ObservationStatus>('achieved');
  const [date, setDate] = useState(todayIso());
  const [langs, setLangs] = useState<Locale[]>([]);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const results = skill ? [] : searchSkills(query, locale, 20);
  const isLanguage = skill && (skill.subjectId === 'communication' || skill.subjectId === 'literacy');

  const save = async () => {
    if (!skill) return;
    setSaving(true);
    try {
      await log([{ skillId: skill.id, status, observedOn: date, languages: langs.length ? langs : undefined, note: note || undefined }]);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={t('log.title')} onClose={onClose}>
      {!skill ? (
        <div className="stack">
          <input autoFocus className="input" placeholder={t('log.search')} value={query} onChange={(e) => setQuery(e.target.value)} />
          <div className="list">
            {results.map((s) => (
              <button key={s.id} className="list-btn" onClick={() => setSkill(s)}>
                <SubjectDot subjectId={s.subjectId} /> {tr(s.name, locale)}
              </button>
            ))}
            {query && !results.length && <p className="muted">{t('log.noResult')}</p>}
          </div>
        </div>
      ) : (
        <div className="stack">
          <div className="picked">
            <SubjectDot subjectId={skill.subjectId} /> <strong>{tr(skill.name, locale)}</strong>
            {!initial && (
              <button className="link-btn" onClick={() => setSkill(undefined)}>
                {t('log.change')}
              </button>
            )}
          </div>
          <fieldset className="seg">
            <legend>{t('log.status')}</legend>
            {STATUSES.map((s) => (
              <label key={s} className={status === s ? 'on' : ''}>
                <input type="radio" name="status" checked={status === s} onChange={() => setStatus(s)} />
                {t(`obs.${s}`)}
              </label>
            ))}
          </fieldset>
          <label className="field">
            {t('log.date')}
            <input type="date" className="input" value={date} min={child?.birthDate} max={todayIso()} onChange={(e) => setDate(e.target.value)} />
          </label>
          {isLanguage && (
            <fieldset className="seg">
              <legend>{t('log.languages')}</legend>
              {LANGS.map((l) => (
                <label key={l} className={langs.includes(l) ? 'on' : ''}>
                  <input
                    type="checkbox"
                    checked={langs.includes(l)}
                    onChange={() => setLangs((x) => (x.includes(l) ? x.filter((y) => y !== l) : [...x, l]))}
                  />
                  {t(`lang.${l}`)}
                </label>
              ))}
            </fieldset>
          )}
          <label className="field">
            {t('log.note')}
            <textarea className="input" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
          </label>
          <button className="btn primary" disabled={saving} onClick={save}>
            {t('common.save')}
          </button>
        </div>
      )}
    </Modal>
  );
}
