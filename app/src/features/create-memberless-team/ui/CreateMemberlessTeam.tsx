import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useCreateMemberlessTeam, type CreateTeamError } from '@shared/api/teams'
import { CreateMemberlessTeamView } from './CreateMemberlessTeamView'

/**
 * Container for the console's memberless-create form (ADR-0024 §5): wires the create mutation to the
 * View and, on success, invalidates the platform team list so the new (empty) team appears below,
 * ready to enter via act-as. Pure wiring, covered by e2e rather than a story (ADR-0017).
 */
export function CreateMemberlessTeam() {
  const queryClient = useQueryClient()
  const createTeam = useCreateMemberlessTeam()
  const [createdName, setCreatedName] = useState<string | null>(null)

  return (
    <CreateMemberlessTeamView
      isPending={createTeam.isPending}
      error={createTeam.error as CreateTeamError | null}
      createdName={createdName}
      onSubmit={({ name, slug }) =>
        createTeam.mutate(
          { name, slug },
          {
            onSuccess: (team) => {
              setCreatedName(team.name)
              queryClient.invalidateQueries({ queryKey: ['platform', 'teams'] })
            },
          },
        )
      }
    />
  )
}
