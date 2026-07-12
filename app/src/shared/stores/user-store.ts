import { create } from 'zustand'
import type { AuthenticatedUser } from '@shared/api/auth'

interface UserState {
  userId: string | null
  displayName: string | null
  email: string | null
  setCurrentUser: (user: AuthenticatedUser | null) => void
}

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  displayName: null,
  email: null,
  setCurrentUser: (user) =>
    set({
      userId: user?.id ?? null,
      displayName: user?.displayName ?? null,
      email: user?.email ?? null,
    }),
}))
