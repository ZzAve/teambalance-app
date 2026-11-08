import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import { HeaderPrototypePage, type HeaderVariant } from '@pages/prototype-header/ui/HeaderPrototypePage'

// PROTOTYPE ONLY (mobile header structure). Dev server only; production builds show not-found.
export const Route = createFileRoute('/prototype-header')({
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound()
  },
  validateSearch: (s: Record<string, unknown>): { variant: HeaderVariant; page: 'top' | 'nested' } => ({
    variant: s.variant === 'B' || s.variant === 'C' ? s.variant : 'A',
    page: s.page === 'nested' ? 'nested' : 'top',
  }),
  component: PrototypeHeaderRoute,
})

function PrototypeHeaderRoute() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  return (
    <HeaderPrototypePage
      variant={search.variant}
      page={search.page}
      onChange={(next) => navigate({ search: { ...search, ...next }, replace: true })}
    />
  )
}
