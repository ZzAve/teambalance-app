import { useQuery } from '@tanstack/react-query'
import { Button } from '@shared/ui/button'

/**
 * Dev-build-only shortcut on the "check your email" screen: reads the token the dev API just
 * "sent" from its dev/e2e-only `/internal/e2e/magic-link-token` endpoint and links straight to
 * the normal verify page. Render it only behind `import.meta.env.DEV`, which `vite build` turns
 * into `false`, so this component never reaches a production bundle.
 */
export function DevMagicLink({ email }: { email: string }) {
  const { data: token } = useQuery({
    queryKey: ['dev-magic-link', email],
    queryFn: async () => {
      const res = await fetch(`/internal/e2e/magic-link-token?email=${encodeURIComponent(email)}`)
      if (!res.ok) throw new Error(`No dev magic link (${res.status}); is the API on the dev profile?`)
      return ((await res.json()) as { token: string }).token
    },
    retry: false,
  })

  if (!token) return null
  return (
    <Button asChild variant="outline" className="mt-6 w-full">
      {/* eslint-disable-next-line i18next/no-literal-string -- dev-build-only, never shown to users */}
      <a href={`/auth/verify?token=${encodeURIComponent(token)}`}>Open magic link (dev)</a>
    </Button>
  )
}
