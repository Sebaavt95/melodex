import { useMelodexStore } from '@/store';
import { playMelody, playBoth, stopPlayback } from '@/audio';
import { Button } from '@/components/ui/button';

export default function PlaybackControls() {
  const melodyNotes = useMelodexStore((s) => s.melodyNotes);
  const harmonyNotes = useMelodexStore((s) => s.harmonyNotes);
  const isPlaying = useMelodexStore((s) => s.isPlaying);
  const setIsPlaying = useMelodexStore((s) => s.setIsPlaying);

  const handlePlayMelody = () => {
    setIsPlaying(true, 'melody');
    playMelody(melodyNotes, () => setIsPlaying(false));
  };

  const handlePlayBoth = () => {
    setIsPlaying(true, 'both');
    playBoth(melodyNotes, harmonyNotes, () => setIsPlaying(false));
  };

  const handleStop = () => {
    stopPlayback();
    setIsPlaying(false);
  };

  return (
    <div className="flex gap-2">
      <Button className="flex-1 h-12" onClick={isPlaying ? handleStop : handlePlayMelody}>
        {isPlaying ? '⏹ Stop' : '▶ Melody'}
      </Button>
      <Button className="flex-1 h-12" onClick={isPlaying ? handleStop : handlePlayBoth}>
        {isPlaying ? '⏹ Stop' : '▶ Melody + Harmony'}
      </Button>
    </div>
  );
}
