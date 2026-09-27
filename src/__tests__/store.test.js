import { describe, it, expect, beforeEach } from 'vitest';
import { useMelodexStore } from '@/store/melodexStore';

// Helper: reset the store to initial state between tests
const resetStore = () => {
  useMelodexStore.setState({
    melodyNotes: [],
    inputMode: 'text',
    selectedKey: 'C',
    selectedMode: 'major',
    harmonizationType: 'thirds-up',
    harmonyNotes: null,
    resultsViewTab: 'table',
    isPlaying: false,
    playbackMode: null,
    isDarkMode: true,
  });
};

describe('melodexStore', () => {
  beforeEach(resetStore);

  // ─────────────────────────────────────────────
  // Initial state
  // ─────────────────────────────────────────────
  describe('initial state', () => {
    it('melodyNotes is empty array', () => {
      expect(useMelodexStore.getState().melodyNotes).toEqual([]);
    });

    it('inputMode is text', () => {
      expect(useMelodexStore.getState().inputMode).toBe('text');
    });

    it('selectedKey is C', () => {
      expect(useMelodexStore.getState().selectedKey).toBe('C');
    });

    it('selectedMode is major', () => {
      expect(useMelodexStore.getState().selectedMode).toBe('major');
    });

    it('harmonizationType is thirds-up', () => {
      expect(useMelodexStore.getState().harmonizationType).toBe('thirds-up');
    });

    it('harmonyNotes is null', () => {
      expect(useMelodexStore.getState().harmonyNotes).toBeNull();
    });

    it('isDarkMode is true (dark by default)', () => {
      expect(useMelodexStore.getState().isDarkMode).toBe(true);
    });

    it('isPlaying is false', () => {
      expect(useMelodexStore.getState().isPlaying).toBe(false);
    });

    it('playbackMode is null', () => {
      expect(useMelodexStore.getState().playbackMode).toBeNull();
    });

    it('resultsViewTab is table', () => {
      expect(useMelodexStore.getState().resultsViewTab).toBe('table');
    });
  });

  // ─────────────────────────────────────────────
  // addNote
  // ─────────────────────────────────────────────
  describe('addNote', () => {
    it('appends a note to melodyNotes', () => {
      useMelodexStore.getState().addNote('C');
      expect(useMelodexStore.getState().melodyNotes).toEqual(['C']);
    });

    it('appends multiple notes in order', () => {
      useMelodexStore.getState().addNote('C');
      useMelodexStore.getState().addNote('E');
      useMelodexStore.getState().addNote('G');
      expect(useMelodexStore.getState().melodyNotes).toEqual(['C', 'E', 'G']);
    });

    it('resets harmonyNotes to null on add (key invariant)', () => {
      // Pre-set harmonyNotes to simulate existing result
      useMelodexStore.setState({ harmonyNotes: ['E', 'G'] });
      useMelodexStore.getState().addNote('C');
      expect(useMelodexStore.getState().harmonyNotes).toBeNull();
    });
  });

  // ─────────────────────────────────────────────
  // removeNote
  // ─────────────────────────────────────────────
  describe('removeNote', () => {
    it('removes note at given index', () => {
      useMelodexStore.setState({ melodyNotes: ['C', 'D', 'E'] });
      useMelodexStore.getState().removeNote(1); // remove D
      expect(useMelodexStore.getState().melodyNotes).toEqual(['C', 'E']);
    });

    it('resets harmonyNotes to null on remove (key invariant)', () => {
      useMelodexStore.setState({ melodyNotes: ['C', 'D'], harmonyNotes: ['E', 'F'] });
      useMelodexStore.getState().removeNote(0);
      expect(useMelodexStore.getState().harmonyNotes).toBeNull();
    });
  });

  // ─────────────────────────────────────────────
  // removeLastNote
  // ─────────────────────────────────────────────
  describe('removeLastNote', () => {
    it('removes the last note', () => {
      useMelodexStore.setState({ melodyNotes: ['C', 'D', 'E'] });
      useMelodexStore.getState().removeLastNote();
      expect(useMelodexStore.getState().melodyNotes).toEqual(['C', 'D']);
    });

    it('does nothing when melody is empty (slice(0,-1) = [])', () => {
      useMelodexStore.setState({ melodyNotes: [] });
      useMelodexStore.getState().removeLastNote();
      expect(useMelodexStore.getState().melodyNotes).toEqual([]);
    });

    it('resets harmonyNotes to null (key invariant)', () => {
      useMelodexStore.setState({ melodyNotes: ['C', 'D'], harmonyNotes: ['E', 'F'] });
      useMelodexStore.getState().removeLastNote();
      expect(useMelodexStore.getState().harmonyNotes).toBeNull();
    });
  });

  // ─────────────────────────────────────────────
  // clearMelody
  // ─────────────────────────────────────────────
  describe('clearMelody', () => {
    it('empties melodyNotes', () => {
      useMelodexStore.setState({ melodyNotes: ['C', 'D', 'E'] });
      useMelodexStore.getState().clearMelody();
      expect(useMelodexStore.getState().melodyNotes).toEqual([]);
    });

    it('resets harmonyNotes to null', () => {
      useMelodexStore.setState({ melodyNotes: ['C'], harmonyNotes: ['E'] });
      useMelodexStore.getState().clearMelody();
      expect(useMelodexStore.getState().harmonyNotes).toBeNull();
    });
  });

  // ─────────────────────────────────────────────
  // setInputMode
  // ─────────────────────────────────────────────
  describe('setInputMode', () => {
    it('switches to piano mode', () => {
      useMelodexStore.getState().setInputMode('piano');
      expect(useMelodexStore.getState().inputMode).toBe('piano');
    });

    it('switches back to text mode', () => {
      useMelodexStore.setState({ inputMode: 'piano' });
      useMelodexStore.getState().setInputMode('text');
      expect(useMelodexStore.getState().inputMode).toBe('text');
    });

    it('does NOT clear melodyNotes on mode switch', () => {
      useMelodexStore.setState({ melodyNotes: ['C', 'D'] });
      useMelodexStore.getState().setInputMode('piano');
      expect(useMelodexStore.getState().melodyNotes).toEqual(['C', 'D']);
    });
  });

  // ─────────────────────────────────────────────
  // setSelectedKey
  // ─────────────────────────────────────────────
  describe('setSelectedKey', () => {
    it('updates selectedKey and selectedMode', () => {
      useMelodexStore.getState().setSelectedKey('G', 'major');
      const state = useMelodexStore.getState();
      expect(state.selectedKey).toBe('G');
      expect(state.selectedMode).toBe('major');
    });

    it('resets harmonyNotes to null (key invariant)', () => {
      useMelodexStore.setState({ harmonyNotes: ['E', 'G'] });
      useMelodexStore.getState().setSelectedKey('G', 'major');
      expect(useMelodexStore.getState().harmonyNotes).toBeNull();
    });
  });

  // ─────────────────────────────────────────────
  // setHarmonizationType
  // ─────────────────────────────────────────────
  describe('setHarmonizationType', () => {
    it('updates harmonizationType', () => {
      useMelodexStore.getState().setHarmonizationType('fifths');
      expect(useMelodexStore.getState().harmonizationType).toBe('fifths');
    });

    it('resets harmonyNotes to null (key invariant)', () => {
      useMelodexStore.setState({ harmonyNotes: ['G'] });
      useMelodexStore.getState().setHarmonizationType('fifths');
      expect(useMelodexStore.getState().harmonyNotes).toBeNull();
    });
  });

  // ─────────────────────────────────────────────
  // harmonize action
  // ─────────────────────────────────────────────
  describe('harmonize action', () => {
    it('sets harmonyNotes to computed result', () => {
      useMelodexStore.setState({
        melodyNotes: ['C', 'D', 'E', 'F'],
        selectedKey: 'C',
        selectedMode: 'major',
        harmonizationType: 'thirds-up',
      });
      useMelodexStore.getState().harmonize();
      expect(useMelodexStore.getState().harmonyNotes).toEqual(['E', 'F', 'G', 'A']);
    });

    it('does nothing when melody is empty (guard)', () => {
      useMelodexStore.setState({ melodyNotes: [], harmonyNotes: null });
      useMelodexStore.getState().harmonize();
      expect(useMelodexStore.getState().harmonyNotes).toBeNull();
    });

    it('works with A minor thirds-up', () => {
      useMelodexStore.setState({
        melodyNotes: ['A', 'B', 'C'],
        selectedKey: 'A',
        selectedMode: 'minor',
        harmonizationType: 'thirds-up',
      });
      useMelodexStore.getState().harmonize();
      expect(useMelodexStore.getState().harmonyNotes).toEqual(['C', 'D', 'E']);
    });
  });

  // ─────────────────────────────────────────────
  // setResultsViewTab
  // ─────────────────────────────────────────────
  describe('setResultsViewTab', () => {
    it('switches to roll tab', () => {
      useMelodexStore.getState().setResultsViewTab('roll');
      expect(useMelodexStore.getState().resultsViewTab).toBe('roll');
    });

    it('switches back to table tab', () => {
      useMelodexStore.setState({ resultsViewTab: 'roll' });
      useMelodexStore.getState().setResultsViewTab('table');
      expect(useMelodexStore.getState().resultsViewTab).toBe('table');
    });
  });

  // ─────────────────────────────────────────────
  // setIsPlaying
  // ─────────────────────────────────────────────
  describe('setIsPlaying', () => {
    it('sets isPlaying to true with melody mode', () => {
      useMelodexStore.getState().setIsPlaying(true, 'melody');
      const state = useMelodexStore.getState();
      expect(state.isPlaying).toBe(true);
      expect(state.playbackMode).toBe('melody');
    });

    it('sets isPlaying to false and clears mode', () => {
      useMelodexStore.setState({ isPlaying: true, playbackMode: 'both' });
      useMelodexStore.getState().setIsPlaying(false);
      const state = useMelodexStore.getState();
      expect(state.isPlaying).toBe(false);
      expect(state.playbackMode).toBeNull();
    });
  });

  // ─────────────────────────────────────────────
  // toggleDarkMode
  // ─────────────────────────────────────────────
  describe('toggleDarkMode', () => {
    it('flips isDarkMode from true to false', () => {
      useMelodexStore.setState({ isDarkMode: true });
      useMelodexStore.getState().toggleDarkMode();
      expect(useMelodexStore.getState().isDarkMode).toBe(false);
    });

    it('flips isDarkMode from false to true', () => {
      useMelodexStore.setState({ isDarkMode: false });
      useMelodexStore.getState().toggleDarkMode();
      expect(useMelodexStore.getState().isDarkMode).toBe(true);
    });
  });
});
