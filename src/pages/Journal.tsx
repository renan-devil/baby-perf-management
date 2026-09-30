import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { searchSkills, skillById, tr } from '../catalog';
import { todayIso } from '../domain/age';
import type { JournalEntry } from '../domain/types';
import { useLocale } from '../i18n';
import { useData } from '../store/DataContext';
import { Empty } from '../ui/common';

/** Downscale a photo to at most 1024 px and JPEG quality 0.8 before storing it. */
async function downscale(file: File): Promise<string> {
  const img = await createImageBitmap(file);
  const scale = Math.min(1, 1024 / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.8);
}

export function Journal() {
  const { t } = useTranslation();
  const locale = useLocale();
  const { journal, saveJournal, deleteJournal, repo, child, readOnly } = useData();
  const [text, setText] = useState('');
  const [date, setDate] = useState(todayIso());
  const [photo, setPhoto] = useState<string | undefined>();
  const [skillQuery, setSkillQuery] = useState('');
  const [skillIds, setSkillIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const entries = [...journal].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));

  const add = async () => {
    if (!child || (!text.trim() && !photo)) return;
    setSaving(true);
    try {
      const ref = photo ? await repo.storePhoto(photo, child.id) : undefined;
      await saveJournal({ date, text: text.trim(), photo: ref, skillIds });
      setText('');
      setPhoto(undefined);
      setSkillIds([]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <h1>{t('journal.title')}</h1>
      {!readOnly && (
        <section className="card stack">
          <textarea className="input" rows={3} placeholder={t('journal.placeholder', { name: child?.firstName })} value={text} onChange={(e) => setText(e.target.value)} />
          <div className="row">
            <input type="date" className="input" value={date} max={todayIso()} onChange={(e) => setDate(e.target.value)} />
            <label className="btn">
              📷 {t('journal.photo')}
              <input type="file" accept="image/*" hidden onChange={async (e) => e.target.files?.[0] && setPhoto(await downscale(e.target.files[0]))} />
            </label>
          </div>
          {photo && <img src={photo} alt="" className="thumb" />}
          <input className="input" placeholder={t('journal.linkSkill')} value={skillQuery} onChange={(e) => setSkillQuery(e.target.value)} />
          {skillQuery && (
            <div className="list">
              {searchSkills(skillQuery, locale, 6).map((s) => (
                <button key={s.id} className="list-btn" onClick={() => { setSkillIds((x) => [...new Set([...x, s.id])]); setSkillQuery(''); }}>
                  {tr(s.name, locale)}
                </button>
              ))}
            </div>
          )}
          {skillIds.length > 0 && (
            <p className="small">
              {skillIds.map((id) => (
                <span key={id} className="chip on" onClick={() => setSkillIds((x) => x.filter((y) => y !== id))}>
                  {tr(skillById.get(id)?.name, locale)} ×
                </span>
              ))}
            </p>
          )}
          <button className="btn primary" disabled={saving} onClick={add}>
            {t('journal.add')}
          </button>
        </section>
      )}
      {entries.length === 0 && <Empty>{t('journal.empty')}</Empty>}
      {entries.map((e) => (
        <Entry key={e.id} entry={e} onDelete={readOnly ? undefined : () => confirm(t('journal.confirmDelete')) && deleteJournal(e.id)} />
      ))}
    </div>
  );
}

function Entry({ entry, onDelete }: { entry: JournalEntry; onDelete?: () => void }) {
  const { t } = useTranslation();
  const locale = useLocale();
  const { repo } = useData();
  const [src, setSrc] = useState<string>();
  useEffect(() => {
    if (entry.photo) void repo.photoUrl(entry.photo).then(setSrc);
  }, [entry.photo, repo]);
  return (
    <article className="card">
      <p className="muted small">{entry.date}</p>
      {entry.text && <p className="journal-text">{entry.text}</p>}
      {src && <img src={src} alt="" className="photo" />}
      {entry.skillIds.length > 0 && (
        <p className="small">
          {entry.skillIds.map((id) => (
            <Link key={id} to={`/skill/${encodeURIComponent(id)}`} className="chip">
              {tr(skillById.get(id)?.name, locale)}
            </Link>
          ))}
        </p>
      )}
      {onDelete && (
        <button className="link-btn" onClick={onDelete}>
          {t('common.delete')}
        </button>
      )}
    </article>
  );
}
