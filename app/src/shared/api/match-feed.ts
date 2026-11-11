import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { MatchFeedStatus } from './generated/model/MatchFeedStatus'
import { api } from './wirespec-client'

export type { MatchFeedStatus } from './generated/model/MatchFeedStatus'
export type { MatchMismatch } from './generated/model/MatchMismatch'
export type { FeedMatch } from './generated/model/FeedMatch'
export type { MatchDifference } from './generated/model/MatchDifference'

export type MatchFeedErrorCode = 'INVALID_FEED_URL' | 'UNKNOWN_FEED_TEAM' | 'FEED_UNAVAILABLE' | 'GENERIC'

export class MatchFeedError extends Error {
  constructor(readonly code: MatchFeedErrorCode) {
    super(code)
  }
}

function errorOf(res: { status: number; body?: unknown }): MatchFeedError {
  if (res.status === 503) return new MatchFeedError('FEED_UNAVAILABLE')
  const code = (res.body as { code?: string } | undefined)?.code
  if (code === 'INVALID_FEED_URL' || code === 'UNKNOWN_FEED_TEAM') return new MatchFeedError(code)
  return new MatchFeedError('GENERIC')
}

// The team's match feed and where its events differ from it. Admin-only. Null when the team has no feed.
export const matchFeedQueryOptions = queryOptions({
  queryKey: ['match-feed'],
  queryFn: async (): Promise<MatchFeedStatus | null> => {
    const res = await api.getMatchFeed()
    return res.status === 404 ? null : (res.body as MatchFeedStatus)
  },
})

export function useMatchFeed(enabled = true) {
  return useQuery({ ...matchFeedQueryOptions, enabled })
}

/** The team names in a feed, so the admin can pick theirs. */
export function useMatchFeedTeams() {
  return useMutation({
    mutationFn: async (feedUrl: string) => {
      const res = await api.listMatchFeedTeams({ body: { feedUrl } })
      if (res.status !== 200) throw errorOf(res)
      return res.body.teams
    },
  })
}

export function useConfigureMatchFeed() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ feedUrl, teamName }: { feedUrl: string; teamName: string }) => {
      const res = await api.configureMatchFeed({ body: { feedUrl, teamName } })
      if (res.status !== 200) throw errorOf(res)
      return res.body
    },
    onSuccess: (status) => queryClient.setQueryData(matchFeedQueryOptions.queryKey, status),
  })
}

export function useRemoveMatchFeed() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.removeMatchFeed(),
    onSuccess: () => queryClient.setQueryData(matchFeedQueryOptions.queryKey, null),
  })
}
