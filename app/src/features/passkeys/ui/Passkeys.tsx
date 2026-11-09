import { useTranslation } from 'react-i18next'
import {
  passkeyErrorKey,
  passkeysSupported,
  useDeletePasskey,
  usePasskeys,
  useRegisterPasskey,
} from '@shared/api/passkeys'
import { PasskeysView } from './PasskeysView'

/** Thin container for the Account tab's passkeys section (ADR-0045). */
export function Passkeys() {
  const { t } = useTranslation()
  const passkeys = usePasskeys()
  const register = useRegisterPasskey()
  const remove = useDeletePasskey()
  const error = register.error ?? remove.error

  return (
    <PasskeysView
      passkeys={passkeys.data ?? []}
      supported={passkeysSupported()}
      isLoading={passkeys.isPending}
      isError={passkeys.isError}
      isAdding={register.isPending}
      isRemoving={remove.isPending}
      errorMessage={error ? t(passkeyErrorKey(error)) : undefined}
      onAdd={() => register.mutate()}
      onDelete={(id) => remove.mutate(id)}
    />
  )
}
