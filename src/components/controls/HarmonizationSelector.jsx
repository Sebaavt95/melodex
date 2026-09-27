import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMelodexStore } from '@/store';

const HARMONIZATION_OPTIONS = [
  { value: 'thirds-up', label: '3rds up' },
  { value: 'thirds-down', label: '3rds down' },
  { value: 'fifths', label: '5ths' },
  { value: 'sixths-up', label: '6ths up' },
  { value: 'sixths-down', label: '6ths down' },
];

export default function HarmonizationSelector() {
  const harmonizationType = useMelodexStore((s) => s.harmonizationType);
  const setHarmonizationType = useMelodexStore((s) => s.setHarmonizationType);

  const currentLabel =
    HARMONIZATION_OPTIONS.find((o) => o.value === harmonizationType)?.label ?? harmonizationType;

  return (
    <Select value={harmonizationType} onValueChange={setHarmonizationType}>
      <SelectTrigger className="w-full h-11 sm:w-auto">
        <SelectValue>{currentLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {HARMONIZATION_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
