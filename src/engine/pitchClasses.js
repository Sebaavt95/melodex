// Chromatic pitch class names (sharp preference)
export const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Note name to pitch class (0–11). Accepts both sharps and flats.
export const NOTE_TO_PC = {
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
};

// Convert note name to pitch class. Returns null for unknown notes.
export const noteToPC = (note) => NOTE_TO_PC[note] ?? null;

// Convert pitch class to note name (sharp preference by default).
// Handles out-of-range values by wrapping.
export const pcToNote = (pc) => CHROMATIC_NOTES[((pc % 12) + 12) % 12];

// Check if a string is a valid note name
export const isValidNote = (str) => NOTE_TO_PC[str] !== undefined;
