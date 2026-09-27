import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Tone.js BEFORE importing player
const mockTriggerAttackRelease = vi.fn();
const mockToDestination = vi.fn().mockReturnThis();
const mockVolumeSetter = { value: 0 };

const MockSynth = vi.fn().mockImplementation(() => ({
  triggerAttackRelease: mockTriggerAttackRelease,
  toDestination: mockToDestination,
  volume: mockVolumeSetter,
}));

// Tone.now returns a predictable time
const mockNow = vi.fn().mockReturnValue(0);
const mockStart = vi.fn().mockResolvedValue(undefined);

vi.mock('tone', () => ({
  Synth: MockSynth,
  now: mockNow,
  start: mockStart,
}));

// Import player AFTER mocks are set up
const { playNote, playMelody, playBoth, stopPlayback } = await import('@/audio/player');

describe('audio/player', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNow.mockReturnValue(0);
    stopPlayback();
  });

  describe('playNote', () => {
    it('calls Tone.start() before playing', async () => {
      await playNote('C');
      expect(mockStart).toHaveBeenCalledOnce();
    });

    it('triggers attack-release with octave 4 appended', async () => {
      await playNote('C');
      expect(mockTriggerAttackRelease).toHaveBeenCalledWith('C4', '8n');
    });

    it('triggers the correct note with octave for F#', async () => {
      await playNote('F#');
      expect(mockTriggerAttackRelease).toHaveBeenCalledWith('F#4', '8n');
    });
  });

  describe('playMelody', () => {
    it('calls Tone.start() before playing', async () => {
      const onDone = vi.fn();
      await playMelody(['C', 'D'], onDone);
      expect(mockStart).toHaveBeenCalledOnce();
    });

    it('schedules one triggerAttackRelease per note', async () => {
      const onDone = vi.fn();
      await playMelody(['C', 'D', 'E'], onDone);
      expect(mockTriggerAttackRelease).toHaveBeenCalledTimes(3);
    });

    it('uses octave 4 for all scheduled notes', async () => {
      const onDone = vi.fn();
      await playMelody(['A', 'B'], onDone);
      const calls = mockTriggerAttackRelease.mock.calls;
      expect(calls[0][0]).toBe('A4');
      expect(calls[1][0]).toBe('B4');
    });

    it('staggers notes at 0.45s intervals', async () => {
      mockNow.mockReturnValue(1.0);
      const onDone = vi.fn();
      await playMelody(['C', 'D'], onDone);
      const calls = mockTriggerAttackRelease.mock.calls;
      // now() + 0.05 = 1.05; C at 1.05, D at 1.05 + 0.45 = 1.50
      expect(calls[0][2]).toBeCloseTo(1.05, 2);
      expect(calls[1][2]).toBeCloseTo(1.5, 2);
    });
  });

  describe('playBoth', () => {
    it('schedules notes for BOTH melody and harmony synths', async () => {
      const onDone = vi.fn();
      await playBoth(['C', 'D'], ['E', 'F'], onDone);
      // 2 melody + 2 harmony = 4 total triggerAttackRelease calls
      expect(mockTriggerAttackRelease).toHaveBeenCalledTimes(4);
    });

    it('schedules harmony notes with octave 4', async () => {
      const onDone = vi.fn();
      await playBoth(['C'], ['E'], onDone);
      const noteArgs = mockTriggerAttackRelease.mock.calls.map((c) => c[0]);
      expect(noteArgs).toContain('C4');
      expect(noteArgs).toContain('E4');
    });
  });

  describe('stopPlayback', () => {
    it('can be called without error when no playback is active', () => {
      expect(() => stopPlayback()).not.toThrow();
    });
  });
});
