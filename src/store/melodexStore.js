import { create } from 'zustand';
import { harmonize as engineHarmonize } from '@/engine/harmonize';

export const useMelodexStore = create((set, get) => ({
  // ── Melody Input ──────────────────────────────────────────
  melodyNotes: [], // string[] — committed pitch names: ["C", "D#", "G"]
  inputMode: 'text', // 'text' | 'piano'

  // ── Configuration ─────────────────────────────────────────
  selectedKey: 'C', // string — root note name
  selectedMode: 'major', // 'major' | 'minor'
  harmonizationType: 'thirds-up', // see HARMONIZATION_TYPES

  // ── Results ───────────────────────────────────────────────
  harmonyNotes: null, // string[] | null — null = not yet harmonized
  resultsViewTab: 'table', // 'table' | 'roll'

  // ── Playback ──────────────────────────────────────────────
  isPlaying: false,
  playbackMode: null, // 'melody' | 'both' | null

  // ── Theme ─────────────────────────────────────────────────
  isDarkMode: true, // default dark

  // ── Actions ───────────────────────────────────────────────

  // KEY INVARIANT: any melody/key/type edit resets harmonyNotes to null

  addNote: (note) =>
    set((s) => ({ melodyNotes: [...s.melodyNotes, note], harmonyNotes: null })),

  removeNote: (index) =>
    set((s) => ({
      melodyNotes: s.melodyNotes.filter((_, i) => i !== index),
      harmonyNotes: null,
    })),

  removeLastNote: () =>
    set((s) => ({
      melodyNotes: s.melodyNotes.slice(0, -1),
      harmonyNotes: null,
    })),

  clearMelody: () => set({ melodyNotes: [], harmonyNotes: null }),

  setInputMode: (mode) => set({ inputMode: mode }),

  setSelectedKey: (key, mode) =>
    set({ selectedKey: key, selectedMode: mode, harmonyNotes: null }),

  setHarmonizationType: (type) => set({ harmonizationType: type, harmonyNotes: null }),

  harmonize: () => {
    const { melodyNotes, selectedKey, selectedMode, harmonizationType } = get();
    if (melodyNotes.length === 0) return;
    const result = engineHarmonize(melodyNotes, selectedKey, selectedMode, harmonizationType);
    set({ harmonyNotes: result });
  },

  setResultsViewTab: (tab) => set({ resultsViewTab: tab }),

  setIsPlaying: (isPlaying, playbackMode = null) => set({ isPlaying, playbackMode }),

  toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),
}));
