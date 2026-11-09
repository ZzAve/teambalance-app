import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { cn } from '@shared/lib/utils'
import { useTranslation } from 'react-i18next'

// A bottom sheet built on the Radix Dialog primitives (prototype A): it slides up from the bottom
// edge, spans the width (capped + centred on wider screens), and rounds its top corners. Same a11y
// as the dialog (focus trap, escape, labelled title) — only the anchoring/animation differ.
const Sheet = DialogPrimitive.Root
const SheetTrigger = DialogPrimitive.Trigger
const SheetClose = DialogPrimitive.Close
const SheetPortal = DialogPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
  />
))
SheetOverlay.displayName = 'SheetOverlay'

function CloseLabel() {
  const { t } = useTranslation()
  return <span className="sr-only">{t('shell.close')}</span>
}

// How far the grab strip must be dragged down before letting go closes the sheet.
const DISMISS_DRAG_PX = 80

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, style, ...props }, ref) => {
  const closeRef = React.useRef<HTMLButtonElement>(null)
  const [dragStartY, setDragStartY] = React.useState<number | null>(null)
  const [dragY, setDragY] = React.useState(0)
  const endDrag = (dismiss: boolean) => {
    setDragStartY(null)
    setDragY(0)
    // Pressing the close button closes through the Root's onOpenChange, like the X and Escape do.
    if (dismiss) closeRef.current?.click()
  }

  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92vh] w-full max-w-xl flex-col overflow-y-auto rounded-t-2xl border border-border/60 bg-background px-5 pb-8 pt-3 shadow-xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
          className,
        )}
        style={{
          ...style,
          transform: dragY ? `translateY(${dragY}px)` : undefined,
          // Follow the pointer 1:1 while dragging; spring back when released.
          transition: dragStartY === null ? 'transform 200ms ease-out' : 'none',
        }}
        {...props}
      >
        {/* Grab strip: the full width above the content. Dragging it down closes the sheet. Keyboard users
            have Escape and the X. touch-none keeps the browser from scrolling the page during the drag. */}
        <div
          data-slot="sheet-handle"
          aria-hidden="true"
          className="-mx-5 -mt-3 shrink-0 cursor-grab touch-none pb-3 pt-3"
          onPointerDown={(e) => {
            setDragStartY(e.clientY)
            e.currentTarget.setPointerCapture(e.pointerId)
          }}
          onPointerMove={(e) => {
            if (dragStartY !== null) setDragY(Math.max(0, e.clientY - dragStartY))
          }}
          onPointerUp={() => endDrag(dragY >= DISMISS_DRAG_PX)}
          onPointerCancel={() => endDrag(false)}
        >
          <div className="mx-auto h-1.5 w-10 rounded-full bg-border" />
        </div>
        {children}
        <DialogPrimitive.Close
          ref={closeRef}
          className="absolute right-4 top-4 rounded-sm after:absolute after:-inset-3.5 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <X className="h-4 w-4" />
          <CloseLabel />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </SheetPortal>
  )
})
SheetContent.displayName = 'SheetContent'

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mb-3 flex flex-col gap-1 text-center', className)} {...props} />
)
SheetHeader.displayName = 'SheetHeader'

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('font-display text-lead font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
SheetTitle.displayName = 'SheetTitle'

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn('text-small text-muted-foreground', className)} {...props} />
))
SheetDescription.displayName = 'SheetDescription'

export { Sheet, SheetTrigger, SheetClose, SheetPortal, SheetOverlay, SheetContent, SheetHeader, SheetTitle, SheetDescription }
