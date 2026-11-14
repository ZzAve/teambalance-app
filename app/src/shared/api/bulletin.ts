import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './wirespec-client'

export type { BulletinPost } from './generated/model/BulletinPost'

/** The Team's Bulletin Board, newest first (ADR-0048). */
export function useBulletinPosts() {
  return useQuery({
    queryKey: ['bulletin-posts'],
    queryFn: async () => {
      const res = await api.listBulletinPosts()
      return res.body.posts
    },
  })
}

/** Admin-only: posts Markdown on the board. */
export function useCreateBulletinPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (markdown: string) => {
      const res = await api.createBulletinPost({ body: { markdown } })
      if (res.status !== 201) throw new Error(`Post refused: ${res.status}`)
      return res.body
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['bulletin-posts'] })
    },
  })
}
