import { createFileRoute } from '@tanstack/react-router'
import { MoneyTeaser } from '@widgets/money-teaser/ui/MoneyTeaser'

export const Route = createFileRoute('/t/$slug/money/')({
  component: MoneyPage,
})

/**
 * The Money tab. A coming-soon placeholder for the shared-money pool (Bunq integration to follow):
 * it renders the teaser widget and nothing else. The vertical padding lifts the centred card off
 * the header so it sits comfortably above the fold on a phone.
 */
function MoneyPage() {
  return (
    <div className="py-6">
      <MoneyTeaser />
    </div>
  )
}
