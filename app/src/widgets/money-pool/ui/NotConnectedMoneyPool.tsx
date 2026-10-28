import { PlusCircle, Receipt, Wallet, type LucideIcon } from 'lucide-react'
import { PiggyBankArt } from './PiggyBankArt'

interface Pillar {
  icon: LucideIcon
  title: string
  blurb: string
}

const PILLARS: Pillar[] = [
  { icon: Wallet, title: 'One shared pot', blurb: "The whole team's money, in one place" },
  { icon: PlusCircle, title: 'Chip in fast', blurb: 'Top up your share in a couple of taps' },
  { icon: Receipt, title: 'Every euro tracked', blurb: 'See what was paid, and where it went' },
]

interface NotConnectedMoneyPoolProps {
  isAdmin: boolean
  /**
   * Whether connecting Bunq is switched on for this deployment: true points an admin to the team
   * settings, false says it is coming. Undefined (not known yet, or the status could not be read) says neither.
   */
  connectAvailable?: boolean
  /** The team connected Bunq but no account is picked yet: an admin is pointed to the team settings to pick one. */
  accountPending?: boolean
}

/** Members see what the pool offers; admins also hear how connecting Bunq goes, or that it is coming (ADR-0042). */
export function NotConnectedMoneyPool({ isAdmin, connectAvailable, accountPending }: NotConnectedMoneyPoolProps) {
  return (
    <section aria-label="Money pool preview" className="mx-auto flex max-w-sm flex-col items-center text-center">
      <h3 className="font-display text-title font-bold leading-tight">A shared team pot</h3>
      <p className="mt-3 text-small leading-relaxed text-muted-foreground">
        {isAdmin
          ? adminCopy(connectAvailable, accountPending)
          : 'Once an admin connects the team’s Bunq account, the balance and payments show up here.'}
      </p>

      <PiggyBankArt className="my-7" />

      <ul className="flex w-full flex-col gap-3 text-left">
        {PILLARS.map(({ icon: Icon, title, blurb }) => (
          <li key={title} className="flex items-center gap-3">
            <span
              className="grid size-10 shrink-0 place-items-center rounded-md bg-gold/12 ring-1 ring-inset ring-gold/25"
              style={{ color: 'var(--color-gold-dark)' }}
            >
              <Icon size={20} />
            </span>
            <span>
              <span className="block text-small font-semibold leading-tight text-foreground">{title}</span>
              <span className="text-caption text-muted-foreground">{blurb}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function adminCopy(connectAvailable?: boolean, accountPending?: boolean) {
  if (accountPending) return 'Pick the account in the team settings. The balance and payments will show up here.'
  if (connectAvailable === undefined) return 'The balance and payments of the team’s Bunq account will show up here.'
  return connectAvailable
    ? 'Connect the team’s Bunq account in the team settings. The balance and payments will show up here.'
    : 'Connecting the team’s Bunq account is coming soon. The balance and payments will show up here.'
}
