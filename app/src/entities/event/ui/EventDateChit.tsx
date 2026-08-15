import type { EventTypeSummary } from '@shared/api/events'

/**
 * The calendar "chit" that leads every event card: weekday, a big Grandstander day number, month —
 * tinted with the event type's colour so the block doubles as the type marker. It is the card's
 * date anchor, which is what lets the flat list drop the This Week / Later headings.
 *
 * The colour alone never carries the type: the card keeps a text tag next to it.
 */
export function EventDateChit({ date, type }: { date: Date; type: EventTypeSummary }) {
  const color = type.color ?? '#888'

  return (
    <div
      className="flex w-[54px] shrink-0 flex-col items-center self-start rounded-[15px] px-1 pb-2 pt-2.5 text-white"
      style={{ backgroundColor: color }}
    >
      <span className="text-[10px] font-bold uppercase leading-none tracking-[0.1em] opacity-90">
        {date.toLocaleDateString('nl-NL', { weekday: 'short' }).replace('.', '')}
      </span>
      <span className="font-display my-0.5 text-2xl font-extrabold leading-none">
        {date.getDate()}
      </span>
      <span className="text-[9px] font-bold uppercase leading-none tracking-[0.12em] opacity-80">
        {date.toLocaleDateString('nl-NL', { month: 'short' }).replace('.', '')}
      </span>
    </div>
  )
}
