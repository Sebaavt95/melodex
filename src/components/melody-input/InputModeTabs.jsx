/**
 * InputModeTabs — shadcn Tabs for switching between Text and Piano input modes
 * Reads inputMode, melodyNotes, harmonyNotes, setInputMode, addNote from store
 * Switching tabs does NOT clear the melody sequence
 */
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TextInput from './TextInput';
import NoteChipsRow from './NoteChipsRow';
import Piano from '@/components/piano/Piano';
import { useMelodexStore } from '@/store';

export default function InputModeTabs() {
  const inputMode = useMelodexStore((s) => s.inputMode);
  const melodyNotes = useMelodexStore((s) => s.melodyNotes);
  const harmonyNotes = useMelodexStore((s) => s.harmonyNotes);
  const setInputMode = useMelodexStore((s) => s.setInputMode);
  const addNote = useMelodexStore((s) => s.addNote);

  return (
    <Tabs value={inputMode} onValueChange={setInputMode}>
      <TabsList className="w-full">
        <TabsTrigger value="text" className="flex-1">Text</TabsTrigger>
        <TabsTrigger value="piano" className="flex-1">Piano</TabsTrigger>
      </TabsList>

      <TabsContent value="text">
        <div className="flex flex-col gap-3">
          <TextInput />
          <NoteChipsRow />
        </div>
      </TabsContent>

      <TabsContent value="piano">
        <Piano
          activeMelodyNotes={melodyNotes}
          activeHarmonyNotes={harmonyNotes ?? []}
          onKeyPress={addNote}
        />
      </TabsContent>
    </Tabs>
  );
}
