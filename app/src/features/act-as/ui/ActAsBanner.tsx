import { useAuthMe } from '@shared/api/auth'
import { goToConsole } from '@shared/api/act-as-redirect'
import { useExitActAs } from '@shared/api/act-as'
import { ActAsBannerView } from './ActAsBannerView'

/**
 * Thin wiring for [ActAsBannerView]: reads the grant off `/auth/me` (the same payload the route gate
 * reads, so the banner and the gate can never disagree about which Team this is) and sends the
 * operator back to the console on Exit. Pure wiring, covered by e2e rather than a story (ADR-0017).
 */
export function ActAsBanner() {
  const { data: user } = useAuthMe()
  const exitActAs = useExitActAs()

  return (
    <ActAsBannerView
      teamName={user?.actAs?.team.name ?? null}
      isExiting={exitActAs.isPending}
      onExit={() => exitActAs.mutate(undefined, { onSuccess: goToConsole })}
    />
  )
}
