interface PinnedPost {
  id: string
  postedAt: string
  edits: { editedAt: string }[]
}

/**
 * Names the current set of pinned Posts and their latest change. A Member who closes the strip stores
 * this; the strip opens again when it no longer matches: a Post pinned, unpinned or edited since.
 */
export function stripSignature(pins: PinnedPost[]): string {
  return pins
    .map((post) => `${post.id}@${post.edits.at(-1)?.editedAt ?? post.postedAt}`)
    .sort()
    .join('|')
}
