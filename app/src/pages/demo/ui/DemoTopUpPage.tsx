import { DemoTopUpView } from './DemoTopUpView'

export function DemoTopUpPage() {
  return <DemoTopUpView onBack={() => window.history.back()} />
}
