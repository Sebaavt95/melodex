import KeySelector from './KeySelector';
import HarmonizationSelector from './HarmonizationSelector';
import HarmonizeButton from './HarmonizeButton';

export default function ControlsSection() {
  return (
    <section className="flex flex-col gap-3">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">Key &amp; Style</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
          <KeySelector />
          <HarmonizationSelector />
        </div>
        <HarmonizeButton />
      </div>
    </section>
  );
}
