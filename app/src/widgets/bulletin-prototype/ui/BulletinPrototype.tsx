/* eslint-disable */
// PROTOTYPE — throwaway. Bulletin board placement variants, switchable via ?variant=A|B|C and the
// floating bar. Posts live in memory (reset on reload); no API, no i18n, no tests.
//   A: Team page section (Bulletin → Members → Subs), full cards; pinned posts in a strip on every page.
//   B: Team page section as a compact title list; pinned posts as full cards on the events home only.
//   C: Contrarian — ignores the feedback: its own "Board" tab with a chronological feed, no pinning,
//      an unread dot on the tab; the Team page stays as it is.
import { Fragment, useState, useSyncExternalStore, type ReactNode } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Megaphone, MoreHorizontal, Pin, Plus, X } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@shared/ui/sheet'
import { Button } from '@shared/ui/button'
import { Switch } from '@shared/ui/switch'
import { SectionLabel } from '@shared/ui/SectionLabel'
import { cn } from '@shared/lib/utils'

// ---------- variant ----------
export const VARIANTS = [
  { key: 'A', name: 'Team section + pinned strip on every page' },
  { key: 'B', name: 'Team title list + pinned cards on events' },
  { key: 'C', name: 'Contrarian: own Board tab, no pins' },
] as const
export type Variant = (typeof VARIANTS)[number]['key']

const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())
const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

function initialVariant(): Variant {
  const fromUrl = new URLSearchParams(window.location.search).get('variant')
  const fromSession = (() => { try { return sessionStorage.getItem('bulletin-prototype-variant') } catch { return null } })()
  const v = fromUrl ?? fromSession ?? 'A'
  return (VARIANTS.some((x) => x.key === v) ? v : 'A') as Variant
}
let variant: Variant = initialVariant()

function setVariant(v: Variant) {
  variant = v
  try { sessionStorage.setItem('bulletin-prototype-variant', v) } catch { /* ignore */ }
  const url = new URL(window.location.href)
  url.searchParams.set('variant', v)
  window.history.replaceState(window.history.state, '', url)
  emit()
}

export const useBulletinVariant = () => useSyncExternalStore(subscribe, () => variant)
export const PROTOTYPE_ON = import.meta.env.DEV

// ---------- posts ----------
export interface Post {
  id: number
  author: string
  postedAt: Date
  markdown: string
  pinned: boolean
  showUntil?: Date
  editedAt?: Date
}

const daysFromNow = (d: number) => new Date(Date.now() + d * 86_400_000)

let posts: Post[] = [
  {
    id: 1,
    author: 'Jan',
    postedAt: daysFromNow(-20),
    pinned: true,
    markdown: `### Ball bag rotation
Who takes the **balls and the first-aid kit** home after training:

- Week 46 — Lisa
- Week 47 — Tom
- Week 48 — Emma
- Week 49 — Daan

Can't make your week? Swap with someone and tell the group.`,
  },
  {
    id: 2,
    author: 'Jan',
    postedAt: daysFromNow(-2),
    editedAt: daysFromNow(-0.5),
    pinned: true,
    showUntil: daysFromNow(9),
    markdown: `### Clubhouse closes at 22:30
The municipality has set new closing times for the clubhouse at *Sporthal De Vliet* until the end of November.

1. Last drinks at 22:15
2. No music outside after 22:00
3. Bikes in the rack, not against the façade

Details: [gemeente notice](https://example.com/notice)`,
  },
  {
    id: 3,
    author: 'Sophie',
    postedAt: daysFromNow(-1),
    pinned: false,
    markdown: `### Team dinner on 14 December
We booked **Café Balans** from 18:00. Put your name on the attendance for "Teametentje" so we know the count.`,
  },
]
let unreadSince = daysFromNow(-1.5)

export const usePosts = () => useSyncExternalStore(subscribe, () => posts)
export const useUnread = () =>
  useSyncExternalStore(subscribe, () => posts.some((p) => p.postedAt > unreadSince))

function addPost(p: Omit<Post, 'id' | 'postedAt' | 'author'>) {
  posts = [{ ...p, id: Date.now(), postedAt: new Date(), author: 'You' }, ...posts]
  emit()
}
function updatePost(id: number, p: Pick<Post, 'markdown' | 'pinned' | 'showUntil'>) {
  posts = posts.map((x) => (x.id === id ? { ...x, ...p, editedAt: new Date() } : x))
  emit()
}
function togglePin(id: number) {
  posts = posts.map((p) => (p.id === id ? { ...p, pinned: !p.pinned } : p))
  emit()
}
function removePost(id: number) {
  posts = posts.filter((p) => p.id !== id)
  emit()
}
export function markRead() {
  unreadSince = new Date()
  emit()
}

const visible = (p: Post) => !p.showUntil || p.showUntil > new Date()
const byNewest = (a: Post, b: Post) => b.postedAt.getTime() - a.postedAt.getTime()
export const pinnedPosts = (all: Post[]) => all.filter((p) => p.pinned && visible(p)).sort(byNewest)
const ordered = (all: Post[]) => [...pinnedPosts(all), ...all.filter((p) => !p.pinned && visible(p)).sort(byNewest)]

const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
const fmtTime = (d: Date) => d.toDateString() === new Date().toDateString()
  ? `today ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
  : `${fmt(d)} ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
const titleOf = (md: string) => md.split('\n').find((l) => l.trim())?.replace(/^#+\s*/, '').replace(/[*_]/g, '') ?? ''

// ---------- tiny markdown (prototype only — builds React elements, never HTML) ----------
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    if (m[1]) out.push(<strong key={m.index}>{m[1]}</strong>)
    else if (m[2]) out.push(<em key={m.index}>{m[2]}</em>)
    else out.push(<a key={m.index} href={m[4]} target="_blank" rel="noopener noreferrer" className="text-blue underline">{m[3]}</a>)
    last = re.lastIndex
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

export function Markdown({ source, className }: { source: string; className?: string }) {
  const blocks: ReactNode[] = []
  const lines = source.split('\n')
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) { i++; continue }
    const h = /^(#{1,3})\s+(.*)/.exec(line)
    if (h) {
      blocks.push(<h3 key={i} className="font-semibold text-foreground">{inline(h[2])}</h3>)
      i++
      continue
    }
    const listRe = /^\s*([-*]|\d+\.)\s+(.*)/
    if (listRe.test(line)) {
      const ordered = /^\s*\d+\./.test(line)
      const items: ReactNode[] = []
      while (i < lines.length && listRe.test(lines[i])) {
        items.push(<li key={i}>{inline(listRe.exec(lines[i])![2])}</li>)
        i++
      }
      blocks.push(ordered
        ? <ol key={`l${i}`} className="list-decimal pl-5">{items}</ol>
        : <ul key={`l${i}`} className="list-disc pl-5">{items}</ul>)
      continue
    }
    const para: string[] = []
    while (i < lines.length && lines[i].trim() && !listRe.test(lines[i]) && !/^#/.test(lines[i])) para.push(lines[i++])
    blocks.push(<p key={`p${i}`}>{inline(para.join(' '))}</p>)
  }
  return <div className={cn('flex flex-col gap-2 text-small text-foreground/90', className)}>{blocks}</div>
}

// ---------- shared bits ----------
function PostMeta({ post }: { post: Post }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-caption text-muted-foreground">
      {post.pinned && <span className="inline-flex items-center gap-1 font-semibold text-gold-ink"><Pin size={12} />Pinned</span>}
      <span><span className="font-semibold text-foreground/80">{post.author}</span> · {fmt(post.postedAt)}</span>
      {post.editedAt && <span title={post.editedAt.toLocaleString('en-GB')}>· edited {fmtTime(post.editedAt)}</span>}
      {post.showUntil && <span className="rounded-full bg-muted px-2 py-0.5">until {fmt(post.showUntil)}</span>}
    </div>
  )
}

function AdminMenu({ post, allowPin }: { post: Post; allowPin: boolean }) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  return (
    <div className="relative">
      <ComposeSheet open={editing} onOpenChange={setEditing} allowPin={allowPin} post={post} />
      <button aria-label="Post actions" onClick={() => setOpen(!open)} className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-blue/8">
        <MoreHorizontal size={18} />
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-1 w-36 rounded-md border border-border/60 bg-card p-1 text-small shadow-lg">
          <button className="w-full rounded px-2 py-1.5 text-left hover:bg-muted" onClick={() => { setOpen(false); setEditing(true) }}>Edit</button>
          {allowPin && <button className="w-full rounded px-2 py-1.5 text-left hover:bg-muted" onClick={() => { togglePin(post.id); setOpen(false) }}>{post.pinned ? 'Unpin' : 'Pin'}</button>}
          <button className="w-full rounded px-2 py-1.5 text-left text-red hover:bg-muted" onClick={() => removePost(post.id)}>Delete</button>
        </div>
      )}
    </div>
  )
}

function PostCard({ post, isAdmin, allowPin = true }: { post: Post; isAdmin: boolean; allowPin?: boolean }) {
  return (
    <article className={cn('rounded-lg border bg-card p-4 shadow-sm', post.pinned && allowPin ? 'border-gold/50' : 'border-border/40')}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <PostMeta post={allowPin ? post : { ...post, pinned: false }} />
        {isAdmin && <AdminMenu post={post} allowPin={allowPin} />}
      </div>
      <Markdown source={post.markdown} />
    </article>
  )
}

function ComposeSheet({ open, onOpenChange, allowPin, post }: { open: boolean; onOpenChange: (o: boolean) => void; allowPin: boolean; post?: Post }) {
  const [markdown, setMarkdown] = useState(post?.markdown ?? '### \n')
  const [preview, setPreview] = useState(false)
  const [pinned, setPinned] = useState(post?.pinned ?? false)
  const [until, setUntil] = useState(post?.showUntil?.toISOString().slice(0, 10) ?? '')
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader><SheetTitle>{post ? 'Edit post' : 'New post'}</SheetTitle></SheetHeader>
        <div className="mb-2 flex gap-1 self-start rounded-md bg-muted p-1 text-small">
          {(['Write', 'Preview'] as const).map((tab) => (
            <button key={tab} onClick={() => setPreview(tab === 'Preview')}
              className={cn('rounded px-3 py-1', (tab === 'Preview') === preview && 'bg-card font-semibold shadow-sm')}>{tab}</button>
          ))}
        </div>
        {preview
          ? <div className="min-h-40 rounded-md border border-border/60 p-3"><Markdown source={markdown} /></div>
          : <textarea value={markdown} onChange={(e) => setMarkdown(e.target.value)} rows={8}
              className="min-h-40 w-full rounded-md border border-border/60 bg-card p-3 font-mono text-small" />}
        <p className="mt-1 text-caption text-muted-foreground">Markdown: **bold**, *italic*, - lists, 1. lists, ### heading, [link](https://…)</p>
        {allowPin && (
          <label className="mt-4 flex items-center justify-between text-small">
            <span>Pin this post<span className="block text-caption text-muted-foreground">Pinned posts show outside the board too</span></span>
            <Switch checked={pinned} onCheckedChange={setPinned} aria-label="Pin this post" />
          </label>
        )}
        <label className="mt-4 flex items-center justify-between gap-4 text-small">
          <span>Show until <span className="text-caption text-muted-foreground">(optional)</span></span>
          <input type="date" value={until} onChange={(e) => setUntil(e.target.value)} className="rounded-md border border-border/60 bg-card px-2 py-1" />
        </label>
        <Button className="mt-6" onClick={() => {
          const fields = { markdown, pinned, showUntil: until ? new Date(until) : undefined }
          if (post) updatePost(post.id, fields)
          else { addPost(fields); setMarkdown('### \n'); setPinned(false); setUntil('') }
          setPreview(false)
          onOpenChange(false)
        }}>{post ? 'Save' : 'Post'}</Button>
      </SheetContent>
    </Sheet>
  )
}

function NewPostButton({ allowPin }: { allowPin: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}><Plus size={16} />New post</Button>
      <ComposeSheet open={open} onOpenChange={setOpen} allowPin={allowPin} />
    </>
  )
}

// ---------- A: team section, full cards ----------
function TeamBulletinFull({ isAdmin }: { isAdmin: boolean }) {
  const list = ordered(usePosts())
  return (
    <section className="flex flex-col gap-3">
      <div className="flex min-h-11 items-center justify-between">
        <SectionLabel as="h2" className="text-body">Bulletin</SectionLabel>
        {isAdmin && <NewPostButton allowPin />}
      </div>
      {list.length === 0 && <p className="text-small text-muted-foreground">No posts yet.</p>}
      {list.map((p) => <PostCard key={p.id} post={p} isAdmin={isAdmin} />)}
    </section>
  )
}

// A: the strip under the header on every in-shell page
export function PinnedStrip() {
  const pins = pinnedPosts(usePosts())
  const [expanded, setExpanded] = useState(false)
  const [hidden, setHidden] = useState(false)
  if (hidden || pins.length === 0) return null
  return (
    <div className="border-b border-gold/40 bg-gold/10">
      <div className="mx-auto max-w-2xl px-4">
        <div className="flex min-h-11 items-center gap-2 text-small">
          <Pin size={14} className="shrink-0 text-gold-ink" />
          <button className="flex min-w-0 flex-1 items-center gap-1 text-left" onClick={() => setExpanded(!expanded)}>
            <span className="truncate font-semibold">{titleOf(pins[0].markdown)}</span>
            {pins.length > 1 && <span className="shrink-0 text-muted-foreground">+{pins.length - 1} more</span>}
            {expanded ? <ChevronUp size={16} className="ml-auto shrink-0" /> : <ChevronDown size={16} className="ml-auto shrink-0" />}
          </button>
          <button aria-label="Hide pinned posts" onClick={() => setHidden(true)} className="flex h-9 w-9 items-center justify-center text-muted-foreground"><X size={16} /></button>
        </div>
        {expanded && (
          <div className="flex flex-col gap-4 pb-4">
            {pins.map((p) => <div key={p.id} className="rounded-md bg-card p-3"><PostMeta post={p} /><Markdown source={p.markdown} className="mt-2" /></div>)}
          </div>
        )}
      </div>
    </div>
  )
}

// ---------- B: team section as a compact list; pinned cards on events ----------
function TeamBulletinCompact({ isAdmin }: { isAdmin: boolean }) {
  const list = ordered(usePosts())
  const [openId, setOpenId] = useState<number | null>(null)
  return (
    <section className="flex flex-col gap-2">
      <div className="flex min-h-11 items-center justify-between">
        <SectionLabel as="h2" className="text-body">Bulletin</SectionLabel>
        {isAdmin && <NewPostButton allowPin />}
      </div>
      <ul className="divide-y divide-border/40 rounded-lg border border-border/40 bg-card">
        {list.map((p) => (
          <li key={p.id}>
            <button className="flex min-h-12 w-full items-center gap-2 px-4 py-2 text-left" onClick={() => setOpenId(openId === p.id ? null : p.id)}>
              {p.pinned ? <Pin size={14} className="shrink-0 text-gold-ink" /> : <Megaphone size={14} className="shrink-0 text-muted-foreground" />}
              <span className="flex-1 truncate text-small font-semibold">{titleOf(p.markdown)}</span>
              <span className="shrink-0 text-caption text-muted-foreground">{fmt(p.postedAt)}</span>
              {openId === p.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openId === p.id && (
              <div className="px-4 pb-4">
                <div className="mb-2 flex items-center justify-between"><PostMeta post={p} />{isAdmin && <AdminMenu post={p} allowPin />}</div>
                <Markdown source={p.markdown} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

export function EventsPinnedCards() {
  const pins = pinnedPosts(usePosts())
  if (pins.length === 0) return null
  return (
    <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1">
      {pins.map((p) => (
        <article key={p.id} className={cn('snap-start rounded-lg border border-gold/50 bg-gold/8 p-4', pins.length > 1 ? 'w-[85%] shrink-0' : 'w-full')}>
          <PostMeta post={p} />
          <Markdown source={p.markdown} className="mt-2" />
        </article>
      ))}
    </div>
  )
}

// ---------- C: own Board tab ----------
export function BoardPage({ isAdmin }: { isAdmin: boolean }) {
  const list = usePosts().filter(visible).sort(byNewest)
  return (
    <div className="flex flex-col gap-4">
      <div className="flex min-h-11 items-center justify-between">
        <h1 className="font-display text-title font-semibold">Board</h1>
        {isAdmin && <NewPostButton allowPin={false} />}
      </div>
      <ol className="relative flex flex-col gap-5 border-l-2 border-border/60 pl-5">
        {list.map((p) => (
          <li key={p.id} className="relative">
            <span className="absolute -left-[27px] top-1 flex h-3 w-3 rounded-full border-2 border-background bg-blue" />
            <div className="mb-1 text-caption font-semibold text-muted-foreground">{fmt(p.postedAt)}</div>
            <PostCard post={p} isAdmin={isAdmin} allowPin={false} />
          </li>
        ))}
      </ol>
    </div>
  )
}

// ---------- the Team page bulletin slot per variant ----------
export function TeamBulletinSlot({ isAdmin }: { isAdmin: boolean }) {
  const v = useBulletinVariant()
  if (!PROTOTYPE_ON || v === 'C') return null
  return v === 'A' ? <TeamBulletinFull isAdmin={isAdmin} /> : <TeamBulletinCompact isAdmin={isAdmin} />
}

// ---------- floating switcher ----------
export function PrototypeSwitcher() {
  const v = useBulletinVariant()
  if (!PROTOTYPE_ON) return null
  const idx = VARIANTS.findIndex((x) => x.key === v)
  const go = (d: number) => setVariant(VARIANTS[(idx + d + VARIANTS.length) % VARIANTS.length].key)
  return (
    <Fragment>
      <KeyHandler go={go} />
      <div className="fixed bottom-24 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-1 rounded-full bg-black px-2 py-1 text-caption text-white shadow-xl ring-2 ring-fuchsia-500">
        <button aria-label="Previous variant" onClick={() => go(-1)} className="p-1"><ChevronLeft size={16} /></button>
        <span className="whitespace-nowrap px-1 font-mono">{v} · {VARIANTS[idx].name}</span>
        <button aria-label="Next variant" onClick={() => go(1)} className="p-1"><ChevronRight size={16} /></button>
      </div>
    </Fragment>
  )
}

let keyBound = false
function KeyHandler({ go }: { go: (d: number) => void }) {
  if (!keyBound) {
    keyBound = true
    window.addEventListener('keydown', (e) => {
      const t = e.target as HTMLElement
      if (t.closest('input, textarea, [contenteditable]')) return
      if (e.key === 'ArrowLeft') currentGo(-1)
      if (e.key === 'ArrowRight') currentGo(1)
    })
  }
  currentGo = go
  return null
}
let currentGo: (d: number) => void = () => {}
