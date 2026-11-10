import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronRight, KeyRound, LogOut, Settings2, Shirt, ShieldCheck, UserRound, Users } from 'lucide-react'
import { personalPhotoUrl } from '@shared/api/photos'
import { Avatar } from '@shared/ui/avatar'
import { SectionLabel } from '@shared/ui/SectionLabel'
import { teamRoutes } from '@shared/lib/team-routes'
import type { AccountSection } from '../lib/account-sections'
import { useTranslation } from 'react-i18next'
import { CARD, ICON, ROW_INTERACTIVE } from './account-styles'

interface AccountViewProps {
  /** The visible rows for this session, from {@link accountSections}. */
  sections: AccountSection[]
  userId: string
  /** The platform name: the same in every team, unlike the name a team shows (ADR-0026). */
  displayName: string
  email: string
  /** The caller's own Personal Photo (ADR-0038); null when they have none. */
  personalPhotoVersion?: string | null
  /** The Active Team's name, or null when there is none (teamless). */
  activeTeamName?: string | null
  /** The Active Team's slug, for the link to the viewer's own member page. */
  activeTeamSlug?: string | null
  onLogout: () => void
}

/**
 * The Account tab's root (ADR-0027 §2): a card that says who is signed in and which team is
 * active, then one short row per scope. Each row opens the screen that holds that scope's settings,
 * so the list stays one screen high as features are added. Prop-only and presentational.
 *
 * It reads no member data. **Log out is rendered unconditionally**, in its own trailing card, so
 * nothing that loads or fails can hide it. That invariant is the whole point of the ADR, and every
 * story asserts it.
 */
export function AccountView({
  sections,
  userId,
  displayName,
  email,
  personalPhotoVersion,
  activeTeamName,
  activeTeamSlug,
  onLogout,
}: AccountViewProps) {
  const { t } = useTranslation()
  const has = (section: AccountSection) => sections.includes(section)

  return (
    <div className="space-y-6">
      <section aria-label={t('account.title')} className={`${CARD} flex items-center gap-4 p-4`}>
        <Avatar
          userId={userId}
          name={displayName}
          size="md"
          photoUrl={personalPhotoVersion ? personalPhotoUrl(personalPhotoVersion) : undefined}
        />
        <div className="min-w-0">
          <p className="truncate font-display text-title font-bold">{displayName}</p>
          <p className="truncate text-small text-muted-foreground" title={email}>{email}</p>
          <p
            className={`mt-1.5 inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-0.5 text-caption font-semibold ${
              activeTeamName ? 'bg-blue/10 text-blue' : 'bg-muted text-muted-foreground'
            }`}
          >
            {activeTeamName && <span className="size-1.5 shrink-0 rounded-full bg-green" aria-hidden="true" />}
            <span className="truncate">{activeTeamName ?? t('account.noTeam')}</span>
          </p>
        </div>
      </section>

      <nav aria-label={t('account.title')} className={`${CARD} divide-y divide-border`}>
        {has('signIn') && (
          <NavRow to="/account/sign-in" icon={<UserRound size={18} strokeWidth={1.9} />} title={t('account.signIn')} hint={t('account.signInHint')} />
        )}
        {has('teamProfile') && activeTeamName && activeTeamSlug && (
          <NavRow
            to={teamRoutes(activeTeamSlug).member(userId)}
            icon={<Shirt size={18} strokeWidth={1.9} />}
            title={t('account.teamProfile', { team: activeTeamName })}
            hint={t('account.teamProfileHint')}
          />
        )}
        {/* Opens the Teams "main view" at /select-team — switch · join · create (ADR-0027 §4). */}
        {has('teams') && (
          <NavRow
            to="/select-team"
            icon={<Users size={18} strokeWidth={1.9} />}
            title={t('account.teams')}
            hint={activeTeamName ? t('account.teamsActive', { team: activeTeamName }) : t('account.joinOrCreate')}
          />
        )}
        {has('preferences') && (
          <NavRow
            to="/account/preferences"
            icon={<Settings2 size={18} strokeWidth={1.9} />}
            title={t('account.preferences')}
            hint={t('account.preferencesHint')}
          />
        )}
      </nav>

      {has('platformAdmin') && (
        <section>
          <SectionLabel as="h3" className="mb-2 px-1 text-small">{t('account.platformAdmin')}</SectionLabel>
          <div className={`${CARD} divide-y divide-border`}>
            <NavRow to="/admin/teams" icon={<ShieldCheck size={18} strokeWidth={1.9} />} title={t('account.teamsConsole')} />
            <NavRow to="/admin/creation-codes" icon={<KeyRound size={18} strokeWidth={1.9} />} title={t('account.creationCodes')} />
          </div>
        </section>
      )}

      <div className={CARD}>
        <button
          type="button"
          onClick={onLogout}
          className={`${ROW_INTERACTIVE} font-semibold text-red-ink hover:bg-red/5`}
        >
          <LogOut size={18} strokeWidth={1.9} className="shrink-0" aria-hidden="true" />
          {t('account.logout')}
        </button>
      </div>
    </div>
  )
}

function NavRow({ to, icon, title, hint }: { to: string; icon: ReactNode; title: string; hint?: string }) {
  return (
    <Link to={to} className={ROW_INTERACTIVE}>
      <span className={ICON} aria-hidden="true">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{title}</span>
        {hint && <span className="block text-caption text-muted-foreground">{hint}</span>}
      </span>
      <ChevronRight size={16} className="shrink-0 text-muted-foreground/60" aria-hidden="true" />
    </Link>
  )
}
