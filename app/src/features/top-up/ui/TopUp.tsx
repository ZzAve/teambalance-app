import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { fetchTopUpLink } from '@shared/api/money-pool'
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
    <>
      <Button onClick={() => setOpen(true)}>Top up</Button>
      <TopUpSheetView
        open={open}
        onOpenChange={setOpen}
        onPick={(euros) => topUp.mutate(euros)}
        isPending={topUp.isPending}
        error={topUp.error ? "Couldn't open the payment page. Please try again." : null}
      />
    </>
  )
}
