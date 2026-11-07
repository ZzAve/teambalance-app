import { PlusCircle, Receipt, Wallet, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { i18n } from '@shared/i18n/i18n'
import { PiggyBankArt } from './PiggyBankArt'

interface Pillar {
  icon: LucideIcon
  /** Key under `money.pillar` holding a `title` and a `blurb`. */
  key: 'pot' | 'chipIn' | 'tracked'
}

const PILLARS: Pillar[] = [
  { icon: Wallet, key: 'pot' },
  { icon: PlusCircle, key: 'chipIn' },
  { icon: Receipt, key: 'tracked' },
]

interface NotConnectedMoneyPoolProps {
  isAdmin: boolean
  /**
   * Whether connecting Bunq is switched on for this deployment: true points an admin to the team
   * settings, false says it is coming. Undefined (not known yet, or the status could not be read) says neither.
   */
  connectAvailable?: boolean
  /**
   * The team connected Bunq but no account is picked yet: an admin is pointed to the team settings to pick
   * one, as long as connecting is switched on, since the settings show nothing about Bunq otherwise.
   */
  accountPending?: boolean
}

/** Members see what the pool offers; admins also hear how connecting Bunq goes, or that it is coming (ADR-0042). */
export function NotConnectedMoneyPool({ isAdmin, connectAvailable, accountPending }: NotConnectedMoneyPoolProps) {
  const { t } = useTranslation()
  return (
    <section aria-label={t('money.preview')} className="mx-auto flex max-w-sm flex-col items-center text-center">
      <h3 className="font-display text-title font-bold leading-tight">{t('money.previewTitle')}</h3>
      <p className="mt-3 text-small leading-relaxed text-muted-foreground">
        {isAdmin
          ? adminCopy(connectAvailable, accountPending)
          : t('money.memberCopy')}
      </p>

      <PiggyBankArt className="my-7" />

      <ul className="flex w-full flex-col gap-3 text-left">
        {PILLARS.map(({ icon: Icon, key }) => (
          <li key={key} className="flex items-center gap-3">
            <span
              className="grid size-10 shrink-0 place-items-center rounded-md bg-gold/12 ring-1 ring-inset ring-gold/25"
              style={{ color: 'var(--color-gold-dark)' }}
            >
              <Icon size={20} />
            </span>
            <span>
              <span className="block text-small font-semibold leading-tight text-foreground">{t(`money.pillar.${key}.title`)}</span>
              <span className="text-caption text-muted-foreground">{t(`money.pillar.${key}.blurb`)}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function adminCopy(connectAvailable?: boolean, accountPending?: boolean) {
  if (accountPending && connectAvailable) return i18n.t('money.admin.pickAccount')
  if (connectAvailable === undefined) return i18n.t('money.admin.unknown')
  return connectAvailable ? i18n.t('money.admin.connect') : i18n.t('money.admin.comingSoon')
}
