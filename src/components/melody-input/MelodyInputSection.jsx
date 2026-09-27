/**
 * MelodyInputSection — zone 1 wrapper with label + InputModeTabs
 * No props — reads store through child components
 */
import InputModeTabs from './InputModeTabs';

export default function MelodyInputSection() {
  return (
    <section className="flex flex-col gap-3">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">Melody Input</p>
      <InputModeTabs />
    </section>
  );
}
