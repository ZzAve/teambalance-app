import { useState, type FormEvent, type ReactNode } from 'react'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@shared/ui/sheet'
import { MAX_TOP_UP_EUROS, MIN_TOP_UP_EUROS, TOP_UP_PRESETS, parseTopUpAmount } from '../lib/amount'

const CUSTOM_ERROR_ID = 'top-up-custom-error'

interface TopUpSheetViewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Whole euros, 1 to 500. */
  onPick: (euros: number) => void
  /** The link is being fetched; the amounts are disabled until it answers. */
  isPending?: boolean
  error?: string | null
  /** The element that opens the sheet; the sheet hands focus back to it on close. */
  trigger?: ReactNode
}

/** The amounts a member can top up the pool with: three presets and a custom whole-euro field. */
export function TopUpSheetView({ open, onOpenChange, onPick, isPending, error, trigger }: TopUpSheetViewProps) {
  const [customText, setCustomText] = useState('')
  const custom = parseTopUpAmount(customText)
  const customInvalid = customText.trim() !== '' && custom === null

  const submitCustom = (event: FormEvent) => {
    event.preventDefault()
    if (custom !== null) onPick(custom)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Top up the pool</SheetTitle>
          <SheetDescription>Pick an amount. You pay on the team's bunq.me page.</SheetDescription>
        </SheetHeader>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {TOP_UP_PRESETS.map((euros) => (
            <Button key={euros} variant="outline" size="lg" disabled={isPending} onClick={() => onPick(euros)}>
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
              aria-describedby={customInvalid ? CUSTOM_ERROR_ID : undefined}
              onChange={(e) => setCustomText(e.target.value)}
            />
            <Button type="submit" size="lg" disabled={isPending || custom === null}>
              {isPending ? 'Opening…' : 'Pay'}
            </Button>
          </div>
          {customInvalid && (
            <p id={CUSTOM_ERROR_ID} role="alert" className="text-small text-red">
              Enter a whole amount from €{MIN_TOP_UP_EUROS} to €{MAX_TOP_UP_EUROS}.
            </p>
          )}
        </form>

        {error && (
          <p role="alert" className="mt-3 text-small text-red">
            {error}
          </p>
        )}
      </SheetContent>
    </Sheet>
  )
}
