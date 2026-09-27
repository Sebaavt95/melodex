import { Button } from '@/components/ui/button';
import { useMelodexStore } from '@/store';

export default function HarmonizeButton() {
  const melodyNotes = useMelodexStore((s) => s.melodyNotes);
  const harmonize = useMelodexStore((s) => s.harmonize);

  return (
    <Button
      className="w-full h-12 sm:w-auto sm:h-11"
      disabled={melodyNotes.length === 0}
      onClick={harmonize}
    >
      Harmonize →
    </Button>
  );
}
