import { MatchFeedError, useConfigureMatchFeed, useMatchFeed, useMatchFeedTeams, useRemoveMatchFeed } from '@shared/api/match-feed'
import { MatchFeedView } from './MatchFeedView'

const codeOf = (error: Error | null) => (error ? (error instanceof MatchFeedError ? error.code : 'GENERIC') : null)

/** Container for the match feed settings: wires the feed query and its mutations to MatchFeedView. */
export function MatchFeed() {
  const { data: status, isLoading, error } = useMatchFeed()
  const findTeams = useMatchFeedTeams()
  const configure = useConfigureMatchFeed()
  const remove = useRemoveMatchFeed()

  return (
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
    />
  )
}
