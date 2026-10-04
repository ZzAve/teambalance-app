// PROTOTYPE — throwaway (ADR-0038). The member detail page reached from the roster, switchable via
// `?variant=A|B`. Edits (Team Photo, Shirt Number) live in memory only.
import { useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { ArrowLeft, Camera, Hash, Shield, Shirt } from 'lucide-react'
import { useCurrentUser } from '@shared/api/auth'
import { useMembers } from '@shared/api/members'
import { avatarColor, avatarInitials } from '@shared/lib/avatar'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { PrototypeSwitcher } from '@shared/ui/PrototypeSwitcher'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@shared/ui/sheet'
import { FAKE_PERSONAL_PHOTO, toPlayers } from '../lib/prototype-players'
import type { Player } from '../lib/prototype-players'

const CARD = 'overflow-hidden rounded-md border border-border bg-card shadow-[var(--shadow-card)]'
const ROW = 'flex items-center gap-3 px-4 py-3 text-small'

interface DetailProps {
  player: Player
  isSelf: boolean
  canManage: boolean
  numberError: string | null
  onEditPhoto: () => void
  onRemovePhoto: () => void
  onSaveNumber: (raw: string) => void
}

function Photo({ player, className }: { player: Player; className: string }) {
  if (player.photoUrl) return <img src={player.photoUrl} alt="" className={`object-cover ${className}`} />
  return (
    <div
      className={`flex items-center justify-center font-semibold text-white ${className}`}
      style={{ backgroundColor: avatarColor(player.member.userId) }}
    >
      {avatarInitials(player.member.displayName)}
    </div>
  )
}

function NumberRow({ player, editable, error, onSave }: {
  player: Player
  editable: boolean
  error: string | null
  onSave: (raw: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(player.shirtNumber?.toString() ?? '')
  if (editing) {
    return (
      <div className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Input
            aria-label="Shirt number"
            inputMode="numeric"
            value={draft}
            autoFocus
            onChange={(e) => setDraft(e.target.value)}
            className="w-24"
          />
          <Button
            size="sm"
            onClick={() => {
              onSave(draft)
              setEditing(false)
            }}
          >
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        </div>
        <p className="mt-1 text-caption text-muted-foreground">0–999, leave empty for none.</p>
      </div>
    )
  }
  return (
    <>
      <div className={ROW}>
        <Hash size={18} className="shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="font-medium">Shirt number</span>
        <span className="ml-auto text-muted-foreground">{player.shirtNumber ?? 'None'}</span>
        {editable && (
          <button
            type="button"
            className="text-small font-semibold text-blue"
            onClick={() => {
              setDraft(player.shirtNumber?.toString() ?? '')
              setEditing(true)
            }}
          >
            Edit
          </button>
        )}
      </div>
      {error && <p role="alert" className="px-4 pb-3 text-caption text-red">{error}</p>}
    </>
  )
}

function DetailRows({ player, isSelf, canManage, numberError, onEditPhoto, onRemovePhoto, onSaveNumber }: DetailProps) {
  return (
    <div className={`${CARD} divide-y divide-border`}>
      <NumberRow player={player} editable={isSelf || canManage} error={numberError} onSave={onSaveNumber} />
      <div className={ROW}>
        <Shirt size={18} className="shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="font-medium">Position</span>
        <span className="ml-auto text-muted-foreground">{player.member.position?.label ?? 'Unassigned'}</span>
      </div>
      <div className={ROW}>
        <Shield size={18} className="shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="font-medium">Role</span>
        <span className="ml-auto text-muted-foreground">{player.member.role === 'ADMIN' ? 'Admin' : 'Member'}</span>
      </div>
      {isSelf && (
        <button type="button" className={`${ROW} w-full text-left hover:bg-muted/60`} onClick={onEditPhoto}>
          <Camera size={18} className="shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="font-medium">Team photo</span>
          <span className="ml-auto font-semibold text-blue">Change</span>
        </button>
      )}
      {!isSelf && canManage && player.photoUrl && (
        <button type="button" className={`${ROW} w-full text-left font-semibold text-red hover:bg-red/5`} onClick={onRemovePhoto}>
          <Camera size={18} className="shrink-0 text-red" aria-hidden="true" />
          Remove team photo
        </button>
      )}
    </div>
  )
}

/** A: the photo fills the top of the page, number and name on top of it. */
function VariantA(props: DetailProps) {
  const { player } = props
  return (
    <div className="flex flex-col gap-4">
      <div className="relative -mx-4 aspect-[4/3] overflow-hidden sm:mx-0 sm:rounded-md">
        <Photo player={player} className="h-full w-full text-page" />
        <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 bg-gradient-to-t from-black/70 to-transparent px-4 pt-12 pb-3 text-white">
          {player.shirtNumber !== null && (
            <span className="font-display text-page leading-none font-bold">{player.shirtNumber}</span>
          )}
          <span className="font-display text-title font-bold">{player.member.displayName}</span>
        </div>
      </div>
      <DetailRows {...props} />
    </div>
  )
}

/** B: a round photo in a centred header, details as a settings list. */
function VariantB(props: DetailProps) {
  const { player } = props
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-2 pt-2">
        <div className="relative">
          <Photo player={player} className="h-28 w-28 rounded-full text-title" />
          {player.shirtNumber !== null && (
            <span className="absolute -right-1 -bottom-1 min-w-9 rounded-full border-4 border-background bg-foreground px-1.5 text-center font-display text-body font-bold text-background">
              {player.shirtNumber}
            </span>
          )}
        </div>
        <h2 className="font-display text-title font-bold">{player.member.displayName}</h2>
        <span className="text-small text-muted-foreground">{player.member.position?.label ?? 'Unassigned'}</span>
      </div>
      <DetailRows {...props} />
    </div>
  )
}

function PhotoSheet({ open, hasPhoto, onClose, onPick }: {
  open: boolean
  hasPhoto: boolean
  onClose: () => void
  onPick: (photoUrl: string | null) => void
}) {
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Team photo</SheetTitle>
          <SheetDescription>Only shown in this team. Changing your personal photo later does not change it.</SheetDescription>
        </SheetHeader>
        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            className="flex items-center gap-3 rounded-md border border-border p-3 text-left hover:bg-muted/60"
            onClick={() => onPick(FAKE_PERSONAL_PHOTO)}
          >
            <img src={FAKE_PERSONAL_PHOTO} alt="" className="h-12 w-12 rounded-full object-cover" />
            <span>
              <span className="block font-medium">Use my personal photo</span>
              <span className="block text-caption text-muted-foreground">Copies it into this team</span>
            </span>
          </button>
          <label className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-3 hover:bg-muted/60">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Camera size={20} aria-hidden="true" />
            </span>
            <span>
              <span className="block font-medium">Upload a different photo</span>
              <span className="block text-caption text-muted-foreground">Cropped to a square</span>
            </span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) onPick(URL.createObjectURL(file))
              }}
            />
          </label>
          {hasPhoto && (
            <Button variant="outline" className="text-red" onClick={() => onPick(null)}>
              Remove photo
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

const VARIANTS = [
  { key: 'A', name: 'Photo hero' },
  { key: 'B', name: 'Round header' },
]

export function MemberDetailPrototype() {
  const { slug, userId } = useParams({ strict: false })
  const [variant, setVariant] = useState(new URLSearchParams(window.location.search).get('variant') ?? 'A')
  const [edits, setEdits] = useState<{ photoUrl?: string | null; shirtNumber?: number | null }>({})
  const [numberError, setNumberError] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const currentUser = useCurrentUser()
  const { data: members = [] } = useMembers()

  const players = toPlayers(members)
  const base = players.find((p) => p.member.userId === userId)
  if (!base) return <p className="text-small text-muted-foreground">Loading…</p>
  const player: Player = { ...base, ...edits }

  const saveNumber = (raw: string) => {
    const trimmed = raw.trim()
    if (trimmed === '') {
      setNumberError(null)
      setEdits((e) => ({ ...e, shirtNumber: null }))
      return
    }
    const n = Number(trimmed)
    if (!Number.isInteger(n) || n < 0 || n > 999) {
      setNumberError('Use a whole number from 0 to 999.')
      return
    }
    const holder = players.find((p) => p.shirtNumber === n && p.member.userId !== userId)
    if (holder) {
      setNumberError(`Number ${n} is already worn by ${holder.member.displayName}.`)
      return
    }
    setNumberError(null)
    setEdits((e) => ({ ...e, shirtNumber: n }))
  }

  const change = (key: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set('variant', key)
    window.history.replaceState(window.history.state, '', url)
    setVariant(key)
  }

  const props: DetailProps = {
    player,
    isSelf: currentUser?.id === userId,
    canManage: currentUser?.role === 'ADMIN',
    numberError,
    onEditPhoto: () => setSheetOpen(true),
    onRemovePhoto: () => setEdits((e) => ({ ...e, photoUrl: null })),
    onSaveNumber: saveNumber,
  }

  return (
    <div className="flex flex-col gap-4">
      <Link
        to="/t/$slug/team"
        params={{ slug: slug ?? '' }}
        className="flex items-center gap-1 text-small font-medium text-muted-foreground"
      >
        <ArrowLeft size={16} aria-hidden="true" /> Team
      </Link>
      {variant === 'A' && <VariantA {...props} />}
      {variant === 'B' && <VariantB {...props} />}
      <PhotoSheet
        open={sheetOpen}
        hasPhoto={player.photoUrl !== null}
        onClose={() => setSheetOpen(false)}
        onPick={(photoUrl) => {
          setEdits((e) => ({ ...e, photoUrl }))
          setSheetOpen(false)
        }}
      />
      <PrototypeSwitcher variants={VARIANTS} current={variant} onChange={change} />
    </div>
  )
}
