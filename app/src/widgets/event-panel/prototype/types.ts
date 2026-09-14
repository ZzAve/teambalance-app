import type { AttendanceEntry, EventRoster } from '@shared/api/events'
import type { LineupState } from './lineup-model'

/** PROTOTYPE — throwaway. The one prop shape every variant is handed, so the switcher stays dumb. */
export interface LineupPanelProps {
  attendances: AttendanceEntry[]
  roster: EventRoster
  currentUserId?: string | null
  /** Trust-based editing (ADR-0003): fires with the *target* member's id, not the viewer's. */
  onRespond: (userId: string, state: LineupState) => void
  /** A write is in flight; controls are held. */
  pending?: boolean
}
