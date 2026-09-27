/**
 * NoteChipsRow — renders the chip row + ⌫ Last / Clear action buttons
 * Reads melodyNotes, removeNote, removeLastNote, clearMelody from store
 */
import NoteChip from './NoteChip';
import { Button } from '@/components/ui/button';
import { useMelodexStore } from '@/store';

export default function NoteChipsRow() {
  const melodyNotes = useMelodexStore((s) => s.melodyNotes);
  const removeNote = useMelodexStore((s) => s.removeNote);
  const removeLastNote = useMelodexStore((s) => s.removeLastNote);
  const clearMelody = useMelodexStore((s) => s.clearMelody);

  const isEmpty = melodyNotes.length === 0;

  return (
    <div className="flex flex-col gap-2">
      {/* Chip row */}
      <div className="flex flex-wrap gap-1.5 min-h-[32px]">
        {melodyNotes.map((note, index) => (
          <NoteChip
            key={`${note}-${index}`}
            note={note}
            onRemove={() => removeNote(index)}
          />
        ))}
      </div>

      {/* Action row */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="h-10"
          disabled={isEmpty}
          onClick={removeLastNote}
          aria-label="Remove last note"
        >
          ⌫ Last
        </Button>
        <Button
          variant="outline"
          className="h-10"
          disabled={isEmpty}
          onClick={clearMelody}
          aria-label="Clear all notes"
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
