// The "Listen" button of a story: the device reads the story aloud with its own voice (free, no
// recording, nothing sent anywhere). Made for Constance to use on her own: one big ▶ button; while
// it reads, big ⏸ and ⏹ buttons float at the bottom of the screen, and the paragraph being read is
// highlighted and kept in view.

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Lang } from '../../api/_stories';
import i18n from '../i18n';
import { canSpeak, speak, stopSpeaking } from '../speech';
import type { SpokenPart } from './listen';

export type ReaderState = 'idle' | 'playing' | 'paused';

/** Reads the parts one after the other; pause keeps the place, and play goes on from it. */
export function useReader(parts: SpokenPart[], lang: Lang) {
  const [state, setState] = useState<ReaderState>('idle');
  const [index, setIndex] = useState(0); // the part being read, or where reading will go on
  const run = useRef(0); // each reading gets a number; ends from an older reading are ignored

  const stop = useCallback(() => {
    run.current++;
    stopSpeaking();
    setState('idle');
    setIndex(0);
  }, []);

  // Stop when the story or its language changes, and when leaving the page.
  useEffect(() => stop, [parts, lang, stop]);

  const play = () => {
    const token = ++run.current;
    const from = state === 'paused' ? index : 0;
    const go = (k: number) => {
      if (run.current !== token) return;
      if (k >= parts.length) {
        setState('idle');
        setIndex(0);
        return;
      }
      setIndex(k);
      // The first part interrupts anything being said; the next ones simply follow.
      speak(parts[k].text, lang, { after: k > from, onEnd: () => go(k + 1) });
    };
    setState('playing');
    go(from); // must run during the tap: phones only start speech in answer to a tap
  };

  const pause = () => {
    run.current++;
    stopSpeaking();
    setState('paused');
  };

  /** The story block being read (-1: the title), or null when not reading. */
  const block = state === 'idle' ? null : (parts[index]?.block ?? null);
  return { state, block, play, pause, stop };
}

/** The buttons. Their words are in the story's language (lang), like the voice, not the interface's. */
export function ListenControls({ reader, lang }: { reader: ReturnType<typeof useReader>; lang: Lang }) {
  const t = i18n.getFixedT(lang);
  if (!canSpeak()) return null;
  const { state, play, pause, stop } = reader;

  if (state === 'idle')
    return (
      <button className="listen-start" onClick={play}>
        <span className="listen-circle" aria-hidden>
          ▶
        </span>
        <span>{t('stories.listen.start')}</span>
        <span aria-hidden>🔊</span>
      </button>
    );

  return (
    <div className="listen-bar" role="group" aria-label={t('stories.listen.start')}>
      {state === 'playing' ? (
        <button className="listen-round big" onClick={pause} aria-label={t('stories.listen.pause')} title={t('stories.listen.pause')}>
          ⏸
        </button>
      ) : (
        <button className="listen-round big" onClick={play} aria-label={t('stories.listen.resume')} title={t('stories.listen.resume')}>
          ▶
        </button>
      )}
      <button className="listen-round" onClick={stop} aria-label={t('stories.listen.stop')} title={t('stories.listen.stop')}>
        ⏹
      </button>
    </div>
  );
}
