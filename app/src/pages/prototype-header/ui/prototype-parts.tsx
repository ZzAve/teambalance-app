// PROTOTYPE ONLY (header-structure question). Dummy page bodies + a static copy of the tab bar, shared by
// the three header variants so only the header structure differs between them. Hard-coded English and
// dummy data on purpose: this file is thrown away once a variant wins.
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, Users, PiggyBank, User, MapPin, Clock, ChevronRight } from 'lucide-react'
import { Card } from '@shared/ui/card'
import { Button } from '@shared/ui/button'
import { SectionLabel } from '@shared/ui/SectionLabel'

export type PageContext = 'top' | 'nested'

export const TEAM = { id: 't1', slug: 'heren-3', name: 'Heren 3' }
export const TEAMS = [TEAM, { id: 't2', slug: 'mix-1', name: 'Mix 1' }]
export const NESTED_TITLE = 'Training + oefenwedstrijd tegen VC Zwolle'

type Answer = 'attending' | 'maybe' | 'absent' | 'none'
const DOT: Record<Answer, string> = {
  attending: 'bg-green',
  maybe: 'bg-gold',
  absent: 'bg-red',
  none: 'bg-muted-foreground/40',
}

const EVENTS: { day: string; wd: string; title: string; time: string; place: string; answer: Answer }[] = [
  { day: '14', wd: 'Thu', title: NESTED_TITLE, time: '20:00', place: 'De Vliegermolen', answer: 'attending' },
  { day: '16', wd: 'Sat', title: 'Match vs. Dynamo Apeldoorn', time: '14:30', place: 'Sporthal Zuid', answer: 'none' },
  { day: '21', wd: 'Thu', title: 'Training', time: '20:00', place: 'De Vliegermolen', answer: 'maybe' },
  { day: '23', wd: 'Sat', title: 'Match vs. Volley Utrecht', time: '16:00', place: 'Galgenwaard Hal', answer: 'none' },
  { day: '28', wd: 'Thu', title: 'Training', time: '20:00', place: 'De Vliegermolen', answer: 'absent' },
  { day: '30', wd: 'Sat', title: 'Team dinner', time: '19:00', place: 'De Kantine', answer: 'attending' },
  { day: '05', wd: 'Thu', title: 'Training', time: '20:00', place: 'De Vliegermolen', answer: 'none' },
  { day: '07', wd: 'Sat', title: 'Match vs. Lycurgus 4', time: '13:00', place: 'Martiniplaza', answer: 'none' },
  { day: '12', wd: 'Thu', title: 'Training', time: '20:00', place: 'De Vliegermolen', answer: 'none' },
  { day: '14', wd: 'Sat', title: 'Match vs. Sliedrecht Sport 5', time: '15:00', place: 'Sporthal Nieuweveld', answer: 'none' },
  { day: '19', wd: 'Thu', title: 'Christmas training', time: '20:00', place: 'De Vliegermolen', answer: 'none' },
  { day: '21', wd: 'Sat', title: 'Mini tournament', time: '10:00', place: 'Sporthal Zuid', answer: 'none' },
]

function EventRow({ e, onOpen }: { e: (typeof EVENTS)[number]; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left transition-colors hover:bg-accent"
    >
      <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-md bg-blue/8 text-blue">
        <span className="text-caption leading-none">{e.wd}</span>
        <span className="font-display text-lead font-bold leading-none">{e.day}</span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-body font-medium">{e.title}</span>
        <span className="block truncate text-small text-muted-foreground">
          {e.time} · {e.place}
        </span>
      </span>
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${DOT[e.answer]}`} />
    </button>
  )
}

/** Body of the Events overview (top-level). No page title: each variant places the title itself. */
export function EventsBody({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <Card className="p-4">
        <SectionLabel>Next up</SectionLabel>
        <p className="mt-1 font-display text-title font-bold">Thursday, 20:00</p>
        <p className="mt-1 text-small text-muted-foreground">{NESTED_TITLE}</p>
        <div className="mt-3 flex gap-2">
          <Button size="sm" className="flex-1 bg-green text-white hover:bg-green-dark">Yes</Button>
          <Button size="sm" variant="outline" className="flex-1">Maybe</Button>
          <Button size="sm" variant="outline" className="flex-1">No</Button>
        </div>
      </Card>
      <SectionLabel>November</SectionLabel>
      <Card className="p-1">
        {EVENTS.slice(0, 6).map((e, i) => <EventRow key={i} e={e} onOpen={onOpen} />)}
      </Card>
      <SectionLabel>December</SectionLabel>
      <Card className="p-1">
        {EVENTS.slice(6).map((e, i) => <EventRow key={i} e={e} onOpen={onOpen} />)}
      </Card>
    </div>
  )
}

const PEOPLE: [string, Answer][] = [
  ['Sanne de Vries', 'attending'], ['Mark Jansen', 'attending'], ['Lotte Bakker', 'attending'],
  ['Daan Visser', 'maybe'], ['Eva Smit', 'attending'], ['Bram Meijer', 'absent'],
  ['Noor de Boer', 'attending'], ['Thijs Mulder', 'none'], ['Fleur de Groot', 'attending'],
  ['Jesse Bos', 'maybe'], ['Iris Vos', 'attending'], ['Ruben Peters', 'absent'],
  ['Mila Hendriks', 'attending'], ['Sem van Dijk', 'none'], ['Julia Dekker', 'absent'],
]

/** Body of an event detail (nested). No page title: each variant places the title itself. */
export function EventDetailBody() {
  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-2 p-4 text-small">
        <span className="flex items-center gap-2"><Calendar size={16} className="text-muted-foreground" /> Thursday 14 November</span>
        <span className="flex items-center gap-2"><Clock size={16} className="text-muted-foreground" /> 20:00 – 22:00</span>
        <span className="flex items-center gap-2"><MapPin size={16} className="text-muted-foreground" /> Sporthal De Vliegermolen, Groningen</span>
      </Card>
      <Card className="p-4">
        <SectionLabel>Your answer</SectionLabel>
        <div className="mt-2 flex gap-2">
          <Button size="sm" className="flex-1 bg-green text-white hover:bg-green-dark">Yes</Button>
          <Button size="sm" variant="outline" className="flex-1">Maybe</Button>
          <Button size="sm" variant="outline" className="flex-1">No</Button>
        </div>
      </Card>
      <SectionLabel>Who is coming · 8 yes · 2 maybe · 3 no</SectionLabel>
      <Card className="p-1">
        {PEOPLE.map(([name, a]) => (
          <div key={name} className="flex items-center gap-3 px-3 py-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue/10 text-caption font-semibold text-blue">
              {name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
            </span>
            <span className="flex-1 text-body">{name}</span>
            <span className={`h-2.5 w-2.5 rounded-full ${DOT[a]}`} />
          </div>
        ))}
      </Card>
      <Button variant="outline" className="justify-between">
        Series: every Thursday <ChevronRight size={16} />
      </Button>
    </div>
  )
}

/** Static copy of BottomNav's markup (the real one reads the router path and /me). */
export function ProtoBottomNav({ children }: { children?: ReactNode }) {
  const { t } = useTranslation()
  const tabs = [
    { id: 'events', icon: Calendar, label: t('nav.events') },
    { id: 'team', icon: Users, label: t('nav.team') },
    { id: 'money', icon: PiggyBank, label: t('nav.money') },
    { id: 'profile', icon: User, label: t('nav.profile') },
  ]
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-card/88 backdrop-blur-lg"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex min-h-[60px] max-w-2xl items-center justify-around px-2 py-1">
        {children ??
          tabs.map(({ id, icon: Icon, label }) => {
            const active = id === 'events'
            return (
              <span
                key={id}
                className={`flex flex-col items-center gap-0.5 px-4 py-2 text-caption ${active ? 'text-blue' : 'text-muted-foreground'}`}
              >
                <span className="relative flex items-center justify-center">
                  {active && <span className="absolute top-1/2 left-1/2 h-7 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue/10" />}
                  <Icon size={22} strokeWidth={active ? 2.5 : 1.75} className="relative z-10" />
                </span>
                <span className={active ? 'font-medium' : ''}>{label}</span>
              </span>
            )
          })}
      </div>
    </nav>
  )
}
