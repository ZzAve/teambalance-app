import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { authMeQueryOptions } from '@shared/api/auth'
import { queryClient } from '@shared/api/query-client'
import { CreateTeamError, useCreateTeam } from '@shared/api/teams'
import { teamRoutes } from '@shared/lib/team-routes'
import { CreateTeamForm } from '@features/create-team/ui/CreateTeamForm'

export const Route = createFileRoute('/create-team/')({
  // Authenticated callers only. There is no longer a teamless requirement: ADR-0019 §3's
  // one-team-per-user guard was lifted by ADR-0021 (#143), so someone already playing in a Team can
  // start another from the switcher. The root gate exempts /create-team from its has-any-team
  // redirect, which is what lets a teamless caller reach it at all.
  beforeLoad: async () => {
    const user = await queryClient.ensureQueryData(authMeQueryOptions).catch(() => null)
    if (!user) throw redirect({ to: '/login' })
  },
  component: CreateTeamPage,
})

function CreateTeamPage() {
  const navigate = useNavigate()
  const client = useQueryClient()
  const createTeam = useCreateTeam()
  const error = createTeam.error instanceof CreateTeamError ? createTeam.error : null

  return (
    <div className="mx-auto mt-10 max-w-sm">
      <h1 className="font-display text-2xl font-bold">Create your team</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter your creation code and name your team — you'll be its admin.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Starting a team is invite-only while we're getting established. Got a creation code? Enter it
        below.
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Don't have one?{' '}
        <a
          href="mailto:teams@teambalance.nl?subject=Request%20a%20team%20on%20TeamBalance"
          className="text-blue underline"
        >
          Email teams@teambalance.nl
        </a>{' '}
        and we'll help you get started.
      </p>
      <div className="mt-6">
        <CreateTeamForm
          isPending={createTeam.isPending}
          error={error}
          onSubmit={(values) =>
            createTeam.mutate(values, {
              onSuccess: async (team) => {
                if (!team) return
                // Feed the X-Team-Id test shim; prod resolves the tenant from the session.
                localStorage.setItem('teamId', team.id)
                // The server already made the new Team the founder's Active Team (ADR-0021 §4), so
                // reset the cache rather than merely refetching /me: a founder who came from another
                // Team is now in a different tenant, and every cached tenant-scoped query belongs to
                // the one they left. This is the same obligation /t/$slug's gate carries on a switch.
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
