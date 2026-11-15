import { useState } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { useBulletinPosts } from '@shared/api/bulletin'
import { teamRoutes, teamSlugFromPath } from '@shared/lib/team-routes'
import {
  browserPreferenceStorage,
  readPreference,
  teamPreferenceKey,
  writePreference,
} from '@shared/preferences/preferences'
import { postTitle } from '@shared/lib/post-title'
import { stripSignature } from '../lib/strip-signature'
import { PinnedPostsStripView } from './PinnedPostsStripView'

const asString = (raw: unknown) => (typeof raw === 'string' ? raw : null)

/**
 * The pinned-posts strip in the app shell (ADR-0048): on every team page except get-started, for the
 * pinned Posts that are not deleted. Closing it stores the pins' signature per team, so it stays
 * closed across pages and reloads and opens again when the pins change.
 */
export function PinnedPostsStrip() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const slug = teamSlugFromPath(pathname)
  const onTeamPage = slug !== null && pathname.replace(/\/$/, '') !== teamRoutes(slug).getStarted
  const { data: posts } = useBulletinPosts({ enabled: onTeamPage })
  const key = slug ? teamPreferenceKey(slug, 'pinnedStripClosed') : null
  const [closed, setClosed] = useState(() => (key ? readPreference(browserPreferenceStorage(), key, asString) : null))

  if (!onTeamPage || !posts || !key) return null
  const pins = posts.filter((post) => post.pinned && !post.deletedAt)
  const signature = stripSignature(pins)
  if (pins.length === 0 || closed === signature) return null

  return (
    <PinnedPostsStripView
      posts={pins.map((post) => ({ id: post.id, title: postTitle(post.markdown), markdown: post.markdown }))}
      onClose={() => {
        writePreference(browserPreferenceStorage(), key, signature)
        setClosed(signature)
      }}
    />
  )
}
