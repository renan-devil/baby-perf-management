// Constance's bucket list: things to do once in childhood (bucket-list/items.json, one picture each),
// and which ones she has done. What she has done is shared by the family through api/bucket.ts,
// behind the site password.
//   #/bucket-list        the list: how many are done, search, All / Not yet / Done, a grid of pictures
//   #/bucket-list/<id>   one thing: picture, note, and "She did it!" with the day (or undo)

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { firstFirst, firstMarks, type Mark, type NewMark } from '../../api/_bucket';
import type { Lang } from '../../api/_stories';
import { ITEMS, search, type Item } from '../bucket/catalog';
import { useLocale } from '../i18n';
import { LangSwitch } from '../ui/LangSwitch';

const SHOWS = ['all', 'todo', 'done'] as const;
type Show = (typeof SHOWS)[number];

/** Today on this device's calendar (local time, not UTC), YYYY-MM-DD. */
function localToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** "2025-07-14" → "14 Jul 2025", in the interface language. */
function useFormatDay() {
  const { i18n } = useTranslation();
  const locale = i18n.language === 'pt' ? 'pt-PT' : i18n.language;
  return (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function BucketList({ path }: { path: string }) {
  const { t } = useTranslation();
  const appLocale = useLocale();
  const [lang, setLang] = useState<Lang>(appLocale); // starts in the interface language
  const [marks, setMarks] = useState<Mark[] | null>(null); // null while loading
  const [loadError, setLoadError] = useState('');
  const [query, setQuery] = useState('');
  const [show, setShow] = useState<Show>('all');
  const itemId = path.split('/')[2];

  useEffect(() => {
    fetch('/api/bucket')
      .then(async (res) => {
        if (!res.ok) throw new Error(String(res.status));
        setMarks((await res.json()) as Mark[]);
      })
      .catch((e: Error) => {
        setLoadError(e.message);
        setMarks([]);
      });
  }, []);

  // Start each page at the top (braces: an effect must not return what scrollTo returns).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [itemId]);

  const add = async (mark: NewMark) => {
    const res = await fetch('/api/bucket', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(mark) });
    if (!res.ok) throw new Error(String(res.status));
    const saved = (await res.json()) as Mark;
    setMarks((list) => [...(list ?? []), saved]);
  };

  /** Back to "not done yet": deletes every mark of the item (there is usually one). */
  const undo = async (item: Item) => {
    for (const mark of (marks ?? []).filter((m) => m.itemId === item.id)) {
      const res = await fetch(`/api/bucket?id=${encodeURIComponent(mark.id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(String(res.status));
      setMarks((list) => (list ?? []).filter((m) => m.id !== mark.id));
    }
  };

  const item = itemId ? ITEMS.find((i) => i.id === itemId) : undefined;

  return (
    <>
      <header className="topbar">
        {itemId ? (
          <a href="#/bucket-list" className="icon-btn" aria-label={t('bucket.back')} title={t('bucket.back')}>
            ‹
          </a>
        ) : (
          <a href="#/" className="icon-btn" aria-label={t('hub.title')}>
            ⌂
          </a>
        )}
        <span className="brand">{t('hub.bucketList.name')}</span>
        <LangSwitch lang={lang} onChange={setLang} label={t('bucket.readIn')} />
      </header>
      <main className="page narrow">
        {loadError && <p className="callout serious">{t('bucket.loadError', { message: loadError })}</p>}
        {!itemId ? (
          <ItemGrid lang={lang} marks={marks} query={query} setQuery={setQuery} show={show} setShow={setShow} />
        ) : item ? (
          <ItemPage key={item.id} item={item} lang={lang} marks={marks} onAdd={add} onUndo={undo} />
        ) : (
          <p>
            {t('bucket.notFound')} <a href="#/bucket-list">{t('bucket.back')}</a>
          </p>
        )}
      </main>
    </>
  );
}

function ItemGrid({
  lang,
  marks,
  query,
  setQuery,
  show,
  setShow,
}: {
  lang: Lang;
  marks: Mark[] | null;
  query: string;
  setQuery: (q: string) => void;
  show: Show;
  setShow: (s: Show) => void;
}) {
  const { t } = useTranslation();
  const formatDay = useFormatDay();
  const first = useMemo(() => firstMarks(marks ?? []), [marks]);
  const done = ITEMS.filter((i) => first.has(i.id)).length;
  const found = search(ITEMS, query);
  const count: Record<Show, number> = {
    all: found.length,
    todo: found.filter((i) => !first.has(i.id)).length,
    done: found.filter((i) => first.has(i.id)).length,
  };
  const shown = found.filter((i) => show === 'all' || (show === 'done') === first.has(i.id));

  return (
    <>
      <div className="bucket-progress">
        <span>{marks === null ? t('common.loading') : t('bucket.progress', { done, total: ITEMS.length })}</span>
        <span className="bucket-bar" aria-hidden>
          <span style={{ width: `${(100 * done) / ITEMS.length}%` }} />
        </span>
      </div>
      <input
        type="search"
        className="input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('bucket.searchPlaceholder')}
        aria-label={t('bucket.search')}
      />
      <div className="chips" role="group" aria-label={t('bucket.show')}>
        {SHOWS.map((s) => (
          <button key={s} className={show === s ? 'chip on' : 'chip'} aria-pressed={show === s} onClick={() => setShow(s)}>
            {t(`bucket.shows.${s}`)} · {count[s]}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="muted center">{t('bucket.none')}</p>
      ) : (
        <div className="bucket-grid">
          {shown.map((item) => {
            const mark = first.get(item.id);
            return (
              <a key={item.id} href={`#/bucket-list/${item.id}`} className={mark ? 'bucket-card done' : 'bucket-card'}>
                <span className="bucket-pic">
                  {item.picture ? <img src={item.picture} alt="" loading="lazy" /> : <span className="bucket-placeholder">🎈</span>}
                  {mark && (
                    <span className="bucket-stamp" aria-hidden>
                      ✓
                    </span>
                  )}
                </span>
                <span className="bucket-card-main">
                  <span className="bucket-name" lang={lang === 'pt' ? 'pt-PT' : lang}>
                    {item.title[lang]}
                  </span>
                  {marks === null ? null : mark ? (
                    <span className="small bucket-when">✓ {formatDay(mark.date)}</span>
                  ) : (
                    <span className="small muted">{t('bucket.shows.todo')}</span>
                  )}
                </span>
              </a>
            );
          })}
        </div>
      )}
    </>
  );
}

function ItemPage({
  item,
  lang,
  marks,
  onAdd,
  onUndo,
}: {
  item: Item;
  lang: Lang;
  marks: Mark[] | null;
  onAdd: (m: NewMark) => Promise<void>;
  onUndo: (i: Item) => Promise<void>;
}) {
  const { t } = useTranslation();
  const formatDay = useFormatDay();
  const [date, setDate] = useState(localToday);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null);
  const mark = (marks ?? []).filter((m) => m.itemId === item.id).sort(firstFirst)[0];

  const markDone = async () => {
    setBusy(true);
    setNote(null);
    try {
      await onAdd({ itemId: item.id, date: date || localToday() });
      setNote({ ok: true, text: t('bucket.saved') });
    } catch (e) {
      setNote({ ok: false, text: t('bucket.saveError', { message: (e as Error).message }) });
    } finally {
      setBusy(false);
    }
  };

  const undo = async () => {
    if (!confirm(t('bucket.confirmUndo'))) return;
    setBusy(true);
    setNote(null);
    try {
      await onUndo(item);
    } catch (e) {
      setNote({ ok: false, text: t('bucket.undoError', { message: (e as Error).message }) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <span className="bucket-pic">
        {item.picture && <img src={item.picture} className="story-picture" alt={item.title[lang]} />}
        {mark && (
          <span className="bucket-stamp big" aria-hidden>
            ✓
          </span>
        )}
      </span>
      <div lang={lang === 'pt' ? 'pt-PT' : lang}>
        <h1 className="story-heading">{item.title[lang]}</h1>
        <p className="bucket-note">{item.note[lang]}</p>
      </div>

      <section className="card stack">
        {marks === null ? (
          <p className="muted">{t('common.loading')}</p>
        ) : mark ? (
          <>
            <p className="bucket-done-line">✓ {t('bucket.doneOn', { date: formatDay(mark.date) })}</p>
            <div>
              <button className="btn" disabled={busy} onClick={() => void undo()}>
                {t('bucket.undo')}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>{t('bucket.didIt')}</h2>
            <label className="told-on">
              {t('bucket.day')}
              <input type="date" className="input" value={date} max={localToday()} onChange={(e) => setDate(e.target.value)} />
            </label>
            <button className="btn primary big" disabled={busy} onClick={() => void markDone()}>
              ✓ {t('bucket.markDone')}
            </button>
          </>
        )}
        {note && (
          <p className={note.ok ? 'small' : 'callout serious'} role="status">
            {note.text}
          </p>
        )}
      </section>
    </>
  );
}
