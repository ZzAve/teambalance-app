import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  useBulletinPosts,
  useCreateBulletinPost,
  useDeleteBulletinPost,
  useRestoreBulletinPost,
  useUpdateBulletinPost,
} from '@shared/api/bulletin'
import { useMembers } from '@shared/api/members'
import { BulletinBoardView } from './BulletinBoardView'

/**
 * Container for the Bulletin Board (ADR-0048): wires the posts query, the create, edit, delete and
 * restore mutations * and the Roster (for author and editor names) to BulletinBoardView. Pure wiring; the View's stories cover its states.
 * No e2e: an Admin write inside the tenant, like managing Positions, adds no seam the existing flows miss.
 */
export function BulletinBoard({ isAdmin }: { isAdmin: boolean }) {
  const { t } = useTranslation()
  const { data: posts, isLoading, error } = useBulletinPosts()
  const { data: members } = useMembers()
  const createPost = useCreateBulletinPost()
  const updatePost = useUpdateBulletinPost()
  const deletePost = useDeleteBulletinPost()
  const restorePost = useRestoreBulletinPost()

  const nameOf = (userId: string) =>
    members?.find((member) => member.userId === userId)?.displayName ?? t('bulletin.formerMember')

  return (
    <BulletinBoardView
      posts={(posts ?? []).map((post) => ({
        ...post,
        authorName: nameOf(post.authorId),
        edits: post.edits.map((edit) => ({ editorName: nameOf(edit.editorId), editedAt: edit.editedAt })),
      }))}
      isAdmin={isAdmin}
      isLoading={isLoading}
      isError={!!error}
      onCreate={(markdown) => createPost.mutateAsync(markdown)}
      onUpdate={(id, markdown) => updatePost.mutateAsync({ id, markdown })}
      onDelete={(id) => deletePost.mutate(id, { onError: () => toast.error(t('bulletin.deleteFailed')) })}
      onRestore={(id) => restorePost.mutate(id, { onError: () => toast.error(t('bulletin.restoreFailed')) })}
    />
  )
}
