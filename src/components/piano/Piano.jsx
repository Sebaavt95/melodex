/**
 * Piano — 1-octave virtual piano keyboard (7 white + 5 black keys)
 * React.memo wrapped — only re-renders when activeMelodyNotes or activeHarmonyNotes change
 * Props: { activeMelodyNotes: string[], activeHarmonyNotes?: string[], onKeyPress: (note: string) => void }
 */
import { memo } from 'react';
import PianoKey from './PianoKey';
import { playNote } from '@/audio';

export const WHITE_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const BLACK_KEYS = [
  { note: 'C#', leftPx: 28 },
  { note: 'D#', leftPx: 68 },
  { note: 'F#', leftPx: 148 },
  { note: 'G#', leftPx: 188 },
  { note: 'A#', leftPx: 228 },
];

const Piano = memo(function Piano({ activeMelodyNotes = [], activeHarmonyNotes = [], onKeyPress }) {
  const handleKeyPress = (note) => {
    playNote(note); // immediate audio feedback
    onKeyPress(note);
  };

  return (
    <div className="overflow-x-auto rounded-md border border-slate-700">
      <div className="relative flex w-[280px] h-[110px]">
        {/* White keys — flex row */}
        {WHITE_KEYS.map((note) => (
          <PianoKey
            key={note}
            note={note}
            isBlack={false}
            leftPx={0}
            isMelodyActive={activeMelodyNotes.includes(note)}
            isHarmonyActive={activeHarmonyNotes.includes(note)}
            onPress={handleKeyPress}
          />
        ))}
        {/* Black keys — absolute overlays */}
        {BLACK_KEYS.map(({ note, leftPx }) => (
          <PianoKey
            key={note}
            note={note}
            isBlack={true}
            leftPx={leftPx}
            isMelodyActive={activeMelodyNotes.includes(note)}
            isHarmonyActive={activeHarmonyNotes.includes(note)}
            onPress={handleKeyPress}
          />
        ))}
      </div>
    </div>
  );
});

export default Piano;
