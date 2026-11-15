// Little tunes for the memory game, made by the device itself: no recordings to store.
// (The voice is in src/speech.ts.) Browsers only allow sound after a tap, which is always the case here.

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
