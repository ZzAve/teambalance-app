import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { fetchTopUpLink } from '@shared/api/money-pool'
import { TopUpUnavailableError, topUpDestination } from '@shared/api/top-up-link'
import { Button } from '@shared/ui/button'
import { i18n } from '@shared/i18n/i18n'
import { TopUpSheetView } from './TopUpSheetView'

/**
 * Container for topping up the pool: the button, and the sheet it opens. Picking an amount fetches
 * the bunq.me link and leaves the app for it. Pure wiring, covered by the prop-only sheet's story.
 */
export function TopUp() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const topUp = useMutation({ mutationFn: fetchTopUpLink })

  return (
    <TopUpSheetView
      trigger={<Button size="lg">{t('topUp.button')}</Button>}
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) topUp.reset()
      }}
      // The navigation is a mutate callback, not a useMutation option: closing the sheet resets the mutation,
      // which drops mutate callbacks, so a link that arrives after the member closed the sheet goes nowhere.
      onPick={(euros) => topUp.mutate(euros, { onSuccess: (url) => window.location.assign(topUpDestination(url, !!import.meta.env.VITE_DEMO)) })}
      isPending={topUp.isPending}
      error={topUp.error && errorMessage(topUp.error)}
    />
  )
}

function errorMessage(error: Error) {
  return error instanceof TopUpUnavailableError
    ? i18n.t('topUp.unavailable')
    : i18n.t('topUp.failed')
}
