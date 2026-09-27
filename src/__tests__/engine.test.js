import { describe, it, expect } from 'vitest';
import {
  CHROMATIC_NOTES,
  noteToPC,
  pcToNote,
  isValidNote,
} from '@/engine/pitchClasses';
import { SCALE_PATTERNS, generateScale, getScaleDegree } from '@/engine/scales';
import { HARMONIZATION_TYPES, harmonize } from '@/engine/harmonize';

// ─────────────────────────────────────────────────────────
// pitchClasses.js
// ─────────────────────────────────────────────────────────
describe('pitchClasses', () => {
  describe('CHROMATIC_NOTES', () => {
    it('has 12 entries', () => {
      expect(CHROMATIC_NOTES).toHaveLength(12);
    });

    it('starts with C and ends with B', () => {
      expect(CHROMATIC_NOTES[0]).toBe('C');
      expect(CHROMATIC_NOTES[11]).toBe('B');
    });
  });

  describe('noteToPC', () => {
    it('maps C to 0', () => {
      expect(noteToPC('C')).toBe(0);
    });

    it('maps F# to 6', () => {
      expect(noteToPC('F#')).toBe(6);
    });

    it('maps flat alias Db to 1 (enharmonic C#)', () => {
      expect(noteToPC('Db')).toBe(1);
    });

    it('maps Eb to 3 (enharmonic D#)', () => {
      expect(noteToPC('Eb')).toBe(3);
    });

    it('maps Bb to 10 (enharmonic A#)', () => {
      expect(noteToPC('Bb')).toBe(10);
    });

    it('returns null for unknown note X', () => {
      expect(noteToPC('X')).toBe(null);
    });

    it('returns null for lowercase c (case-sensitive)', () => {
      expect(noteToPC('c')).toBe(null);
    });
  });

  describe('pcToNote', () => {
    it('converts pitch class 0 to C', () => {
      expect(pcToNote(0)).toBe('C');
    });

    it('converts pitch class 6 to F# (sharp preference)', () => {
      expect(pcToNote(6)).toBe('F#');
    });

    it('handles out-of-bounds by wrapping (pc=12 → C)', () => {
      expect(pcToNote(12)).toBe('C');
    });

    it('handles negative pc by wrapping (pc=-1 → B)', () => {
      expect(pcToNote(-1)).toBe('B');
    });
  });

  describe('isValidNote', () => {
    it('returns true for A#', () => {
      expect(isValidNote('A#')).toBe(true);
    });

    it('returns true for flat alias Ab', () => {
      expect(isValidNote('Ab')).toBe(true);
    });

    it('returns false for H (not a note)', () => {
      expect(isValidNote('H')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isValidNote('')).toBe(false);
    });

    it('returns false for lowercase c', () => {
      expect(isValidNote('c')).toBe(false);
    });
  });
});

// ─────────────────────────────────────────────────────────
// scales.js
// ─────────────────────────────────────────────────────────
describe('scales', () => {
  describe('SCALE_PATTERNS', () => {
    it('major pattern has 7 intervals summing to 12', () => {
      const sum = SCALE_PATTERNS.major.reduce((a, b) => a + b, 0);
      expect(sum).toBe(12);
    });

    it('minor pattern has 7 intervals summing to 12', () => {
      const sum = SCALE_PATTERNS.minor.reduce((a, b) => a + b, 0);
      expect(sum).toBe(12);
    });
  });

  describe('generateScale', () => {
    it('generates C major scale correctly', () => {
      expect(generateScale('C', 'major')).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
    });

    it('generates A minor scale correctly', () => {
      expect(generateScale('A', 'minor')).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
    });

    it('generates G major scale correctly', () => {
      expect(generateScale('G', 'major')).toEqual(['G', 'A', 'B', 'C', 'D', 'E', 'F#']);
    });

    it('generates D minor scale correctly', () => {
      expect(generateScale('D', 'minor')).toEqual(['D', 'E', 'F', 'G', 'A', 'A#', 'C']);
    });

    it('returns 7 notes for any key', () => {
      expect(generateScale('F#', 'major')).toHaveLength(7);
    });
  });

  describe('getScaleDegree', () => {
    it('returns 2 for E in C major (degree 2)', () => {
      const scale = generateScale('C', 'major');
      expect(getScaleDegree(noteToPC('E'), scale)).toBe(2);
    });

    it('returns 0 for root note C in C major', () => {
      const scale = generateScale('C', 'major');
      expect(getScaleDegree(noteToPC('C'), scale)).toBe(0);
    });

    it('returns 6 for B (last degree) in C major', () => {
      const scale = generateScale('C', 'major');
      expect(getScaleDegree(noteToPC('B'), scale)).toBe(6);
    });

    it('returns -1 for chromatic note C# (not in C major)', () => {
      const scale = generateScale('C', 'major');
      expect(getScaleDegree(noteToPC('C#'), scale)).toBe(-1);
    });
  });
});

// ─────────────────────────────────────────────────────────
// harmonize.js
// ─────────────────────────────────────────────────────────
describe('harmonize', () => {
  describe('HARMONIZATION_TYPES', () => {
    it('has exactly 5 harmonization types', () => {
      expect(Object.keys(HARMONIZATION_TYPES)).toHaveLength(5);
    });

    it('thirds-up has offset +2', () => {
      expect(HARMONIZATION_TYPES['thirds-up'].offset).toBe(2);
    });

    it('thirds-down has offset -2', () => {
      expect(HARMONIZATION_TYPES['thirds-down'].offset).toBe(-2);
    });
  });

  describe('harmonize() — diatonic intervals', () => {
    it('harmonizes C D E F in C major thirds-up to E F G A', () => {
      expect(harmonize(['C', 'D', 'E', 'F'], 'C', 'major', 'thirds-up')).toEqual([
        'E',
        'F',
        'G',
        'A',
      ]);
    });

    it('harmonizes B in C major thirds-up wraps to D (degree 6 + 2 = 8 mod 7 = 1)', () => {
      expect(harmonize(['B'], 'C', 'major', 'thirds-up')).toEqual(['D']);
    });

    it('harmonizes C D E F in C major thirds-down to A G F E', () => {
      expect(harmonize(['C', 'D', 'E', 'F'], 'C', 'major', 'thirds-down')).toEqual([
        'A',
        'B',
        'C',
        'D',
      ]);
    });

    it('harmonizes C in C major fifths to G (degree 0 + 4 = 4)', () => {
      expect(harmonize(['C'], 'C', 'major', 'fifths')).toEqual(['G']);
    });

    it('harmonizes C in C major sixths-up to A (degree 0 + 5 = 5)', () => {
      expect(harmonize(['C'], 'C', 'major', 'sixths-up')).toEqual(['A']);
    });

    it('harmonizes C in C major sixths-down to E (degree 0 - 5 = -5 mod 7 = 2)', () => {
      expect(harmonize(['C'], 'C', 'major', 'sixths-down')).toEqual(['E']);
    });
  });

  describe('harmonize() — chromatic note passthrough', () => {
    it('passes through chromatic note C# unchanged in C major thirds-up', () => {
      expect(harmonize(['C#'], 'C', 'major', 'thirds-up')).toEqual(['C#']);
    });

    it('passes through chromatic note F# unchanged in C major fifths', () => {
      expect(harmonize(['F#'], 'C', 'major', 'fifths')).toEqual(['F#']);
    });
  });

  describe('harmonize() — minor key', () => {
    it('harmonizes A B C in A minor thirds-up to C D E', () => {
      expect(harmonize(['A', 'B', 'C'], 'A', 'minor', 'thirds-up')).toEqual(['C', 'D', 'E']);
    });
  });

  describe('harmonize() — output length', () => {
    it('output has same length as input', () => {
      const melody = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
      const result = harmonize(melody, 'C', 'major', 'thirds-up');
      expect(result).toHaveLength(7);
    });
  });

  describe('harmonize() — error handling', () => {
    it('throws for unknown harmonization type', () => {
      expect(() => harmonize(['C'], 'C', 'major', 'invalid')).toThrow(
        'Unknown harmonization type: invalid',
      );
    });
  });
});
