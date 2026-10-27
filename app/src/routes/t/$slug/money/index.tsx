import { createFileRoute } from '@tanstack/react-router'
import { MoneyPageView } from '@pages/money/ui/MoneyPageView'
import { MoneyPool } from '@widgets/money-pool/ui/MoneyPool'

export const Route = createFileRoute('/t/$slug/money/')({
  component: MoneyPage,
})

function MoneyPage() {
  return <MoneyPageView pool={<MoneyPool />} />
}
