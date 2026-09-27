import { useMelodexStore } from '@/store';
import ViewTabs from './ViewTabs';
import PlaybackControls from '../playback/PlaybackControls';

// ResultsSection is conditionally rendered (returns null when harmonyNotes === null).
// Because it is unmounted and remounted on the first harmonize, the entrance
// animation class is applied on initial mount and never re-applied on updates.
export default function ResultsSection() {
  const harmonyNotes = useMelodexStore((s) => s.harmonyNotes);

  if (harmonyNotes === null) {
    return null;
  }

  return (
    <section className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">Results</p>
      <ViewTabs />
      <PlaybackControls />
    </section>
  );
}
