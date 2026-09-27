/**
 * TextInput — textarea for typing note names
 * Space or Enter parses the current token as a note and adds it to the melody.
 * Invalid tokens are silently discarded (no error message per FR-1.1).
 * Local state only — inputValue does not go to Zustand.
 */
import { useState } from 'react';
import { isValidNote } from '@/engine';
import { useMelodexStore } from '@/store';

export default function TextInput() {
  const [inputValue, setInputValue] = useState('');
  const addNote = useMelodexStore((s) => s.addNote);

  const processToken = (token) => {
    const trimmed = token.trim();
    if (!trimmed) return;
    const normalized = trimmed.toUpperCase();
    if (isValidNote(normalized)) {
      addNote(normalized);
    }
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      e.preventDefault();
      processToken(inputValue);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      processToken(inputValue);
    }
  };

  return (
    <textarea
      className="w-full min-h-[44px] rounded-md border bg-background px-3 py-2 text-sm resize-none"
      placeholder="C D E F G A B"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={handleKeyDown}
      rows={1}
    />
  );
}
