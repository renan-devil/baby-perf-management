// Memory game for Constance to play on her own (#/memory). Made to need no reading: she picks a
// game size by its picture, turns cards over two at a time, and a voice names each story whose
// pair she finds. No score, no timer, no way to lose. Rules: src/memory/game.ts.

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGS, type Lang } from '../../api/_stories';
import i18n, { useLocale } from '../i18n';
import { deal, flip, hide, isWon, LEVELS, type Game, type Level } from '../memory/game';
import { chimeMatch, chimeWin } from '../memory/sound';
import { speak, stopSpeaking } from '../speech';
import { STORIES, storyText } from '../stories/catalog';

/** Stories that have a cover, which is what the cards show. */
const DECK = STORIES.filter((s) => s.pictures[1]);
const BY_ID = new Map(DECK.map((s) => [s.id, s]));

/** Cards per row for each game size, so the cards stay big on a phone. */
const COLUMNS: Record<Level, number> = { 3: 2, 4: 2, 6: 3 };

/** How long two different cards stay visible before turning back, in milliseconds. */
const SHOW_MISS_MS = 1400;

export function Memory() {
  const { t } = useTranslation();
  const appLocale = useLocale();
  const [lang, setLang] = useState<Lang>(appLocale); // language of the voice
  const [level, setLevel] = useState<Level | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const timer = useRef<number | undefined>(undefined);

  // Stop the timer and the voice when leaving the game.
  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      stopSpeaking();
    },
    [],
  );

  const say = useMemo(() => i18n.getFixedT(lang), [lang]);
  const title = (storyId: string) => {
    const story = BY_ID.get(storyId);
    return story ? storyText(story, lang).title : '';
  };

  const start = (pairs: Level) => {
    window.clearTimeout(timer.current);
    setLevel(pairs);
    setGame(
      deal(
        DECK.map((s) => s.id),
        pairs,
      ),
    );
    speak(say('memory.say.start'), lang);
  };

  const tap = (i: number) => {
    if (!game) return;
    const card = game.cards[i];
    if (card.found) {
      speak(title(card.storyId), lang); // tap a found pair to hear its name again
      return;
    }
    const { game: next, result } = flip(game, i);
    if (result === 'ignored') return;
    setGame(next);
    if (result === 'match') {
      chimeMatch();
      speak(title(card.storyId), lang);
      if (isWon(next)) {
        window.setTimeout(chimeWin, 900);
        speak(say('memory.say.won'), lang, { after: true });
      }
    } else if (result === 'miss') {
      timer.current = window.setTimeout(() => setGame((g) => (g ? hide(g) : g)), SHOW_MISS_MS);
    }
  };

  const won = game !== null && isWon(game);

  return (
    <>
      <header className="topbar">
        {game ? (
          <button className="icon-btn" onClick={() => setGame(null)} aria-label={t('memory.levels')} title={t('memory.levels')}>
            ‹
          </button>
        ) : (
          <a href="#/" className="icon-btn" aria-label={t('hub.title')}>
            ⌂
          </a>
        )}
        <span className="brand">{t('hub.memory.name')}</span>
        <span className="lang-switch" role="group" aria-label={t('memory.voice')} title={t('memory.voice')}>
          {LANGS.map((l) => (
            <button key={l} className={l === lang ? 'on' : ''} aria-pressed={l === lang} onClick={() => setLang(l)}>
              {l.toUpperCase()}
            </button>
          ))}
        </span>
      </header>
      <main className="page memory">
        {!game || !level ? (
          <>
            <p className="memory-hint muted">{t('memory.hint')}</p>
            <div className="memory-levels">
              {LEVELS.map((pairs) => (
                <button key={pairs} className="memory-level" onClick={() => start(pairs)} aria-label={t('memory.pairs', { count: pairs })}>
                  <span className="memory-mini" style={{ gridTemplateColumns: `repeat(${COLUMNS[pairs]}, 1fr)` }} aria-hidden>
                    {Array.from({ length: pairs * 2 }, (_, k) => (
                      <span key={k} />
                    ))}
                  </span>
                  <span className="memory-stars" aria-hidden>
                    {'★'.repeat(LEVELS.indexOf(pairs) + 1)}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="memory-grid" style={{ gridTemplateColumns: `repeat(${COLUMNS[level]}, 1fr)` }}>
              {game.cards.map((card, i) => {
                const story = BY_ID.get(card.storyId);
                return (
                  <button
                    key={i}
                    className={`memory-card${card.up ? ' up' : ''}${card.found ? ' found' : ''}`}
                    onClick={() => tap(i)}
                    aria-label={card.up ? title(card.storyId) : t('memory.hidden')}
                  >
                    <span className="memory-inner">
                      <span className="memory-back" aria-hidden>
                        ★
                      </span>
                      <span className="memory-face">{story && <img src={story.pictures[1]} alt="" draggable={false} />}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            {won && (
              <div className="memory-won">
                <span className="memory-party" aria-hidden>
                  🎉
                </span>
                <button className="memory-again" onClick={() => start(level)} aria-label={t('memory.again')} title={t('memory.again')}>
                  🔁
                </button>
                <button className="memory-again small" onClick={() => setGame(null)} aria-label={t('memory.levels')} title={t('memory.levels')}>
                  ★
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
