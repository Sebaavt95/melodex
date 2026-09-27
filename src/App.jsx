import { useEffect } from 'react';
import AppLayout from './components/layout/AppLayout';
import Header from './components/layout/Header';
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
      {/* Zone 1: Melody Input — wired in Slice 3 (T3.8) */}
      <div>{/* MelodyInputSection placeholder */}</div>
      {/* Zone 2: Controls — wired in Slice 4 (T4.5) */}
      <div>{/* ControlsSection placeholder */}</div>
      {/* Zone 3: Results — wired in Slice 5 (T5.6) */}
      <div>{/* ResultsSection placeholder */}</div>
    </AppLayout>
  );
}

export default App;
