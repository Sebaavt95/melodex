/**
 * PianoKey — renders a single piano key (white or black)
 * Props: { note, isBlack, leftPx, isMelodyActive, isHarmonyActive, onPress }
 */
import { cn } from '@/lib/utils';

export default function PianoKey({ note, isBlack, leftPx, isMelodyActive, isHarmonyActive, onPress }) {
  if (isBlack) {
    return (
      <button
        type="button"
        style={{ left: `${leftPx}px`, touchAction: 'none' }}
        className={cn(
          'absolute top-0 w-[26px] h-[68px] rounded-b-sm z-10',
          'transition-transform duration-75 active:scale-y-95',
          isMelodyActive && 'bg-indigo-500',
          isHarmonyActive && !isMelodyActive && 'bg-violet-500',
          !isMelodyActive && !isHarmonyActive && 'bg-slate-800'
        )}
        onPointerDown={() => onPress(note)}
        aria-label={note}
      />
    );
  }

  return (
    <button
      type="button"
      style={{ touchAction: 'none' }}
      className={cn(
        'w-10 h-[110px] border border-slate-600 rounded-b-sm flex-shrink-0',
        'transition-transform duration-75 active:scale-y-95',
        isMelodyActive && 'bg-indigo-400',
        isHarmonyActive && !isMelodyActive && 'bg-violet-400',
        !isMelodyActive && !isHarmonyActive && 'bg-slate-100 dark:bg-slate-200'
      )}
      onPointerDown={() => onPress(note)}
      aria-label={note}
    />
  );
}
