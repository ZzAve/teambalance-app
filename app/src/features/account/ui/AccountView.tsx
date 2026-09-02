import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronRight, KeyRound, LogOut, Mail, ShieldCheck, Users } from 'lucide-react'
import type { Member } from '@shared/api/members'
import type { Position } from '@shared/api/positions'
import { EditProfileForm } from '@features/edit-profile/ui/EditProfileForm'
import { ThemeToggle } from '@features/theme-toggle/ui/ThemeToggle'
import type { AccountSection } from '../lib/account-sections'

interface AccountViewProps {
  /** The visible sections for this session, from {@link accountSections}. Drives which rows render. */
  sections: AccountSection[]
  email: string
  /** The Active Team's name, or null when there is none (teamless). */
  activeTeamName?: string | null
  /** The current member — only present (and only fetched) when there is an Active Team. */
  member?: Member | null
  /** The Active Team's position vocabulary; empty hides the position picker. */
  positions?: Position[]
  /** The member-profile query is in flight. Shows the profile shell — Log out stays rendered. */
  isMemberLoading?: boolean
  /** The member-profile query failed. Shows the error shell — Log out stays rendered. */
  isMemberError?: boolean
  isSaving?: boolean
  /** Backend error discriminator from the update mutation (e.g. NAME_TAKEN), shown inline. */
  memberErrorCode?: string
  onSubmitProfile?: (name: string, positionId: string | null) => void
  onLogout: () => void
}

// A settings card: rows share the same warm surface, hairline dividers and soft lift as the
// appearance control, so the whole tab reads as one grouped list (ADR-0027 §2, concept prototype).
const CARD = 'overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]'
const ROW = 'flex items-center gap-3 px-4 py-3 text-sm'
// Links / buttons get a hover wash and an inset focus ring so keyboard focus stays visible on a row.
const ROW_INTERACTIVE =
  `${ROW} w-full text-left transition-colors hover:bg-muted/60 ` +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50'
const ICON = 'shrink-0 text-muted-foreground'

function SectionLabel({ children }: { children: ReactNode }) {
  return <h3 className="mb-2 px-1 text-sm font-semibold text-muted-foreground">{children}</h3>
}

/**
 * The adaptive Account settings list (ADR-0027 §2) — prop-only and presentational. The container
 * reads the session and the member profile; this renders the sections it is handed as a grouped
 * settings list of cards, following the concept prototype: iconed rows, right-aligned muted values,
 * an Active badge on the team, and Log out as its own red row.
 *
 * **Log out is rendered unconditionally**, in its own trailing card outside every other section —
 * including the profile loading/error shells — because it acts on the session, not on any data that
 * might still be loading. A failed member fetch can never hide it. That invariant is the whole point
 * of the ADR, and every story asserts it.
 */
export function AccountView({
  sections,
  email,
  activeTeamName,
  member,
  positions = [],
  isMemberLoading,
  isMemberError,
  isSaving,
  memberErrorCode,
  onSubmitProfile,
  onLogout,
}: AccountViewProps) {
  const has = (section: AccountSection) => sections.includes(section)

  return (
    <div>
      <h2 className="font-display text-2xl font-bold">Account</h2>

      <div className="mt-6 space-y-6">
        {has('email') && (
          <section>
            <SectionLabel>Account</SectionLabel>
            <div className={CARD}>
              <div className={ROW}>
                <Mail size={18} strokeWidth={1.9} className={ICON} aria-hidden="true" />
                <span className="font-medium">Email</span>
                <span className="ml-auto min-w-0 truncate text-muted-foreground" title={email}>
                  {email}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Display name + position are one form (EditProfileForm covers both rows). Present only with
            an Active Team; its loading/error shells are props-driven so they render with no network. */}
        {has('displayName') && (
          <section>
            <SectionLabel>Profile</SectionLabel>
            <div className={`${CARD} p-4`}>
              {isMemberLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
              {isMemberError && (
                <p className="text-sm text-red">Couldn't load your profile. Please try again.</p>
              )}
              {!isMemberLoading && !isMemberError && member && (
                <EditProfileForm
                  currentName={member.displayName}
                  positions={positions}
                  currentPositionId={member.position?.id ?? null}
                  isSaving={!!isSaving}
                  errorCode={memberErrorCode}
                  onSubmit={(name, positionId) => onSubmitProfile?.(name, positionId)}
                />
              )}
            </div>
          </section>
        )}

        {/* A single entry naming the Active Team (Slice 2 opens it into the Teams view). Rendered as a
            static row for now — no dead link — keeping Slice 1 focused on logout reachability. */}
        {has('teams') && (
          <section>
            <SectionLabel>Teams</SectionLabel>
            <div className={CARD}>
              <div className={ROW}>
                <Users size={18} strokeWidth={1.9} className={ICON} aria-hidden="true" />
                {activeTeamName ? (
                  <>
                    <span className="min-w-0 truncate font-medium">{activeTeamName}</span>
                    <span className="ml-auto rounded-full bg-green/10 px-2 py-0.5 text-xs font-semibold text-green">
                      Active
                    </span>
                  </>
                ) : (
                  <span className="font-medium text-muted-foreground">Join or create a team</span>
                )}
              </div>
            </div>
          </section>
        )}

        {has('appearance') && (
          <section>
            {/* ThemeToggle carries its own "Appearance" heading + description and a bordered control,
                so it needs no extra card or label — it already matches the settings-card treatment. */}
            <ThemeToggle />
          </section>
        )}

        {has('platformAdmin') && (
          <section>
            <SectionLabel>Platform admin</SectionLabel>
            <div className={CARD}>
              <div className="divide-y divide-border">
                <Link to="/admin/teams" className={ROW_INTERACTIVE}>
                  <ShieldCheck size={18} strokeWidth={1.9} className={ICON} aria-hidden="true" />
                  <span className="font-medium">Teams console</span>
                  <ChevronRight size={16} className="ml-auto shrink-0 text-muted-foreground/60" aria-hidden="true" />
                </Link>
                <Link to="/admin/creation-codes" className={ROW_INTERACTIVE}>
                  <KeyRound size={18} strokeWidth={1.9} className={ICON} aria-hidden="true" />
                  <span className="font-medium">Creation codes</span>
                  <ChevronRight size={16} className="ml-auto shrink-0 text-muted-foreground/60" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>
        )}

        <div className={CARD}>
          <button
            type="button"
            onClick={onLogout}
            className={`${ROW_INTERACTIVE} font-semibold text-red hover:bg-red/5`}
          >
            <LogOut size={18} strokeWidth={1.9} className="shrink-0 text-red" aria-hidden="true" />
            Log out
          </button>
        </div>
      </div>
    </div>
  )
}
