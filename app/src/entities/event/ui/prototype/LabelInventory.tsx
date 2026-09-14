/**
 * PROTOTYPE #339 — throwaway. Surfaces, for the active variant, every micro-label on the event-detail
 * page and how it's being treated. Plain text per the prototype skill's "surface the state" rule.
 * Delete this file (and its host-page mount) when the prototype is folded in or dropped.
 */

type Variant = 'A' | 'B' | 'C'

type Treatment = 'kept-caps' | 'sentence-case' | 'removed'

interface LabelEntry {
  label: string
  treatment: Record<Variant, Treatment>
}

const LABELS: LabelEntry[] = [
  {
    label: 'Type badge (e.g. "Training")',
    treatment: { A: 'kept-caps', B: 'sentence-case', C: 'sentence-case' },
  },
  {
    label: 'Roster (roster bar heading)',
    treatment: { A: 'kept-caps', B: 'sentence-case', C: 'removed' },
  },
  {
    label: 'Your response',
    treatment: { A: 'kept-caps', B: 'sentence-case', C: 'removed' },
  },
  {
    label: 'Description',
    treatment: { A: 'kept-caps', B: 'sentence-case', C: 'removed' },
  },
  {
    label: 'Additional info',
    treatment: { A: 'kept-caps', B: 'sentence-case', C: 'removed' },
  },
  {
    label: 'Position group headings (Setter / Libero / Unassigned)',
    treatment: { A: 'kept-caps', B: 'sentence-case', C: 'sentence-case' },
  },
  {
    label: 'Series peek "This one" chip',
    treatment: { A: 'kept-caps', B: 'sentence-case', C: 'sentence-case' },
  },
]

export function LabelInventory({ variant }: { variant: Variant }) {
  return (
    <details className="mb-4 rounded-lg border border-dashed border-fuchsia-500/50 bg-fuchsia-500/5 p-3 text-xs">
      <summary className="cursor-pointer font-mono font-semibold">Prototype #339 — labels ({variant})</summary>
      <ul className="mt-2 space-y-1 font-mono">
        {LABELS.map((entry) => (
          <li key={entry.label}>
            {entry.label} — {entry.treatment[variant]}
          </li>
        ))}
      </ul>
    </details>
  )
}
