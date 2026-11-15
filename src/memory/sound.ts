// Voice and little tunes for the memory game, made by the device itself: no recordings to store.
// The spoken voice is the phone's or computer's own (Web Speech API). Browsers only allow sound
// after a tap, which is always the case here.

import type { Lang } from '../../api/_stories';

const SPEECH_LANG: Record<Lang, string> = { fr: 'fr-FR', en: 'en-GB', pt: 'pt-PT' };

/** Best installed voice for the language: the exact variant (pt-PT, not pt-BR) when there is one. */
function pickVoice(lang: Lang): SpeechSynthesisVoice | undefined {
  const voices = speechSynthesis.getVoices();
  const wanted = SPEECH_LANG[lang].toLowerCase();
  const norm = (v: SpeechSynthesisVoice) => v.lang.replace('_', '-').toLowerCase();
  return voices.find((v) => norm(v) === wanted) ?? (lang === 'pt' ? undefined : voices.find((v) => norm(v).startsWith(lang)));
}

/**
 * Says the text aloud. By default it interrupts whatever was being said; with after = true it waits
 * its turn. Does nothing where speech is missing.
 */
export function speak(text: string, lang: Lang, after = false) {
  if (typeof speechSynthesis === 'undefined') return;
  if (!after) speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = SPEECH_LANG[lang];
  const voice = pickVoice(lang);
  if (voice) u.voice = voice;
  u.rate = 0.9; // a little slower, for a child
  speechSynthesis.speak(u);
}

let audio: AudioContext | undefined;

/** Plays a few soft notes (frequencies in Hz), one after the other. */
function notes(freqs: number[], step = 0.12) {
  try {
    audio ??= new AudioContext();
    const start = audio.currentTime + 0.02;
    freqs.forEach((f, i) => {
      const osc = audio!.createOscillator();
      const gain = audio!.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      const t = start + i * step;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + step * 2.5);
      osc.connect(gain).connect(audio!.destination);
      osc.start(t);
      osc.stop(t + step * 2.6);
    });
  } catch {
    /* no sound on this device */
  }
}

/** A pair was found: C, E, G. */
export const chimeMatch = () => notes([523, 659, 784]);

/** All pairs found: a little climbing tune. */
export const chimeWin = () => notes([523, 587, 659, 784, 1047], 0.15);
