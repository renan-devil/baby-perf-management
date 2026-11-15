// Reading aloud with the device's own voice (the browser's Web Speech API): free, works on phones,
// and nothing is sent anywhere. Used by the memory game and by the "Listen" button of the stories.

import type { Lang } from '../api/_stories';

const SPEECH_LANG: Record<Lang, string> = { fr: 'fr-FR', en: 'en-GB', pt: 'pt-PT' };

/** True when this browser can speak. */
export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

/** Best installed voice for the language: the exact variant (pt-PT, not pt-BR) when there is one. */
function pickVoice(lang: Lang): SpeechSynthesisVoice | undefined {
  const voices = speechSynthesis.getVoices();
  const wanted = SPEECH_LANG[lang].toLowerCase();
  const norm = (v: SpeechSynthesisVoice) => v.lang.replace('_', '-').toLowerCase();
  return voices.find((v) => norm(v) === wanted) ?? (lang === 'pt' ? undefined : voices.find((v) => norm(v).startsWith(lang)));
}

// Some browsers forget an utterance that nothing points to, and then never say it has ended:
// keep the ones still to be said here until they end.
const pending = new Set<SpeechSynthesisUtterance>();

/**
 * Says the text aloud, a little slowly, for a child. By default it interrupts whatever was being
 * said; with after = true it waits its turn. onEnd runs when it has finished or was interrupted.
 * Does nothing where speech is missing.
 */
export function speak(text: string, lang: Lang, { after = false, onEnd }: { after?: boolean; onEnd?: () => void } = {}) {
  if (!canSpeak()) return;
  if (!after) speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = SPEECH_LANG[lang];
  const voice = pickVoice(lang);
  if (voice) u.voice = voice;
  u.rate = 0.9;
  const end = () => {
    pending.delete(u);
    onEnd?.();
  };
  u.onend = end;
  u.onerror = end;
  pending.add(u);
  speechSynthesis.speak(u);
}

/** Stops speaking at once. */
export function stopSpeaking() {
  pending.clear();
  if (canSpeak()) speechSynthesis.cancel();
}
