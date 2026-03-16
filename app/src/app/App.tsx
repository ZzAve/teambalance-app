import { Providers } from './providers'

export function App() {
  return (
    <Providers>
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-md px-4 py-8">
          <h1 className="font-display text-4xl font-bold text-blue">
            Team<span className="text-green">Balance</span>
          </h1>
          <p className="mt-4 text-text-secondary">
            Foundation is up and running.
          </p>
        </main>
      </div>
    </Providers>
  )
}
