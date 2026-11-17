import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useCurrentUser } from '@shared/api/auth'
import { useEvents } from '@shared/api/events'
import { useMembers } from '@shared/api/members'
import { useSetAttendance } from '@shared/api/attendances'
import { teamRoutes, teamSlugFromPath } from '@shared/lib/team-routes'
import { useNavTabs } from '@shared/ui/BottomNav'
import { buildPaletteItems, isPaletteShortcut, shortcutHint, type PaletteItem } from '../model/palette-items'
import { CommandPaletteView } from './CommandPaletteView'

// The sidebar's breakpoint (AppShellFrame's `lg`): below it there is no sidebar, so no palette.
const DESKTOP = '(min-width: 64rem)'

/**
 * Thin wiring for [CommandPaletteView]: the Cmd/Ctrl+K listener, the items built from the events and
 * members queries (fetched only while open, usually already cached), and running the chosen item.
 */
export function CommandPalette() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const user = useCurrentUser()
  const { pathname, tabs } = useNavTabs()
  // useNavTabs drops the Events tab when there is no Team or the member is parked on get-started.
  const slug = tabs.some((tab) => tab.id === 'events') ? (teamSlugFromPath(pathname) ?? user?.activeTeam?.slug ?? null) : null
  const events = useEvents(false, open && slug !== null)
  const members = useMembers(open && slug !== null)
  const { mutate: setAttendance } = useSetAttendance()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isPaletteShortcut(e) || !window.matchMedia(DESKTOP).matches) return
      e.preventDefault()
      setOpen((o) => !o)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const items = useMemo(
    () =>
      buildPaletteItems({
        tabs,
        routes: teamRoutes(slug),
        isAdmin: user?.role === 'ADMIN',
        events: events.data ?? [],
        members: members.data ?? [],
        teams: user?.teams ?? [],
        activeSlug: slug,
        now: new Date(),
      }),
    // `tabs` is rebuilt every render; its content follows pathname, the user and the language.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname, slug, user, events.data, members.data, t],
  )

  const run = (item: PaletteItem) => {
    setOpen(false)
    const { action } = item
    if (action.kind === 'navigate') {
      navigate({ to: action.to })
    } else if (user) {
      const answer = t(`attendance.word.${action.state}`)
      setAttendance(
        { eventId: action.eventId, userId: user.id, state: action.state },
        { onSuccess: () => toast.success(t('palette.answered', { answer })) },
      )
    }
  }

  return (
    <CommandPaletteView
      shortcut={shortcutHint(navigator.platform)}
      open={open}
      onOpenChange={setOpen}
      items={items}
      isLoading={slug !== null && (events.isLoading || members.isLoading)}
      isError={events.isError || members.isError}
      onRun={run}
    />
  )
}
