import { avatarInitials } from '@shared/lib/avatar'

/** A Substitute's avatar (ADR-0033): dashed purple initials, so they read apart from Members. */
export function SubstituteAvatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="grid size-8 shrink-0 place-items-center rounded-full border-[1.5px] border-dashed border-purple text-caption font-bold text-purple-ink"
    >
      {avatarInitials(name)}
    </span>
  )
}
