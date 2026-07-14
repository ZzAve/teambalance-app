import { test as setup } from '@playwright/test'
import { authenticateViaApi, STORAGE_STATE, STORAGE_STATE_LOGOUT } from './helpers'

// Logs in via the API and saves the session as storageState, so authed specs skip the login UI
// (which login.spec.ts already covers). The request/verify calls go through the Vite origin
// (baseURL + /api proxy) so the session cookie lands on the frontend origin the browser uses;
// only the token fetch talks to the backend directly.
//
// Two sessions are minted here, in the SERIAL setup phase, so they never race each other — nor
// login.spec.ts — for the single seeded user's magic-link token:
//   - STORAGE_STATE:        the shared session every authed spec reuses (attendance, etc.).
//   - STORAGE_STATE_LOGOUT: a disposable session the logout spec tears down without touching the
//                           shared one (each verify creates an independent server-side session).
setup('authenticate as the seeded e2e user', async ({ request }) => {
  await authenticateViaApi(request)
  await request.storageState({ path: STORAGE_STATE })
})

setup('mint a disposable session for the logout spec', async ({ request }) => {
  await authenticateViaApi(request)
  await request.storageState({ path: STORAGE_STATE_LOGOUT })
})
