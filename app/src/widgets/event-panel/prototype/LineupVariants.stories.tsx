import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { VariantA } from './VariantA'
import { VariantD } from './VariantD'
import { VariantE } from './VariantE'
import { VariantF } from './VariantF'
import { demoAttendances, demoRoster, DEMO_SELF_ID } from './demo-squad'
import type { LineupState } from './lineup-model'

/**
 * PROTOTYPE — throwaway, and NOT an example of how stories are written here: no play functions, no
 * spies, no states matrix. It exists so the variants can be compared side by side without the
 * backend, in a card-width frame, against the demo squad. The real prototype is the events page
 * itself (`?variant=A|D|E|F`).
 */

type Variant = 'A' | 'D' | 'E' | 'F'

function Frame({ variant }: { variant: Variant }) {
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
      {variant === 'D' && <VariantD {...props} />}
      {variant === 'E' && <VariantE {...props} />}
      {variant === 'F' && <VariantF {...props} />}
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
export const D_Huddle: Story = { args: { variant: 'D' } }
export const E_Court: Story = { args: { variant: 'E' } }
export const F_Triage: Story = { args: { variant: 'F' } }
