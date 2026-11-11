import {
  TeamRequestError,
  useApproveTeamRequest,
  useRejectTeamRequest,
  useTeamRequests,
} from '@shared/api/team-requests'
import { TeamRequestsView } from './TeamRequestsView'

/** Container: wires the admin queries and mutations to the View; a refetch follows each decision. Covered by IT, not a story (ADR-0017). */
export function TeamRequests() {
  const { data, isLoading, error } = useTeamRequests()
  const approve = useApproveTeamRequest()
  const reject = useRejectTeamRequest()

  // 403 renders nothing: ManageCreationCodes on the same page shows the no-access shell.
  if (error instanceof TeamRequestError && error.code === 'FORBIDDEN') return null

  const failure = [approve.error, reject.error].find((e): e is TeamRequestError => e instanceof TeamRequestError)

  return (
    <TeamRequestsView
      requests={data}
      isLoading={isLoading}
      isError={!!error}
      isSaving={approve.isPending || reject.isPending}
      errorCode={failure?.code ?? null}
      // Clear the other action's old error so the alert always belongs to the latest decision.
      onApprove={(r) => {
        reject.reset()
        approve.mutate({ id: r.id })
      }}
      onReject={(r, reason) => {
        approve.reset()
        reject.mutate({ id: r.id, reason })
      }}
    />
  )
}
