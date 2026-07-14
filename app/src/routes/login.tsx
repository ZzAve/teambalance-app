import { useState, type FormEvent } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useRequestMagicLink } from '@shared/api/auth'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const requestMagicLink = useRequestMagicLink()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    requestMagicLink.mutate(email, { onSuccess: () => setSent(true) })
  }

  if (sent) {
    return (
      <div className="mx-auto mt-16 max-w-sm text-center">
        <h1 className="font-display text-2xl font-bold">Check your email</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          If an account exists for <span className="font-medium text-foreground">{email}</span>, we've sent a magic
          link to sign in. Click it to continue.
        </p>
        <div className="mt-6 hidden [@media(hover:none)_and_(pointer:coarse)]:block">
          <Button asChild className="w-full">
            <a href="mailto:">Open email app →</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto mt-16 max-w-sm">
      <h1 className="font-display text-center text-2xl font-bold">
        Team<span className="text-green">Balance</span>
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">Sign in with your email — no password needed.</p>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <Button type="submit" disabled={requestMagicLink.isPending}>
          {requestMagicLink.isPending ? 'Sending...' : 'Send magic link'}
        </Button>
        {requestMagicLink.isError && (
          <p className="text-center text-sm text-red-500">Something went wrong. Please try again.</p>
        )}
      </form>
    </div>
  )
}
