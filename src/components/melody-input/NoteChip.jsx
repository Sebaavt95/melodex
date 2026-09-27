/**
 * NoteChip — displays a single note as a removable pill chip
 * Props: { note: string, onRemove: () => void }
 */
export default function NoteChip({ note, onRemove }) {
  return (
    <div className="flex items-center gap-1 px-3 h-8 rounded-full text-sm bg-indigo-900/50 text-indigo-300">
      {note}
      <button
        type="button"
        onClick={onRemove}
        className="flex items-center justify-center min-w-[24px] min-h-[24px] leading-none"
        aria-label={`Remove ${note}`}
      >
        ×
      </button>
    </div>
  );
}
