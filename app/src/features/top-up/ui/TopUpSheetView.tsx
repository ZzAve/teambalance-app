import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@shared/ui/sheet'
import { MAX_TOP_UP_EUROS, MIN_TOP_UP_EUROS, TOP_UP_PRESETS, parseTopUpAmount } from '../lib/amount'

const ERROR_CLASS = 'text-small text-red-ink'

interface TopUpSheetViewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Whole euros, 1 to 500. */
  onPick: (euros: number) => void
  /** The link is being fetched; the amounts are inert until it answers. */
  isPending?: boolean
  error?: string | null
  /** The element that opens the sheet; the sheet hands focus back to it on close. */
  trigger?: ReactNode
}

/** The amounts a member can top up the pool with: three presets and a custom whole-euro field. */
export function TopUpSheetView({ open, onOpenChange, onPick, isPending, error, trigger }: TopUpSheetViewProps) {
  const customErrorId = useId()
  const [customText, setCustomText] = useState('')
  const custom = parseTopUpAmount(customText)
  const customInvalid = customText.trim() !== '' && custom === null

  const submitCustom = (event: FormEvent) => {
    event.preventDefault()
    if (custom !== null && !isPending) onPick(custom)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Top up the pool</SheetTitle>
          <SheetDescription>Pick an amount. You pay on the team's bunq.me page.</SheetDescription>
        </SheetHeader>

        <div role="group" aria-label="Amounts" className="mt-4 grid grid-cols-3 gap-3">
          {TOP_UP_PRESETS.map((euros) => (
            // aria-disabled, not disabled: a focused button that becomes disabled drops focus to <body>, outside
            // the modal dialog. The click guard makes it inert while pending.
            <Button
              key={euros}
              variant="outline"
              size="lg"
              aria-disabled={isPending}
              className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
              onClick={() => !isPending && onPick(euros)}
            >
              €{euros}
            </Button>
          ))}
        </div>

        <form className="mt-5 flex flex-col gap-1" onSubmit={submitCustom}>
          <Label htmlFor="top-up-custom">Other amount (€)</Label>
          <div className="flex gap-3">
            <Input
              id="top-up-custom"
              inputMode="numeric"
              value={customText}
              placeholder={`${MIN_TOP_UP_EUROS} to ${MAX_TOP_UP_EUROS}`}
              className="h-11"
              aria-invalid={customInvalid}
              aria-describedby={customInvalid ? customErrorId : undefined}
              onChange={(e) => setCustomText(e.target.value)}
            />
            {/* Pending is aria-disabled, like the presets, so focus stays on Pay; an amount that is not payable
                is still disabled, since the member has not pressed it. Enter in the field submits too, hence
                the guard in submitCustom. */}
            <Button
              type="submit"
              size="lg"
              disabled={!isPending && custom === null}
              aria-disabled={isPending}
              className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            >
              {isPending ? 'Opening…' : 'Pay'}
            </Button>
          </div>
          {/* Mounted before it has anything to say: a live region added together with its text is not announced. */}
          <div aria-live="polite" aria-atomic="true">
            {customInvalid && (
              <p id={customErrorId} className={ERROR_CLASS}>
                Enter a whole amount from €{MIN_TOP_UP_EUROS} to €{MAX_TOP_UP_EUROS}.
              </p>
            )}
          </div>
        </form>

        {error && (
          <p role="alert" className={`mt-3 ${ERROR_CLASS}`}>
            {error}
          </p>
        )}
      </SheetContent>
    </Sheet>
  )
}
