import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { authMeQueryOptions } from '@shared/api/auth'
import { LOGIN_PATH } from '@shared/api/auth-redirect'
import { queryClient } from '@shared/api/query-client'
import { CreateTeamError, useCreateTeam } from '@shared/api/teams'
import { teamRoutes } from '@shared/lib/team-routes'
import { CreateTeamForm } from '@features/create-team/ui/CreateTeamForm'
import { Trans, useTranslation } from 'react-i18next'

export const Route = createFileRoute('/create-team/')({
  // Authenticated callers only: ADR-0023 lifted ADR-0019 §3's teamless requirement, so someone
  // already playing in a Team can start another.
  beforeLoad: async () => {
    const user = await queryClient.ensureQueryData(authMeQueryOptions).catch(() => null)
    if (!user) throw redirect({ to: LOGIN_PATH })
  },
  // The approved-request mail and card link here with the code and name filled in (ADR-0047).
  validateSearch: (search: Record<string, unknown>): { code?: string; name?: string } => ({
    code: typeof search.code === 'string' ? search.code : undefined,
    name: typeof search.name === 'string' ? search.name : undefined,
  }),
  component: CreateTeamPage,
})

function CreateTeamPage() {
  const navigate = useNavigate()
  const client = useQueryClient()
  const createTeam = useCreateTeam()
  const { t } = useTranslation()
  const { code, name } = Route.useSearch()
  const error = createTeam.error instanceof CreateTeamError ? createTeam.error : null

  return (
    // Full column width, like the Account page this is reached from.
    <div>
      <h1 className="font-display text-title font-bold">{t('createTeam.title')}</h1>
      <p className="mt-2 text-small text-muted-foreground">
        {t('createTeam.intro')}
      </p>
      <p className="mt-2 text-small text-muted-foreground">
        {t('createTeam.inviteOnly')}
      </p>
      <p className="mt-1 text-small text-muted-foreground">
        <Trans
          i18nKey="createTeam.noCode"
          components={{
            mail: (
              <a
                href="mailto:teams@teambalance.nl?subject=Request%20a%20team%20on%20TeamBalance"
                className="text-blue underline"
              />
            ),
          }}
        />
      </p>
      <div className="mt-6">
        <CreateTeamForm
          isPending={createTeam.isPending}
          error={error}
          initialName={name}
          initialCreationCode={code}
          onSubmit={(values) =>
            createTeam.mutate(values, {
              onSuccess: async (team) => {
                if (!team) return
                // The server made the new Team Active (ADR-0023 §4), so a founder who came from
                // another Team is now in a different tenant.
                await client.resetQueries()
                // A brand-new team is empty: the roster is where the owner starts (invite people,
                // then curate positions under team settings), not the events home.
                navigate({ to: teamRoutes(team.slug).team })
              },
            })
          }
        />
      </div>
    </div>
  )
}
