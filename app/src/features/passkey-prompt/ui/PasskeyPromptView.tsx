import { useTranslation } from 'react-i18next'
import { Button } from '@shared/ui/button'

interface PasskeyPromptViewProps {
  onAdd: () => void
  onDismiss: () => void
  isPending?: boolean
  errorMessage?: string
}

/** The one-line "Add a passkey?" offer after a magic-link sign-in (ADR-0045). Same placement as UpdateToast. */
export function PasskeyPromptView({ onAdd, onDismiss, isPending = false, errorMessage }: PasskeyPromptViewProps) {
  const { t } = useTranslation()
  return (
    <div
      role="alert"
      className="fixed inset-x-0 bottom-[calc(6rem+env(safe-area-inset-bottom))] z-50 mx-auto flex w-fit max-w-[calc(100%-2rem)] flex-wrap items-center gap-3 rounded-2xl border border-border bg-card px-4 py-2 shadow-lg"
    >
      <span className="text-small">{errorMessage ?? t('passkeyPrompt.text')}</span>
      <Button size="sm" disabled={isPending} onClick={onAdd}>
        {isPending ? t('passkeyPrompt.adding') : t('passkeyPrompt.add')}
      </Button>
      <Button size="sm" variant="ghost" onClick={onDismiss}>
        {t('passkeyPrompt.notNow')}
      </Button>
    </div>
  )
}
