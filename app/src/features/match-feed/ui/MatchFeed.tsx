import { useState } from 'react'
import {
  MatchFeedError,
  useConfigureMatchFeed,
  useMatchFeed,
  useMatchFeedTeams,
  useRemoveMatchFeed,
  type FeedMatch,
  type MatchMismatch,
} from '@shared/api/match-feed'
import { ApplyMatchDialog } from './ApplyMatchDialog'
import { CreateEventFromMatchDialog } from './CreateEventFromMatchDialog'
import { MatchFeedView } from './MatchFeedView'

const codeOf = (error: Error | null) => (error ? (error instanceof MatchFeedError ? error.code : 'GENERIC') : null)

/** Container for the match feed settings: wires the feed query and its mutations to MatchFeedView. */
export function MatchFeed() {
  const { data: status, isLoading, error } = useMatchFeed()
  const findTeams = useMatchFeedTeams()
  const configure = useConfigureMatchFeed()
  const remove = useRemoveMatchFeed()
  const [applying, setApplying] = useState<MatchMismatch | null>(null)
  const [creating, setCreating] = useState<FeedMatch | null>(null)

  return (
    <>
      <MatchFeedView
        status={status}
        isLoading={isLoading}
        isError={!!error}
        teams={findTeams.data}
        isFindingTeams={findTeams.isPending}
        isSaving={configure.isPending}
        isRemoving={remove.isPending}
        error={codeOf(configure.error) ?? codeOf(findTeams.error)}
        onFindTeams={(feedUrl) => {
          configure.reset()
          findTeams.mutate(feedUrl)
        }}
        onSave={(feedUrl, teamName) => configure.mutate({ feedUrl, teamName }, { onSuccess: () => findTeams.reset() })}
        onRemove={() => remove.mutate()}
        onApply={setApplying}
        onCreate={setCreating}
      />
      <ApplyMatchDialog mismatch={applying} teamName={status?.teamName ?? ''} onClose={() => setApplying(null)} />
      <CreateEventFromMatchDialog match={creating} onClose={() => setCreating(null)} />
    </>
  )
}
