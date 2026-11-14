import { TeamRequestError, useMyTeamRequest, useSubmitTeamRequest } from '@shared/api/team-requests'
import { RequestTeamView } from './RequestTeamView'

/** Container: wires the latest-request query and the submit mutation to the View. Covered by e2e/IT, not a story (ADR-0017). */
export function RequestTeam({ onOpenCreateTeam }: { onOpenCreateTeam: (prefill?: { code: string; name: string }) => void }) {
  const { data: request, isLoading } = useMyTeamRequest()
  const submit = useSubmitTeamRequest()

  return (
    <RequestTeamView
      request={request}
      isLoading={isLoading}
      isSubmitting={submit.isPending}
      errorCode={submit.error instanceof TeamRequestError ? submit.error.code : null}
      onSubmit={(values) => submit.mutate(values)}
      onOpenCreateTeam={onOpenCreateTeam}
    />
  )
}
