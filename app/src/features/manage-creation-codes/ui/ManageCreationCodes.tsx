import {
  CreationCodeError,
  useCreateCreationCode,
  useCreationCodes,
  useRevokeCreationCode,
} from '@shared/api/creation-codes'
import { ManageCreationCodesView } from './ManageCreationCodesView'

/**
 * Container for creation-codes management: wires the query and mutations to the presentational View.
 * A 403 is surfaced as the distinct `isForbidden` state so a non-admin sees a no-access shell rather
 * than a generic error. Pure wiring, covered by e2e rather than a story (ADR-0017).
 */
export function ManageCreationCodes() {
  const { data: codes, isLoading, error } = useCreationCodes()
  const createCode = useCreateCreationCode()
  const revokeCode = useRevokeCreationCode()

  const isForbidden = error instanceof CreationCodeError && error.code === 'FORBIDDEN'
  const isError = !!error && !isForbidden

  const activeError = [createCode.error, revokeCode.error].find(
    (e): e is CreationCodeError => e instanceof CreationCodeError,
  )
  const isSaving = createCode.isPending || revokeCode.isPending

  return (
    <ManageCreationCodesView
      codes={codes}
      isLoading={isLoading}
      isError={isError}
      isForbidden={isForbidden}
      isSaving={isSaving}
      errorCode={activeError?.code ?? null}
      onCreate={() => createCode.mutate({})}
      onRevoke={(code) => revokeCode.mutate({ code: code.code })}
    />
  )
}
