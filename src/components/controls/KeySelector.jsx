import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMelodexStore } from '@/store';

const CHROMATIC_ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export default function KeySelector() {
  const selectedKey = useMelodexStore((s) => s.selectedKey);
  const selectedMode = useMelodexStore((s) => s.selectedMode);
  const setSelectedKey = useMelodexStore((s) => s.setSelectedKey);

  const value = `${selectedKey}-${selectedMode}`;
  const triggerLabel = `${selectedKey} ${selectedMode === 'major' ? 'Major' : 'Minor'}`;

  function handleChange(val) {
    const dashIdx = val.lastIndexOf('-');
    const key = val.slice(0, dashIdx);
    const mode = val.slice(dashIdx + 1);
    setSelectedKey(key, mode);
  }

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className="w-full h-11 sm:w-auto">
        <SelectValue>{triggerLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Major</SelectLabel>
          {CHROMATIC_ROOTS.map((root) => (
            <SelectItem key={`${root}-major`} value={`${root}-major`}>
              {root} Major
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Minor</SelectLabel>
          {CHROMATIC_ROOTS.map((root) => (
            <SelectItem key={`${root}-minor`} value={`${root}-minor`}>
              {root} Minor
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
