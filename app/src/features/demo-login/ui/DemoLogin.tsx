import { useNavigate } from '@tanstack/react-router'
import { authMeQueryOptions } from '@shared/api/auth'
import { useCreateDemoSession } from '@shared/api/demo'
import { queryClient } from '@shared/api/query-client'
import { DemoLoginView } from './DemoLoginView'

export function DemoLogin() {
  const navigate = useNavigate()
  const createDemoSession = useCreateDemoSession()

  return (
    <DemoLoginView
      isPending={createDemoSession.isPending}
      isError={createDemoSession.isError}
      onPlay={(persona) =>
        createDemoSession.mutate(persona, {
          onSuccess: () => {
            // The dispatcher route reads /me again and sends the guest to the demo team's events.
            queryClient.removeQueries({ queryKey: authMeQueryOptions.queryKey })
            void navigate({ to: '/' })
          },
        })
      }
    />
  )
}
