/* eslint-disable */
// PROTOTYPE — variant C of the bulletin board prototype (see widgets/bulletin-prototype).
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useCurrentUser } from '@shared/api/auth'
import { BoardPage, markRead } from '@widgets/bulletin-prototype/ui/BulletinPrototype'

export const Route = createFileRoute('/t/$slug/board/')({
  component: () => {
    const isAdmin = useCurrentUser()?.role === 'ADMIN'
    useEffect(() => { markRead() }, [])
    return <BoardPage isAdmin={isAdmin} />
  },
})
