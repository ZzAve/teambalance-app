import { createFileRoute, redirect } from '@tanstack/react-router'
import { authMeQueryOptions } from '@shared/api/auth'
import { queryClient } from '@shared/api/query-client'
import { teamRoutes } from '@shared/lib/team-routes'
import { MemberRoster } from '@features/manage-members/ui/MemberRoster'
import { TeamSettings } from '@features/team-settings/ui/TeamSettings'
import { ManagePositions } from '@features/manage-positions/ui/ManagePositions'
import { ManageEventTypes } from '@features/manage-event-types/ui/ManageEventTypes'
import { HandoverAdmin } from '@features/handover-admin/ui/HandoverAdmin'
import { ActAsRecords } from '@features/act-as/ui/ActAsRecords'
// PROTOTYPE — throwaway (issue #341). Three structurally different row shapes for the
// members/positions lists, switchable via ?variant= on this existing route. See
// .claude/skills/prototype/UI.md. Remove this block (and the two `ui/prototype` folders) once a
// variant wins.
import { PrototypeSwitcher, usePrototypeVariant } from '@shared/ui/PrototypeSwitcher'
import { MemberRosterVariantB } from '@features/manage-members/ui/prototype/MemberRosterVariantB'
import { MemberRosterVariantC } from '@features/manage-members/ui/prototype/MemberRosterVariantC'
import { ManagePositionsVariantB } from '@features/manage-positions/ui/prototype/ManagePositionsVariantB'
import { ManagePositionsVariantC } from '@features/manage-positions/ui/prototype/ManagePositionsVariantC'

export const Route = createFileRoute('/t/$slug/team/settings')({
  // Admin-only. Read the same /me query the root guard primed (from cache) and bounce non-admins
  // home before the settings mount — race-free, mirroring the /members admin gate.
  beforeLoad: async ({ params }) => {
    let user = null
    try {
      user = await queryClient.ensureQueryData(authMeQueryOptions)
    } catch {
      // Session unconfirmed — treat as not authorized.
    }
    // `role` is the caller's Role in the ACTIVE Team (ADR-0023 §4) — and /t/$slug's gate has
    // already switched to this slug, so it is the Role here. Someone who is an Admin of their other
    // Team is a plain member on this screen.
    if (user?.role !== 'ADMIN') throw redirect({ to: teamRoutes(params.slug).events })
  },
  component: TeamSettingsPage,
})

function TeamSettingsPage() {
  // PROTOTYPE (#341): pick the row variant from ?variant=, defaulting to A (today's page,
  // untouched). Only the members + positions sections swap; event types, team settings, handover
  // and platform access render exactly as they do today in every variant.
  const variant = usePrototypeVariant(['A', 'B', 'C'] as const)

  // Admin manage surface: member management (the editable roster), then positions, then the event
  // types whose roster defaults reference those positions, then team settings, then platform access.
  // Event types come after positions deliberately — a roster default is authored in terms of the
  // vocabulary above it. The read-only view of the same roster lives on /team.
  return (
    <div className="flex flex-col gap-10">
      <ProtoStateNote variant={variant} />

      {variant === 'A' && <MemberRoster canManage />}
      {variant === 'B' && <MemberRosterVariantB />}
      {variant === 'C' && <MemberRosterVariantC />}

      {variant === 'A' && <ManagePositions />}
      {variant === 'B' && <ManagePositionsVariantB />}
      {variant === 'C' && <ManagePositionsVariantC />}

      {/* Event types stay as Variant A in every prototype variant — time-boxed; the members/positions
          rows are the ones this prototype is judging. */}
      <ManageEventTypes />
      <TeamSettings />
      {/* Handing over admin (ADR-0024 §5): how a prepared, memberless team gets its first real Admin.
          Below the day-to-day settings — it is a one-off, not a routine control. Unchanged in every
          variant. */}
      <HandoverAdmin />
      {/* Admin-only, and last: platform access is rare and, to someone who has never heard of it,
          alarming out of context. It sits below the settings an Admin actually came here for. */}
      <ActAsRecords />

      <PrototypeSwitcher
        variants={[
          { key: 'A', name: 'Current' },
          { key: 'B', name: 'Quiet row + menu' },
          { key: 'C', name: 'Tap row → sheet' },
        ]}
      />
    </div>
  )
}

/**
 * PROTOTYPE (#341) — "surface the state". Plain-text summary of where destructive actions live,
 * how many solid-red elements sit on screen by default, and how a name gets edited, for whichever
 * variant is active. Event types (3 rows, red "Archive") and the handover "Revoke link" are
 * unchanged across all three variants, so they count toward every total below.
 */
function ProtoStateNote({ variant }: { variant: 'A' | 'B' | 'C' }) {
  const notes: Record<'A' | 'B' | 'C', { destructive: string; redCount: string; naming: string }> = {
    A: {
      destructive:
        'On the row itself: a solid red "Remove"/"Delete"/"Archive" button sits on every member, position and event-type row, plus a solid red "Revoke link" in Handover.',
      redCount:
        '~14 solid red buttons on screen at once (6 members + 4 positions + 3 event types + 1 revoke), none behind a confirmation step of their own — each opens a dialog whose own button is red too.',
      naming: 'The name is an always-open <Input> on every row — every row is "in edit mode" all the time, whether or not you touched it.',
    },
    B: {
      destructive:
        'Off the row: each row has one ⋯ menu; "Remove…" / "Delete…" sit last in that menu in red text, and the actual removal happens on a red confirm button inside a dialog. Event types (unchanged) still show a red "Archive" button, and Handover still shows a red "Revoke link".',
      redCount:
        '4 solid red buttons visible by default (3 event-type "Archive" + 1 "Revoke link"); members/positions contribute 0 until a ⋯ menu is opened (adds red menu text) or a confirm dialog is open (adds 1 red button).',
      naming: 'The name renders as plain text; tapping it (or the pencil affordance) swaps in an inline Input with Save/Cancel — edit mode is opt-in, per row, and closes itself on Save/Cancel.',
    },
    C: {
      destructive:
        'Off the row entirely: the row has no buttons — tapping it opens a bottom Sheet with every edit for that member/position, ending in an outlined (not red) "Remove from team…" / "Delete position…" that opens the same red confirm dialog as the others. Event types (unchanged) still show a red "Archive" button, and Handover still shows a red "Revoke link".',
      redCount:
        '4 solid red buttons visible by default (3 event-type "Archive" + 1 "Revoke link"); members/positions contribute 0 until a confirm dialog is open (adds 1 red button) — even the sheet\'s own remove/delete trigger is neutral, not red.',
      naming: 'The name lives inside the Sheet as an always-editable field with its own Save button — there is one edit surface per row, reached by tapping the row, rather than a control on the row.',
    },
  }
  const n = notes[variant]
  return (
    <details className="rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
      <summary className="cursor-pointer font-semibold text-foreground">Prototype #341 — row (variant {variant})</summary>
      <div className="mt-2 flex flex-col gap-2">
        <p><strong className="text-foreground">Where destructive actions live:</strong> {n.destructive}</p>
        <p><strong className="text-foreground">Red elements on screen:</strong> {n.redCount}</p>
        <p><strong className="text-foreground">How a name is edited:</strong> {n.naming}</p>
      </div>
    </details>
  )
}
