// PROTOTYPE ONLY. Question: "How should the app header (top bar) be structured on mobile?"
// Three variants on the dev-only /prototype-header route, switchable via ?variant=A|B|C, each shown on a
// top-level page (?page=top, Events overview) and a nested page (?page=nested, an event detail).
// Throw away once a variant wins (see .claude/skills/prototype/UI.md).
import { useEffect } from 'react'
import { PrototypeSwitcher } from '@shared/ui/PrototypeSwitcher'
import type { PageContext } from './prototype-parts'
import * as A from './VariantContextBar'
import * as B from './VariantLargeTitle'
import * as C from './VariantBottomChrome'

export type HeaderVariant = 'A' | 'B' | 'C'

const VARIANTS = [
  { key: 'A' as const, name: A.name, View: A.VariantContextBar },
  { key: 'B' as const, name: B.name, View: B.VariantLargeTitle },
  { key: 'C' as const, name: C.name, View: C.VariantBottomChrome },
]

interface Props {
  variant: HeaderVariant
  page: PageContext
  onChange: (next: { variant?: HeaderVariant; page?: PageContext }) => void
}

export function HeaderPrototypePage({ variant, page, onChange }: Props) {
  const { View } = VARIANTS.find((v) => v.key === variant) ?? VARIANTS[0]
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [variant, page])

  const seg = (p: PageContext, label: string) => (
    <button
      type="button"
      onClick={() => onChange({ page: p })}
      aria-pressed={page === p}
      className={`h-9 rounded-full px-3 font-medium ${page === p ? 'bg-background text-foreground' : 'hover:bg-white/15'}`}
    >
      {label}
    </button>
  )

  return (
    <>
      <View page={page} onNavigate={(p) => onChange({ page: p })} />
      <PrototypeSwitcher variants={VARIANTS} current={variant} onChange={(v) => onChange({ variant: v })}>
        <span className="mx-1 h-6 w-px bg-white/25" />
        <div className="mr-1 flex items-center gap-0.5">
          {seg('top', 'Top')}
          {seg('nested', 'Nested')}
        </div>
      </PrototypeSwitcher>
    </>
  )
}
