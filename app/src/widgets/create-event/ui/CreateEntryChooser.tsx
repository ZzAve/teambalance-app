import { CalendarDays, Repeat } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface CreateEntryChooserProps {
  onSingle: () => void
  onRecurring: () => void
}

/**
 * The "how do you want to add events?" chooser (prototype A's create-entry sheet): two option cards
 * — a single one-off event, or a recurring series. Purely presentational; the parent sheet decides
 * what each choice opens.
 */
export function CreateEntryChooser({ onSingle, onRecurring }: CreateEntryChooserProps) {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={onSingle}
        className="flex flex-col items-center gap-2.5 rounded-md border border-border bg-card p-5 text-center transition-all hover:-translate-y-0.5 hover:border-blue hover:shadow-md active:scale-[0.97]"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue/10 text-blue">
          <CalendarDays size={22} />
        </span>
        <span className="text-small font-semibold">{t('createEventSheet.single')}</span>
        <span className="text-caption leading-snug text-muted-foreground">{t('createEventSheet.singleHint')}</span>
      </button>

      <button
        type="button"
        onClick={onRecurring}
        className="flex flex-col items-center gap-2.5 rounded-md border border-border bg-card p-5 text-center transition-all hover:-translate-y-0.5 hover:border-green hover:shadow-md active:scale-[0.97]"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-green/10 text-green">
          <Repeat size={22} />
        </span>
        <span className="text-small font-semibold">{t('createEventSheet.recurring')}</span>
        <span className="text-caption leading-snug text-muted-foreground">{t('createEventSheet.recurringHint')}</span>
      </button>
    </div>
  )
}
