import { useActAsRecords } from '@shared/api/act-as'
import { ActAsRecordsView } from './ActAsRecordsView'

/**
 * Container for the team-visible Act-as Record: wires the query to the View. Pure wiring, covered by
 * e2e rather than a story (ADR-0017).
 */
export function ActAsRecords() {
  const { data: records, isLoading, error } = useActAsRecords()

  return <ActAsRecordsView records={records} isLoading={isLoading} isError={!!error} />
}
