import { noteToPC } from './pitchClasses';
import { generateScale, getScaleDegree } from './scales';

// Interval offsets as scale-degree displacements
export const HARMONIZATION_TYPES = {
  'thirds-up': { offset: 2 },
  'thirds-down': { offset: -2 },
  fifths: { offset: 4 },
  'sixths-up': { offset: 5 },
  'sixths-down': { offset: -5 },
};

/**
 * Harmonize a single note within a scale.
 * Returns the harmony note name, or the original note if chromatic (not in scale).
 * @param {string} note - Melody note name
 * @param {string[]} scaleNotes - 7-element scale array
 * @param {number} offset - Scale degree displacement (positive = up, negative = down)
 * @returns {string} Harmony note name
 */
const harmonizeNote = (note, scaleNotes, offset) => {
  const pc = noteToPC(note);
  const degree = getScaleDegree(pc, scaleNotes);
  if (degree === -1) return note; // chromatic note: return as-is
  const targetDegree = (((degree + offset) % 7) + 7) % 7;
  return scaleNotes[targetDegree];
};

/**
 * Harmonize a full melody sequence using diatonic interval calculation.
 * @param {string[]} melodyNotes - Array of note names
 * @param {string} root - Root note name (e.g. "C")
 * @param {'major'|'minor'} mode
 * @param {string} type - One of the HARMONIZATION_TYPES keys
 * @returns {string[]} Array of harmony notes, same length as melodyNotes
 */
export const harmonize = (melodyNotes, root, mode, type) => {
  const config = HARMONIZATION_TYPES[type];
  if (!config) throw new Error(`Unknown harmonization type: ${type}`);
  const scaleNotes = generateScale(root, mode);
  return melodyNotes.map((note) => harmonizeNote(note, scaleNotes, config.offset));
};
