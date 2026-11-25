import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogTitle } from '@shared/ui/dialog'
import { filterPaletteItems, moveIndex, PALETTE_GROUPS, type PaletteItem } from '../model/palette-items'

interface CommandPaletteViewProps {
  /** ⌘K or Ctrl K, shown in the search field. */
  shortcut: string
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Every item; the View filters them by what is typed. */
  items: PaletteItem[]
  /** Events or members still loading; the Go to and Actions items show meanwhile. */
  isLoading?: boolean
  isError?: boolean
  onRun: (item: PaletteItem) => void
}

/**
 * The sidebar search field and the palette it opens. A combobox: focus stays in the input and
 * aria-activedescendant points at the active option, so a screen reader announces it on each arrow key.
 */
export function CommandPaletteView({ shortcut, open, onOpenChange, ...body }: CommandPaletteViewProps) {
  const { t } = useTranslation()
  return (
    <>
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        className="mx-1 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-small text-muted-foreground transition-colors hover:text-foreground"
      >
        <Search size={16} aria-hidden="true" />
        <span className="flex-1 text-left">{t('palette.search')}</span>
        <kbd aria-hidden="true" className="rounded border border-border px-1.5 font-sans text-caption">
          {shortcut}
        </kbd>
      </button>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          aria-describedby={undefined}
          className="top-[15%] max-w-xl translate-y-0 gap-0 overflow-hidden p-0 data-[state=closed]:slide-out-to-top-[13%] data-[state=open]:slide-in-from-top-[13%]"
        >
          <DialogTitle className="sr-only">{t('palette.title')}</DialogTitle>
          {/* Mounted with the dialog content, so each opening starts with an empty query. */}
          <PaletteBody {...body} />
        </DialogContent>
      </Dialog>
    </>
  )
}

function PaletteBody({ items, isLoading, isError, onRun }: Pick<CommandPaletteViewProps, 'items' | 'isLoading' | 'isError' | 'onRun'>) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const listId = useId()
  const listRef = useRef<HTMLDivElement>(null)
  const results = useMemo(() => filterPaletteItems(items, query), [items, query])
  const optionId = (index: number) => `${listId}-${index}`

  useEffect(() => {
    listRef.current?.querySelector(`[id="${listId}-${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [listId, active])

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => moveIndex(i, e.key === 'ArrowDown' ? 1 : -1, results.length))
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault()
      onRun(results[active])
    }
  }

  return (
    <>
      <div className="flex items-center gap-2 border-b border-border px-4 pr-12">
        <Search size={18} aria-hidden="true" className="text-muted-foreground" />
        <input
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={results[active] ? optionId(active) : undefined}
          aria-label={t('palette.title')}
          placeholder={t('palette.placeholder')}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
          }}
          onKeyDown={onKeyDown}
          className="h-12 flex-1 bg-transparent text-body outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div ref={listRef} id={listId} role="listbox" aria-label={t('palette.title')} className="max-h-[60vh] overflow-y-auto p-2">
        {PALETTE_GROUPS.map((group) => {
          const inGroup = results.flatMap((item, index) => (item.group === group ? [{ item, index }] : []))
          if (inGroup.length === 0) return null
          return (
            <div key={group} role="group" aria-labelledby={`${listId}-${group}`} className="pb-1">
              <div id={`${listId}-${group}`} role="presentation" className="px-2 pt-2 pb-1 text-caption font-medium text-muted-foreground">
                {t(`palette.groups.${group}`)}
              </div>
              {inGroup.map(({ item, index }) => (
                <div
                  key={item.id}
                  id={optionId(index)}
                  role="option"
                  aria-selected={index === active}
                  onMouseMove={() => setActive(index)}
                  // Keep focus in the input while clicking.
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onRun(item)}
                  className={`flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-body ${index === active ? 'bg-blue/10 text-blue' : ''}`}
                >
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {item.hint && <span className="shrink-0 text-small text-muted-foreground">{item.hint}</span>}
                </div>
              ))}
            </div>
          )
        })}
      </div>
      {(isLoading || isError || (results.length === 0 && query.trim() !== '')) && (
        <p role="status" className="border-t border-border px-4 py-3 text-small text-muted-foreground">
          {isLoading ? t('palette.loading') : isError ? t('palette.loadFailed') : t('palette.empty', { query: query.trim() })}
        </p>
      )}
    </>
  )
}
