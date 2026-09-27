import { Sun, Moon } from 'lucide-react';
import { useMelodexStore } from '@/store';

/**
 * Header — Melodex logo + theme toggle button.
 * Reads isDarkMode / toggleDarkMode from the Zustand store.
 * Tap target: w-11 h-11 (44×44px) per FR-10.7.
 */
function Header() {
  const isDarkMode = useMelodexStore((s) => s.isDarkMode);
  const toggleDarkMode = useMelodexStore((s) => s.toggleDarkMode);

  return (
    <header className="h-12 flex items-center justify-between px-4">
      <span className="font-semibold text-lg">Melodex</span>
      <button
        className="w-11 h-11 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
        onClick={toggleDarkMode}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </header>
  );
}

export default Header;
