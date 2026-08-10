import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { authMeQueryOptions } from '@shared/api/auth'
import { queryClient } from '@shared/api/query-client'
import { CreateTeamError, useCreateTeam } from '@shared/api/teams'
import { CreateTeamForm } from '@features/create-team/ui/CreateTeamForm'

export const Route = createFileRoute('/create-team/')({
  // Reachable only by an authenticated, teamless user. A user who already has a team is bounced home
  // (the root gate exempts /create-team from its has-a-team redirect, so this self-guard owns that).
  beforeLoad: async () => {
    const user = await queryClient.ensureQueryData(authMeQueryOptions).catch(() => null)
    if (!user) throw redirect({ to: '/login' })
    if (user.team) throw redirect({ to: '/' })
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
      <div className="mt-6">
        <CreateTeamForm
          isPending={createTeam.isPending}
          error={error}
          onSubmit={(values) =>
            createTeam.mutate(values, {
              onSuccess: async (team) => {
                if (!team) return
                // Feed the X-Team-Id test shim + future multi-team; prod resolves tenant from session.
                localStorage.setItem('teamId', team.id)
                // Refetch /auth/me so `team` is non-null before we navigate — both gates then pass.
                await client.invalidateQueries({ queryKey: ['auth', 'me'] })
                // A brand-new team is empty: the team roster is where the owner starts (invite
                // people, then curate positions under /team/settings), not the events home.
                navigate({ to: '/team' })
              },
              onError: async (err) => {
                // Already-in-team race: send the user into the team they already have.
                if (err instanceof CreateTeamError && err.code === 'ALREADY_IN_TEAM') {
                  await client.invalidateQueries({ queryKey: ['auth', 'me'] })
                  navigate({ to: '/' })
                }
              },
            })
          }
        />
      </div>
    </div>
  )
}
