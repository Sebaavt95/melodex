import { useEffect } from 'react';
import AppLayout from './components/layout/AppLayout';
import Header from './components/layout/Header';
import MelodyInputSection from './components/melody-input/MelodyInputSection';
import ControlsSection from './components/controls/ControlsSection';
import { useMelodexStore } from '@/store';

function App() {
  const isDarkMode = useMelodexStore((s) => s.isDarkMode);

  // Sync dark class on <html> whenever the store toggle fires
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <AppLayout>
      <Header />
      {/* Zone 1: Melody Input */}
      <MelodyInputSection />
      {/* Zone 2: Controls */}
      <ControlsSection />
      {/* Zone 3: Results — wired in Slice 5 (T5.6) */}
      <div>{/* ResultsSection placeholder */}</div>
    </AppLayout>
  );
}

export default App;
