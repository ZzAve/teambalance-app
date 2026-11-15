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

/** Admin-only: replaces a Post's Markdown; the API records who edited it and when. */
export function useUpdateBulletinPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, markdown }: { id: string; markdown: string }) => {
      const res = await api.updateBulletinPost({ id, body: { markdown } })
      if (res.status !== 200) throw new Error(`Edit refused: ${res.status}`)
      return res.body
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['bulletin-posts'] })
    },
  })
}

/** Admin-only: hides a Post from Members; it can be restored for 14 days. */
export function useDeleteBulletinPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.deleteBulletinPost({ id })
      if (res.status !== 204) throw new Error(`Delete refused: ${res.status}`)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['bulletin-posts'] })
    },
  })
}

/** Admin-only: shows a deleted Post again. */
export function useRestoreBulletinPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.restoreBulletinPost({ id })
      if (res.status !== 200) throw new Error(`Restore refused: ${res.status}`)
      return res.body
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['bulletin-posts'] })
    },
  })
}
