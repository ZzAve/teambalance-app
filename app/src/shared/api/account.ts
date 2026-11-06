import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { applyUserLanguage } from '@shared/i18n/language'
import { i18n } from '@shared/i18n/i18n'
import type { Language } from '@shared/i18n/i18n'
import { api } from './wirespec-client'
import { authMeQueryOptions } from './auth'

/** Stores the caller's language on their user, then shows it (ADR-0043 §3). */
export function useSetLanguage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (language: Language) => {
      const contract = language === 'nl' ? 'NL' : 'EN'
      const res = await api.setLanguage({ body: { language: contract } })
      if (res.status !== 204) throw new Error(`Setting the language failed with status ${res.status}`)
      return contract
    },
    onSuccess: (contract) => {
      applyUserLanguage(contract)
      void queryClient.invalidateQueries({ queryKey: authMeQueryOptions.queryKey })
    },
    onError: () => toast.error(i18n.t('language.saveFailed')),
  })
}
