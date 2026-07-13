import { useMutation } from '@tanstack/react-query'
import { api } from './wirespec-client'

export type { Invitation } from './generated/model/Invitation'

export function useCreateInvitation() {
  return useMutation({
    mutationFn: async () => {
      const res = await api.CreateInvitation()
      return res.body
    },
  })
}
