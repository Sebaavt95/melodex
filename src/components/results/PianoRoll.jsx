import { useMelodexStore } from '@/store';
import { noteToPC } from '@/engine';

// Layout constants (per design spec)
const LABEL_W = 40;
const COL_W = 44;
const ROW_H = 24;
const HEADER_H = 20;
const NOTE_PADDING = 2;

/**
 * Deduplicate and sort notes by pitch class (high → low).
 * @param {string[]} melodyNotes
 * @param {string[]} harmonyNotes
 * @returns {string[]} sorted unique note names
 */
function computeNoteRows(melodyNotes, harmonyNotes) {
  const all = [...melodyNotes, ...harmonyNotes];
  const unique = [...new Set(all)];
  // Sort high → low by pitch class
  return unique.sort((a, b) => (noteToPC(b) ?? 0) - (noteToPC(a) ?? 0));
}

export default function PianoRoll() {
  const melodyNotes = useMelodexStore((s) => s.melodyNotes);
  const harmonyNotes = useMelodexStore((s) => s.harmonyNotes);

  const noteRows = computeNoteRows(melodyNotes, harmonyNotes);
  const totalW = LABEL_W + melodyNotes.length * COL_W;
  const totalH = HEADER_H + noteRows.length * ROW_H;

  return (
    <div className="overflow-x-auto" style={{ touchAction: 'pan-x' }}>
      <svg
        width={totalW}
        height={totalH}
        style={{ display: 'block' }}
        aria-label="Piano roll"
      >
        {/* Header: step numbers */}
        {melodyNotes.map((_, i) => (
          <text
            key={`step-${i}`}
            x={LABEL_W + i * COL_W + COL_W / 2}
            y={HEADER_H - 4}
            textAnchor="middle"
            fontSize={10}
            fill="currentColor"
            opacity={0.5}
          >
            {i + 1}
          </text>
        ))}

        {/* Y-axis note labels + horizontal grid lines */}
        {noteRows.map((note, row) => {
          const y = HEADER_H + row * ROW_H;
          return (
            <g key={`row-${note}`}>
              {/* Horizontal grid line */}
              <line
                x1={LABEL_W}
                y1={y}
                x2={totalW}
                y2={y}
                stroke="currentColor"
                strokeOpacity={0.1}
              />
              {/* Note label */}
              <text
                x={LABEL_W - 4}
                y={y + ROW_H / 2 + 4}
                textAnchor="end"
                fontSize={10}
                fill="currentColor"
                opacity={0.7}
              >
                {note}
              </text>
            </g>
          );
        })}

        {/* Melody rects */}
        {melodyNotes.map((note, col) => {
          const row = noteRows.indexOf(note);
          if (row === -1) return null;
          return (
            <rect
              key={`melody-${col}`}
              x={LABEL_W + col * COL_W + NOTE_PADDING}
              y={HEADER_H + row * ROW_H + NOTE_PADDING}
              width={COL_W - NOTE_PADDING * 2}
              height={ROW_H - NOTE_PADDING * 2}
              fill="hsl(var(--melody))"
              fillOpacity={0.85}
              rx={3}
            />
          );
        })}

        {/* Harmony rects */}
        {harmonyNotes.map((note, col) => {
          const row = noteRows.indexOf(note);
          if (row === -1) return null;
          return (
            <rect
              key={`harmony-${col}`}
              x={LABEL_W + col * COL_W + NOTE_PADDING}
              y={HEADER_H + row * ROW_H + NOTE_PADDING}
              width={COL_W - NOTE_PADDING * 2}
              height={ROW_H - NOTE_PADDING * 2}
              fill="hsl(var(--harmony))"
              fillOpacity={0.75}
              rx={3}
            />
          );
        })}
      </svg>
    </div>
  );
}
