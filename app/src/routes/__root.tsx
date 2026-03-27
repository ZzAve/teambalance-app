import { createRootRoute, Outlet, Link } from '@tanstack/react-router'
import { Providers } from '@app/providers'
import { UserSelector } from '@shared/ui/UserSelector'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <Providers>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/40 bg-card">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
            <Link to="/" className="font-display text-xl font-bold text-blue">
              Team<span className="text-green">Balance</span>
            </Link>
            <UserSelector />
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-4 py-6">
          <Outlet />
        </main>
      </div>
    </Providers>
  )
}
