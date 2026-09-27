import * as Tone from 'tone';

const PIANO_OCTAVE = 4; // All notes play in octave 4
const NOTE_DURATION = '8n'; // Eighth note duration per step
const NOTE_STEP_SEC = 0.45; // Seconds between note onsets

let melodySynth = null;
let harmonySynth = null;
let stopTimeout = null;

// Lazy init — called only after a user gesture (button press)
const getMelodySynth = () => {
  if (!melodySynth) {
    melodySynth = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.02, decay: 0.1, sustain: 0.6, release: 0.8 },
    }).toDestination();
  }
  return melodySynth;
};

const getHarmonySynth = () => {
  if (!harmonySynth) {
    harmonySynth = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.02, decay: 0.1, sustain: 0.5, release: 0.8 },
    }).toDestination();
    harmonySynth.volume.value = -6; // softer than melody
  }
  return harmonySynth;
};

/**
 * Stop any current playback by clearing the pending completion timeout.
 */
export const stopPlayback = () => {
  if (stopTimeout) {
    clearTimeout(stopTimeout);
    stopTimeout = null;
  }
};

/**
 * Play a single note immediately (piano tap feedback).
 * @param {string} noteName - Pitch class name e.g. "C", "F#"
 */
export const playNote = async (noteName) => {
  await Tone.start();
  const s = getMelodySynth();
  s.triggerAttackRelease(`${noteName}${PIANO_OCTAVE}`, NOTE_DURATION);
};

/**
 * Play melody only as a timed sequence.
 * @param {string[]} notes - Array of pitch class names
 * @param {() => void} onDone - Callback invoked when playback finishes
 */
export const playMelody = async (notes, onDone) => {
  await Tone.start();
  stopPlayback();
  const s = getMelodySynth();
  const now = Tone.now() + 0.05; // small scheduling buffer
  notes.forEach((note, i) => {
    s.triggerAttackRelease(`${note}${PIANO_OCTAVE}`, NOTE_DURATION, now + i * NOTE_STEP_SEC);
  });
  const totalMs = (notes.length * NOTE_STEP_SEC + 0.5) * 1000;
  stopTimeout = setTimeout(onDone, totalMs);
};

/**
 * Play melody + harmony simultaneously.
 * @param {string[]} melodyNotes - Pitch class names for melody voice
 * @param {string[]} harmonyNotes - Pitch class names for harmony voice
 * @param {() => void} onDone - Callback invoked when playback finishes
 */
export const playBoth = async (melodyNotes, harmonyNotes, onDone) => {
  await Tone.start();
  stopPlayback();
  const ms = getMelodySynth();
  const hs = getHarmonySynth();
  const now = Tone.now() + 0.05;
  melodyNotes.forEach((note, i) => {
    ms.triggerAttackRelease(`${note}${PIANO_OCTAVE}`, NOTE_DURATION, now + i * NOTE_STEP_SEC);
  });
  harmonyNotes.forEach((note, i) => {
    hs.triggerAttackRelease(`${note}${PIANO_OCTAVE}`, NOTE_DURATION, now + i * NOTE_STEP_SEC);
  });
  const totalMs = (melodyNotes.length * NOTE_STEP_SEC + 0.5) * 1000;
  stopTimeout = setTimeout(onDone, totalMs);
};
