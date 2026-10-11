import { createFileRoute, redirect } from '@tanstack/react-router'
import { authMeQueryOptions } from '@shared/api/auth'
import { queryClient } from '@shared/api/query-client'
import { isMoneyPoolOff } from '@shared/lib/money-pool-visibility'
import { teamRoutes } from '@shared/lib/team-routes'
import { MoneyPageView } from '@pages/money/ui/MoneyPageView'
import { MoneyPool } from '@widgets/money-pool/ui/MoneyPool'

export const Route = createFileRoute('/t/$slug/money/')({
  // A team that switched the money pool off has no Money page at all (ADR-0042). /t/$slug's gate has
  // already switched to this slug, so /me describes this Team.
  beforeLoad: async ({ params }) => {
    const user = await queryClient.ensureQueryData(authMeQueryOptions).catch(() => null)
    if (isMoneyPoolOff(user)) throw redirect({ to: teamRoutes(params.slug).events })
  },
  component: MoneyPage,
})

function MoneyPage() {
  return <MoneyPageView pool={<MoneyPool />} />
}
