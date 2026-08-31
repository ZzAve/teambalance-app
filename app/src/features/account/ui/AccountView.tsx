import { Link } from '@tanstack/react-router'
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

/**
 * The adaptive Account settings list (ADR-0027 §2) — prop-only and presentational. The container
 * reads the session and the member profile; this renders the sections it is handed.
 *
 * **Log out is rendered unconditionally**, outside every other section including the profile
 * loading/error shells: it acts on the session, not on any data that might still be loading, so a
 * failed member fetch can never hide it. That invariant is the whole point of the ADR, and every
 * story asserts it.
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

      {has('email') && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-muted-foreground">Email</h3>
          <p className="mt-1 text-sm">{email}</p>
        </div>
      )}

      {/* Display name + position are one form (EditProfileForm covers both rows). Present only with
          an Active Team; its loading/error shells are props-driven so they render with no network. */}
      {has('displayName') && (
        <div className="mt-8">
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
      )}

      {has('appearance') && (
        <div className="mt-10 border-t border-border/40 pt-6">
          <ThemeToggle />
        </div>
      )}

      {/* A single entry naming the Active Team (Slice 2 opens it into the Teams view). Rendered as a
          static row for now — no dead link — keeping Slice 1 focused on logout reachability. */}
      {has('teams') && (
        <div className="mt-10 border-t border-border/40 pt-6">
          <h3 className="text-sm font-semibold text-muted-foreground">Teams</h3>
          <p className="mt-1 text-sm">{activeTeamName ?? 'Join or create a team'}</p>
        </div>
      )}

      {has('platformAdmin') && (
        <div className="mt-10 border-t border-border/40 pt-6">
          <h3 className="text-sm font-semibold text-muted-foreground">Platform admin</h3>
          <div className="mt-2 flex flex-col gap-2">
            <Link to="/admin/teams" className="text-sm font-semibold text-blue hover:underline">
              Teams
            </Link>
            <Link to="/admin/creation-codes" className="text-sm font-semibold text-blue hover:underline">
              Creation codes
            </Link>
          </div>
        </div>
      )}

      <div className="mt-10 border-t border-border/40 pt-6">
        <button
          type="button"
          onClick={onLogout}
          className="text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          Log out
        </button>
      </div>
    </div>
  )
}
