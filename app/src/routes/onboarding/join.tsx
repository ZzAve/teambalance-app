import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useJoinTeam } from '@features/join-team/lib/use-join-team'
import { JoinTeamView } from '@features/join-team/ui/JoinTeamView'

export const Route = createFileRoute('/onboarding/join')({
  component: JoinPage,
})

function JoinPage() {
  const [value, setValue] = useState('')
  const { join, isPending, errorMessage } = useJoinTeam()

  return (
    <JoinTeamView
      value={value}
      onChange={setValue}
      onSubmit={join}
      submitting={isPending}
      error={errorMessage}
    />
  )
}
