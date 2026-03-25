import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'
import { useUserStore } from '@shared/stores/user-store'
import { useMembers } from '@shared/api/members'

export function UserSelector() {
  const { userId, setUser } = useUserStore()
  const { data: members } = useMembers()

  return (
    <Select
      value={userId ?? undefined}
      onValueChange={(value) => {
        const member = members?.find((m) => m.userId === value)
        if (member) setUser(member.userId, member.displayName)
      }}
    >
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Select user" />
      </SelectTrigger>
      <SelectContent>
        {members?.map((m) => (
          <SelectItem key={m.userId} value={m.userId}>
            {m.displayName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
