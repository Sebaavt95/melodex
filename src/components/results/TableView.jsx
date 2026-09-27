import { useMelodexStore } from '@/store';

export default function TableView() {
  const melodyNotes = useMelodexStore((s) => s.melodyNotes);
  const harmonyNotes = useMelodexStore((s) => s.harmonyNotes);

  return (
    <div className="overflow-x-hidden">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="text-xs uppercase tracking-wider text-muted-foreground text-left py-2 px-3">
              #
            </th>
            <th className="text-xs uppercase tracking-wider text-muted-foreground text-left py-2 px-3">
              Melody
            </th>
            <th className="text-xs uppercase tracking-wider text-muted-foreground text-left py-2 px-3">
              Harmony
            </th>
          </tr>
        </thead>
        <tbody>
          {melodyNotes.map((melodyNote, i) => (
            <tr
              key={i}
              className="border-t border-border"
              style={{ minHeight: '44px' }}
            >
              <td className="py-2 px-3 text-muted-foreground">{i + 1}</td>
              <td className="py-2 px-3">
                <span
                  className="inline-block w-2 h-2 rounded-full mr-2"
                  style={{ background: 'hsl(var(--melody))' }}
                />
                {melodyNote}
              </td>
              <td className="py-2 px-3">
                <span
                  className="inline-block w-2 h-2 rounded-full mr-2"
                  style={{ background: 'hsl(var(--harmony))' }}
                />
                {harmonyNotes[i]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
