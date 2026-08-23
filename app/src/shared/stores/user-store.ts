import { create } from 'zustand'
import type { AuthenticatedUser } from '@shared/api/auth'

interface UserState {
  userId: string | null
  displayName: string | null
  email: string | null
  /** The caller's Role **in the Active Team** — null when no Team is active (ADR-0023 §4). */
  role: string | null
  /** The Active Team's name, or null when none is active. */
  teamName: string | null
  /** The Active Team's slug — the address its screens live under (`/t/:slug/…`). */
  teamSlug: string | null
  isPlatformAdmin: boolean
  setCurrentUser: (user: AuthenticatedUser | null) => void
}

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  displayName: null,
  email: null,
  role: null,
  teamName: null,
  teamSlug: null,
  isPlatformAdmin: false,
  // Read off `activeTeam`, never `teams`: the list's order says nothing about which is active.
  setCurrentUser: (user) =>
    set({
      userId: user?.id ?? null,
      displayName: user?.displayName ?? null,
      email: user?.email ?? null,
      role: user?.role ?? null,
      teamName: user?.activeTeam?.name ?? null,
      teamSlug: user?.activeTeam?.slug ?? null,
      isPlatformAdmin: user?.isPlatformAdmin ?? false,
    }),
}))
