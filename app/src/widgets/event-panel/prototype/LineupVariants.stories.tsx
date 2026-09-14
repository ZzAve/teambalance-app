import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { VariantA } from './VariantA'
import { VariantB } from './VariantB'
import { VariantC } from './VariantC'
import { demoAttendances, demoRoster, DEMO_SELF_ID } from './demo-squad'
import type { LineupState } from './lineup-model'

/**
 * PROTOTYPE — throwaway, and NOT an example of how stories are written here: no play functions, no
 * spies, no states matrix. It exists so the three variants can be compared side by side without the
 * backend, in a card-width frame, against the demo squad. The real prototype is the events page
 * itself (`?variant=A|B|C`).
 */

function Frame({ variant }: { variant: 'A' | 'B' | 'C' }) {
  const [rows, setRows] = useState(demoAttendances)
  const onRespond = (userId: string, state: LineupState) =>
    setRows((current) => current.map((r) => (r.userId === userId ? { ...r, state } : r)))
  const props = { attendances: rows, roster: demoRoster(rows), currentUserId: DEMO_SELF_ID, onRespond }

  return (
    <div className="mx-auto w-[380px] rounded-2xl border border-border/40 bg-card p-3.5 shadow-sm">
      <div className="mb-3 border-b border-border/40 pb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
        Variant {variant}
      </div>
      {variant === 'A' && <VariantA {...props} />}
      {variant === 'B' && <VariantB {...props} />}
      {variant === 'C' && <VariantC {...props} />}
    </div>
  )
}

const meta = {
  title: 'Prototype/Lineup panel',
  component: Frame,
} satisfies Meta<typeof Frame>

export default meta
type Story = StoryObj<typeof meta>

export const A_Pips: Story = { args: { variant: 'A' } }
export const B_Pills: Story = { args: { variant: 'B' } }
export const C_LineupSheet: Story = { args: { variant: 'C' } }
