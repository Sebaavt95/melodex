import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Tone.js BEFORE importing player
const mockTriggerAttackRelease = vi.fn();
const mockToDestination = vi.fn().mockReturnThis();
const mockVolumeSetter = { value: 0 };

// Each Synth instance gets its own spies so we can tell the melody voice
// apart from the harmony voice. The player creates them lazily, in this
// order: melody first, harmony second.
const synthInstances = [];

const MockSynth = vi.fn().mockImplementation(() => {
  const instance = {
    triggerAttackRelease: mockTriggerAttackRelease,
    triggerRelease: vi.fn(),
    envelope: { cancel: vi.fn() },
    toDestination: mockToDestination,
    volume: mockVolumeSetter,
  };
  synthInstances.push(instance);
  return instance;
});

const melodySynth = () => synthInstances[0];
const harmonySynth = () => synthInstances[1];

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

    it('releases the melody synth so the sounding voice stops', async () => {
      await playMelody(['C', 'D'], vi.fn());
      vi.clearAllMocks();
      stopPlayback();
      expect(melodySynth().triggerRelease).toHaveBeenCalledTimes(1);
    });

    it('releases both the melody and the harmony synths', async () => {
      await playBoth(['C', 'D'], ['E', 'F'], vi.fn());
      vi.clearAllMocks();
      stopPlayback();
      expect(melodySynth().triggerRelease).toHaveBeenCalledTimes(1);
      expect(harmonySynth().triggerRelease).toHaveBeenCalledTimes(1);
    });

    it('cancels the pre-scheduled envelope so no queued note can still sound', async () => {
      await playMelody(['C', 'D', 'E'], vi.fn());
      vi.clearAllMocks();
      stopPlayback();
      expect(melodySynth().envelope.cancel).toHaveBeenCalledTimes(1);
    });

    it('cancels the pre-scheduled envelopes of both voices', async () => {
      await playBoth(['C', 'D'], ['E', 'F'], vi.fn());
      vi.clearAllMocks();
      stopPlayback();
      expect(melodySynth().envelope.cancel).toHaveBeenCalledTimes(1);
      expect(harmonySynth().envelope.cancel).toHaveBeenCalledTimes(1);
    });

    it('cancels from the current audio time, not from a future horizon', async () => {
      await playMelody(['C', 'D'], vi.fn());
      stopPlayback();
      // No argument: Tone cancels everything scheduled at or after context.now().
      // A future horizon would leave the already-queued notes alive.
      expect(melodySynth().envelope.cancel).toHaveBeenCalledWith();
    });

    it('does not fire onDone for a stopped sequence', async () => {
      vi.useFakeTimers();
      try {
        const onDone = vi.fn();
        await playMelody(['C', 'D', 'E'], onDone);
        stopPlayback();
        vi.advanceTimersByTime(5000);
        expect(onDone).not.toHaveBeenCalled();
      } finally {
        vi.useRealTimers();
      }
    });

    it('fires onDone once on an uninterrupted run, after notes * 0.45 + 0.5s', async () => {
      vi.useFakeTimers();
      try {
        const onDone = vi.fn();
        await playMelody(['C', 'D', 'E'], onDone); // 3 * 0.45 + 0.5 = 1.85s
        vi.advanceTimersByTime(1849);
        expect(onDone).not.toHaveBeenCalled();
        vi.advanceTimersByTime(1);
        expect(onDone).toHaveBeenCalledTimes(1);
      } finally {
        vi.useRealTimers();
      }
    });

    it('replays cleanly after a stop, without a leaked timer firing onDone twice', async () => {
      vi.useFakeTimers();
      try {
        const firstRun = vi.fn();
        await playMelody(['C', 'D'], firstRun);
        stopPlayback();
        const secondRun = vi.fn();
        await playMelody(['C', 'D'], secondRun);
        vi.advanceTimersByTime(5000);
        expect(firstRun).not.toHaveBeenCalled();
        expect(secondRun).toHaveBeenCalledTimes(1);
      } finally {
        vi.useRealTimers();
      }
    });

    it('still plays a single note after a stop', async () => {
      await playMelody(['C'], vi.fn());
      stopPlayback();
      vi.clearAllMocks();
      await playNote('G');
      expect(mockTriggerAttackRelease).toHaveBeenCalledWith('G4', '8n');
    });
  });
});
