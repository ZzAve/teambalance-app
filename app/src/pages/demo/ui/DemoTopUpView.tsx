import { Button } from '@shared/ui/button'

interface DemoTopUpViewProps {
  onBack: () => void
}

/** What the demo build's Top up button opens in place of a bunq.me payment page (ADR-0043). */
export function DemoTopUpView({ onBack }: DemoTopUpViewProps) {
  return (
    <div className="mx-auto mt-16 max-w-sm text-center">
      <h1 className="font-display text-title font-bold">Dit is een demo — er wordt niets betaald</h1>
      <p className="mt-2 text-small text-muted-foreground">In een echt team opent hier de betaalpagina van bunq.me.</p>
      <Button className="mt-6 w-full" onClick={onBack}>
        Terug naar TeamBalance
      </Button>
    </div>
  )
}
