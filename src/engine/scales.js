import { noteToPC, pcToNote } from './pitchClasses';

// Interval patterns for supported modes (whole/half steps)
export const SCALE_PATTERNS = {
  major: [2, 2, 1, 2, 2, 2, 1],
  minor: [2, 1, 2, 2, 1, 2, 2],
};

/**
 * Generate an ordered array of 7 note names for a given root + mode.
 * e.g. generateScale("C", "major") → ["C","D","E","F","G","A","B"]
 * @param {string} root - Root note name (e.g. "C", "F#", "Bb")
 * @param {'major'|'minor'} mode
 * @returns {string[]} 7-element array of note names
 */
export const generateScale = (root, mode) => {
  const rootPC = noteToPC(root);
  const pattern = SCALE_PATTERNS[mode];
  const scaleNotes = [pcToNote(rootPC)];
  let current = rootPC;
  for (let i = 0; i < 6; i++) {
    current = (current + pattern[i]) % 12;
    scaleNotes.push(pcToNote(current));
  }
  return scaleNotes;
};

/**
 * Find the scale degree (0-indexed) of a note in a scale.
 * @param {number} notePC - Pitch class (0–11)
 * @param {string[]} scaleNotes - 7-element scale array from generateScale
 * @returns {number} 0–6 if in scale, -1 if not (chromatic)
 */
export const getScaleDegree = (notePC, scaleNotes) => {
  const pcs = scaleNotes.map((n) => noteToPC(n));
  return pcs.indexOf(notePC);
};
