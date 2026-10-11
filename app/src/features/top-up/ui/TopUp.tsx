import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { fetchTopUpLink } from '@shared/api/money-pool'
import { TopUpUnavailableError } from '@shared/api/top-up-link'
import { Button } from '@shared/ui/button'
import { TopUpSheetView } from './TopUpSheetView'

/**
 * Container for topping up the pool: the button, and the sheet it opens. Picking an amount fetches
 * the bunq.me link and leaves the app for it. Pure wiring, covered by the prop-only sheet's story.
 */
export function TopUp() {
  const [open, setOpen] = useState(false)
  const topUp = useMutation({
    mutationFn: fetchTopUpLink,
    onSuccess: (url) => window.location.assign(url),
  })

  return (
    <TopUpSheetView
      trigger={<Button>Top up</Button>}
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) topUp.reset()
      }}
      onPick={(euros) => topUp.mutate(euros)}
      isPending={topUp.isPending}
      error={topUp.error && errorMessage(topUp.error)}
    />
  )
}

function errorMessage(error: Error) {
  return error instanceof TopUpUnavailableError
    ? "Top-up isn't available for this team right now."
    : "Couldn't open the payment page. Please try again."
}
