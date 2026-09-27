import { create } from 'zustand';

// NOTE: This is a MINIMAL STUB for Slice 1 (isDarkMode + toggleDarkMode only).
// Slice 2 will expand this file with the full store shape:
// melodyNotes, inputMode, selectedKey, selectedMode, harmonizationType,
// harmonyNotes, resultsViewTab, isPlaying, playbackMode, and all engine actions.

export const useMelodexStore = create((set) => ({
  // ── Theme (needed by Header + App.jsx in Slice 1) ─────────────────────────
  isDarkMode: true,
  toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),
}));
