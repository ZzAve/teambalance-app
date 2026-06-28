import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  userId: string | null
  displayName: string | null
  setUser: (userId: string, displayName: string) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      displayName: null,
      setUser: (userId, displayName) => {
        localStorage.setItem('userId', userId)
        set({ userId, displayName })
      },
    }),
    { name: 'teambalance-user' },
  ),
)
