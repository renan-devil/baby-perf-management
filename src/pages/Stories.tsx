// Stories to tell Constance (texts and pictures: stories/), and how she liked each telling.
// Her reactions are shared by the family through api/stories.ts, behind the site password.
//   #/stories        the list, with filters and "what Constance likes"
//   #/stories/<id>   one story: picture, text in FR/EN/PT, reaction buttons and history

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGS, newestFirst, REACTIONS, type Lang, type NewTelling, type Reaction, type Telling } from '../../api/_stories';
import { useLocale } from '../i18n';
import { authorName, hasText, LENGTHS, STORIES, storyText, STYLES, THEMES, type Block, type Story } from '../stories/catalog';
import { latestByStory, tasteBy } from '../stories/taste';

const EMOJI: Record<Reaction, string> = { loved: '😍', ok: '🙂', disliked: '😕' };

interface Filters {
  minutes: number; // 0 = any length
  style: string; // '' = any style
  theme: string; // '' = any theme
}

/** Today on this device's calendar (local time, not UTC), YYYY-MM-DD. */
function localToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** "2026-11-07" → "7 Nov" (with the year when it is not this year), in the interface language. */
function useFormatDay() {
  const { i18n } = useTranslation();
  const locale = i18n.language === 'pt' ? 'pt-PT' : i18n.language;
  return (iso: string) => {
    const d = new Date(`${iso}T12:00:00`);
    const thisYear = d.getFullYear() === new Date().getFullYear();
    return d.toLocaleDateString(locale, { day: 'numeric', month: 'short', ...(thisYear ? {} : { year: 'numeric' }) });
  };
}

/** French typography: no-break space before ! ? ; : » and after «. */
const frenchSpaces = (s: string) => s.replace(/ ([!?;:»])/g, ' $1').replace(/« /g, '« ');

/** A piece of story text, with *words between stars* in italics. */
function Inline({ text, lang }: { text: string; lang: Lang }) {
  const parts = (lang === 'fr' ? frenchSpaces(text) : text).split(/\*([^*\n]+)\*/g);
  return <>{parts.map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part))}</>;
}

/** The cover (picture 1), or a book icon when the story has no picture. */
function Cover({ story, className, alt = '' }: { story: Story; className: string; alt?: string }) {
  return story.pictures[1] ? (
    <img src={story.pictures[1]} className={className} alt={alt} loading="lazy" />
  ) : (
    <span className={`${className} story-placeholder`} aria-hidden>
      📖
    </span>
  );
}

/** Language the stories are read in (only the stories: the interface keeps its language). */
function LangSwitch({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  const { t } = useTranslation();
  return (
    <span className="lang-switch" role="group" aria-label={t('stories.readIn')} title={t('stories.readIn')}>
      {LANGS.map((l) => (
        <button key={l} className={l === lang ? 'on' : ''} aria-pressed={l === lang} onClick={() => onChange(l)}>
          {l.toUpperCase()}
        </button>
      ))}
    </span>
  );
}

export function Stories({ path }: { path: string }) {
  const { t } = useTranslation();
  const appLocale = useLocale();
  const [lang, setLang] = useState<Lang>(appLocale); // starts in the interface language
  const [tellings, setTellings] = useState<Telling[] | null>(null); // null while loading
  const [loadError, setLoadError] = useState('');
  const [filters, setFilters] = useState<Filters>({ minutes: 0, style: '', theme: '' });
  const storyId = path.split('/')[2];

  useEffect(() => {
    fetch('/api/stories')
      .then(async (res) => {
        if (!res.ok) throw new Error(String(res.status));
        setTellings((await res.json()) as Telling[]);
      })
      .catch((e: Error) => {
        setLoadError(e.message);
        setTellings([]);
      });
  }, []);

  // Start each page at the top. (Braces matter: recent browsers make scrollTo return a promise,
  // and an effect must return nothing or a clean-up function.)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [storyId]);

  const add = async (telling: NewTelling) => {
    const res = await fetch('/api/stories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(telling) });
    if (!res.ok) throw new Error(String(res.status));
    const saved = (await res.json()) as Telling;
    setTellings((list) => [saved, ...(list ?? [])]);
  };

  const remove = async (telling: Telling) => {
    const res = await fetch(`/api/stories?id=${encodeURIComponent(telling.id)}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(String(res.status));
    setTellings((list) => (list ?? []).filter((x) => x.id !== telling.id));
  };

  const story = storyId ? STORIES.find((s) => s.id === storyId) : undefined;

  return (
    <>
      <header className="topbar">
        {storyId ? (
          <a href="#/stories" className="icon-btn" aria-label={t('stories.back')} title={t('stories.back')}>
            ‹
          </a>
        ) : (
          <a href="#/" className="icon-btn" aria-label={t('hub.title')}>
            ⌂
          </a>
        )}
        <span className="brand">{t('hub.stories.name')}</span>
        <LangSwitch lang={lang} onChange={setLang} />
      </header>
      <main className="page narrow">
        {loadError && <p className="callout serious">{t('stories.loadError', { message: loadError })}</p>}
        {!storyId ? (
          <StoryList lang={lang} tellings={tellings} filters={filters} setFilters={setFilters} />
        ) : story ? (
          <StoryPage key={story.id} story={story} lang={lang} tellings={tellings} onAdd={add} onRemove={remove} />
        ) : (
          <p>
            {t('stories.notFound')} <a href="#/stories">{t('stories.back')}</a>
          </p>
        )}
      </main>
    </>
  );
}

function StoryList({ lang, tellings, filters, setFilters }: { lang: Lang; tellings: Telling[] | null; filters: Filters; setFilters: (f: Filters) => void }) {
  const { t } = useTranslation();
  const formatDay = useFormatDay();
  const latest = useMemo(() => latestByStory(tellings ?? []), [tellings]);
  const counts = useMemo(() => {
    const c = new Map<string, number>();
    for (const x of tellings ?? []) c.set(x.storyId, (c.get(x.storyId) ?? 0) + 1);
    return c;
  }, [tellings]);

  const styles = STYLES.filter((s) => STORIES.some((x) => x.style === s));
  const themes = THEMES.filter((s) => STORIES.some((x) => x.theme === s));
  const shown = STORIES.filter(
    (s) => (!filters.minutes || s.minutes === filters.minutes) && (!filters.style || s.style === filters.style) && (!filters.theme || s.theme === filters.theme),
  ).sort((a, b) => storyText(a, lang).title.localeCompare(storyText(b, lang).title, lang));

  return (
    <>
      <div className="chips" role="group" aria-label={t('stories.length')}>
        {[0, ...LENGTHS].map((m) => (
          <button key={m} className={filters.minutes === m ? 'chip on' : 'chip'} aria-pressed={filters.minutes === m} onClick={() => setFilters({ ...filters, minutes: m })}>
            {m ? t('stories.minutes', { count: m }) : t('stories.anyLength')}
          </button>
        ))}
      </div>
      <div className="filters">
        <select className="input" value={filters.style} onChange={(e) => setFilters({ ...filters, style: e.target.value })} aria-label={t('stories.style')}>
          <option value="">{t('stories.anyStyle')}</option>
          {styles.map((s) => (
            <option key={s} value={s}>
              {t(`stories.styles.${s}`)}
            </option>
          ))}
        </select>
        <select className="input" value={filters.theme} onChange={(e) => setFilters({ ...filters, theme: e.target.value })} aria-label={t('stories.theme')}>
          <option value="">{t('stories.anyTheme')}</option>
          {themes.map((s) => (
            <option key={s} value={s}>
              {t(`stories.themes.${s}`)}
            </option>
          ))}
        </select>
      </div>

      {shown.length === 0 && <p className="muted center">{t('stories.none')}</p>}
      {LENGTHS.map((m) => {
        const group = shown.filter((s) => s.minutes === m);
        if (!group.length) return null;
        return (
          <section key={m}>
            <h2>⏱ {t('stories.lengthHeading', { count: m })}</h2>
            <div className="cards">
              {group.map((s) => {
                const last = latest.get(s.id);
                return (
                  <a key={s.id} href={`#/stories/${s.id}`} className="story-row">
                    <Cover story={s} className="story-thumb" />
                    <span className="story-row-main">
                      <span className="story-name">{storyText(s, lang).title}</span>
                      <span className="muted small">{authorName(s, lang)}</span>
                      <span className="row story-tags">
                        <span className="badge tone-neutral">{t(`stories.styles.${s.style}`)}</span>
                        <span className="badge tone-neutral">{t(`stories.themes.${s.theme}`)}</span>
                      </span>
                      {tellings === null ? null : last ? (
                        <span className="small">
                          {EMOJI[last.reaction]} {t(`stories.reactions.${last.reaction}`)} · {formatDay(last.date)} · {t('stories.told', { count: counts.get(s.id) ?? 0 })}
                        </span>
                      ) : (
                        <span className="small muted">{t('stories.notTold')}</span>
                      )}
                    </span>
                  </a>
                );
              })}
            </div>
          </section>
        );
      })}

      <Taste latest={latest} />
    </>
  );
}

/** What Constance likes, by style and by theme, from her latest reaction to each story. */
function Taste({ latest }: { latest: Map<string, Telling> }) {
  const { t } = useTranslation();
  const told = STORIES.some((s) => latest.has(s.id));
  return (
    <section className="card">
      <h2>{t('stories.taste.title')}</h2>
      {!told ? (
        <p className="muted">{t('stories.taste.empty')}</p>
      ) : (
        <>
          <p className="muted small">{t('stories.taste.help')}</p>
          {(['style', 'theme'] as const).map((key) => {
            const { rows, untried } = tasteBy(STORIES, latest, key);
            const name = (k: string) => t(`stories.${key === 'style' ? 'styles' : 'themes'}.${k}`);
            return (
              <div key={key}>
                <h3>{t(key === 'style' ? 'stories.taste.byStyle' : 'stories.taste.byTheme')}</h3>
                <ul className="taste">
                  {rows.map((r) => (
                    <li key={r.key}>
                      <span>{name(r.key)}</span>
                      <span className="taste-faces" aria-label={r.reactions.map((x) => t(`stories.reactions.${x}`)).join(', ')}>
                        {r.reactions.map((x) => EMOJI[x]).join(' ')}
                      </span>
                    </li>
                  ))}
                </ul>
                {untried.length > 0 && <p className="muted small">{t('stories.taste.untried', { list: untried.map(name).join(', ') })}</p>}
              </div>
            );
          })}
        </>
      )}
    </section>
  );
}

function StoryPage({
  story,
  lang,
  tellings,
  onAdd,
  onRemove,
}: {
  story: Story;
  lang: Lang;
  tellings: Telling[] | null;
  onAdd: (t: NewTelling) => Promise<void>;
  onRemove: (t: Telling) => Promise<void>;
}) {
  const { t } = useTranslation();
  const formatDay = useFormatDay();
  const [date, setDate] = useState(localToday);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null);
  const text = storyText(story, lang);
  const cover = text.blocks.find((b): b is Extract<Block, { kind: 'picture' }> => b.kind === 'picture' && b.n === 1);
  const coverAlt = cover?.alt || text.title;
  const history = (tellings ?? []).filter((x) => x.storyId === story.id).sort(newestFirst);

  const react = async (reaction: Reaction) => {
    setBusy(true);
    setNote(null);
    try {
      await onAdd({ storyId: story.id, date: date || localToday(), reaction, lang });
      setNote({ ok: true, text: t('stories.saved') });
    } catch (e) {
      setNote({ ok: false, text: t('stories.saveError', { message: (e as Error).message }) });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (telling: Telling) => {
    if (!confirm(t('stories.confirmDelete'))) return;
    setNote(null);
    try {
      await onRemove(telling);
    } catch (e) {
      setNote({ ok: false, text: t('stories.deleteError', { message: (e as Error).message }) });
    }
  };

  return (
    <>
      <Cover story={story} className="story-picture" alt={coverAlt} />
      <h1 className="story-heading" lang={lang}>
        {text.title}
      </h1>
      <p className="muted story-meta">
        {authorName(story, lang)} · ⏱ {t('stories.minutes', { count: story.minutes })}
      </p>
      <div className="row">
        <span className="badge tone-neutral">{t(`stories.styles.${story.style}`)}</span>
        <span className="badge tone-neutral">{t(`stories.themes.${story.theme}`)}</span>
      </div>

      {hasText(text) ? (
        <article className="story-text" lang={lang === 'pt' ? 'pt-PT' : lang}>
          {text.blocks.map((b, i) =>
            b.kind === 'text' ? (
              <p key={i}>
                <Inline text={b.text} lang={lang} />
              </p>
            ) : b.n > 1 && story.pictures[b.n] ? (
              // One picture for each minute of the story; the cover (picture 1) is shown above.
              <img key={i} src={story.pictures[b.n]} alt={b.alt} className="story-picture" loading="lazy" />
            ) : null,
          )}
          {text.moral && (
            <p className="story-moral">
              <Inline text={text.moral} lang={lang} />
            </p>
          )}
        </article>
      ) : (
        <p className="muted">{t('stories.noText')}</p>
      )}

      <section className="card stack">
        <h2>{t('stories.howWasIt')}</h2>
        <label className="told-on">
          {t('stories.toldOn')}
          <input type="date" className="input" value={date} max={localToday()} onChange={(e) => setDate(e.target.value)} />
        </label>
        <div className="reactions">
          {REACTIONS.map((r) => (
            <button key={r} className="btn reaction" disabled={busy} onClick={() => void react(r)}>
              <span className="reaction-face" aria-hidden>
                {EMOJI[r]}
              </span>
              {t(`stories.reactions.${r}`)}
            </button>
          ))}
        </div>
        {note && (
          <p className={note.ok ? 'small' : 'callout serious'} role="status">
            {note.text}
          </p>
        )}
      </section>

      <h2>{t('stories.history')}</h2>
      {tellings === null ? (
        <p className="muted">{t('common.loading')}</p>
      ) : history.length === 0 ? (
        <p className="muted">{t('stories.notTold')}</p>
      ) : (
        <div className="cards">
          {history.map((h) => (
            <div key={h.id} className="doc-row">
              <span className="doc-main">
                <span>
                  {EMOJI[h.reaction]} {t(`stories.reactions.${h.reaction}`)}
                </span>
                <span className="muted small">
                  {formatDay(h.date)} · {t(`lang.${h.lang}`)}
                </span>
              </span>
              <button className="icon-btn" onClick={() => void remove(h)} aria-label={t('common.delete')} title={t('common.delete')}>
                🗑
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
