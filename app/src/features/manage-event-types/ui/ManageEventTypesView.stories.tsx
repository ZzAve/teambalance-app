import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { EventTypeItem } from '@shared/api/event-types'
import type { Position } from '@shared/api/positions'
import { makeEventType, ROSTER_OFF } from '@shared/testing/event-fixtures'
import { ManageEventTypesView } from './ManageEventTypesView'

// The admin surface behind the ManageEventTypes container: create / rename / recolor / archive, each
// type carrying the roster default its events inherit. Prop-only, so every state — including the
// destructive archive dialog and its migration offer — renders from props with no network (ADR-0017).
const POSITIONS: Position[] = [
  { id: 'p1', label: 'Setter' },
  { id: 'p2', label: 'Libero' },
]

const TYPES: EventTypeItem[] = [
  makeEventType({
    id: 'et-1',
    name: 'Match',
    color: '#225C9C',
    rosterDefault: {
      trackRoster: true,
      totalTarget: 12,
      positionTargets: [{ positionId: 'p1', count: 2 }],
    },
  }),
  makeEventType({ id: 'et-2', name: 'Training', color: '#249E6C', rosterDefault: ROSTER_OFF }),
]

const meta = {
  title: 'features/manage-event-types/ManageEventTypesView',
  component: ManageEventTypesView,
  args: {
    eventTypes: TYPES,
    positions: POSITIONS,
    onCreate: fn(),
    onUpdate: fn(),
    onArchive: fn(),
    onUnarchive: fn(),
  },
} satisfies Meta<typeof ManageEventTypesView>

export default meta

type Story = StoryObj<typeof meta>

export const Loading: Story = {
  args: { isLoading: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Loading…')).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Add event type' })).not.toBeInTheDocument()
  },
}

export const ErrorState: Story = {
  args: { isError: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Couldn't load event types. Please try again.")).toBeInTheDocument()
  },
}

export const Empty: Story = {
  args: { eventTypes: [] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No event types yet. Add one below.')).toBeInTheDocument()
  },
}

// Each row summarises what its type asks for, so an admin reads the whole configuration without
// opening anything — including the tracked-but-unrequired state, which is easily mistaken for a bug.
export const WithTypes: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Match')).toBeInTheDocument()
    await expect(canvas.getByText('2 Setter · 12 total')).toBeInTheDocument()
    await expect(canvas.getByText('No roster')).toBeInTheDocument()
  },
}

export const CreateEventType: Story = {
  // Behavioural twin of Empty — save closes the editor, so the post-play frame is the empty list
  // again (ADR-0027 §2). The spy is the point; the picture is Empty's.
  parameters: { chromatic: { disableSnapshot: true } },
  args: { eventTypes: [] },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Add event type' }))
    await userEvent.type(canvas.getByLabelText('Event type name'), 'Tournament')
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))

    await expect(args.onCreate).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Tournament', rosterDefault: ROSTER_OFF }),
    )
  },
}

// The roster default is authored in the same editor the per-event override uses, so the two can't
// disagree about what a blank field means.
export const EditRosterDefault: Story = {
  // Behavioural twin of WithTypes — save closes the editor and settles back to the list
  // (ADR-0027 §2). The mid-play frames (targets appearing when tracking is switched on) are
  // exercised here but pictured by RosterOverrideField's own stories.
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Edit Training' }))
    // Tracking starts off for Training, so the targets are hidden until it is switched on.
    await expect(canvas.queryByLabelText('People needed in total')).not.toBeInTheDocument()

    await userEvent.click(canvas.getByRole('switch', { name: 'Track roster' }))
    await userEvent.type(canvas.getByLabelText(/People needed in total/), '10')
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))

    await expect(args.onUpdate).toHaveBeenCalledWith(
      'et-2',
      expect.objectContaining({
        name: 'Training',
        rosterDefault: expect.objectContaining({ trackRoster: true, totalTarget: 10 }),
      }),
    )
  },
}

// A zero is "no target", the same as blank — and the same as what the server does with one.
export const ZeroTargetMeansNoTarget: Story = {
  // Behavioural twin of WithTypes — save closes the editor and settles back to the list
  // (ADR-0027 §2). What is being proven is the dropped target in the payload, not a picture.
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Edit Match' }))
    const setter = canvas.getByLabelText('Setter')
    await userEvent.clear(setter)
    await userEvent.type(setter, '0')
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))

    await expect(args.onUpdate).toHaveBeenCalledWith(
      'et-1',
      expect.objectContaining({
        rosterDefault: expect.objectContaining({ positionTargets: [] }),
      }),
    )
  },
}

// The destructive path. It leads with the migration offer, because leaving events on a type no
// picker shows is the fallback, not the default.
export const ArchiveWithMigration: Story = {
  // Behavioural twin of WithTypes — confirming closes the dialog, so the post-play frame is the
  // list again (ADR-0027 §2). The open dialog is pictured by ArchiveDialogOpen below.
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Archive Match' }))
    const dialog = within(document.body)
    await expect(await dialog.findByText('Archive "Match"?')).toBeInTheDocument()
    // Says plainly that no event is deleted — the fear this dialog has to answer.
    await expect(dialog.getByText(/no event is deleted/i)).toBeInTheDocument()

    await userEvent.selectOptions(dialog.getByLabelText(/Move its events/), 'et-2')
    await userEvent.click(dialog.getByRole('button', { name: 'Archive' }))

    await expect(args.onArchive).toHaveBeenCalledWith('et-1', 'et-2')
  },
}

// Declining the migration is a real choice, not an oversight: the events keep the archived type.
export const ArchiveWithoutMigration: Story = {
  // Behavioural twin of WithTypes — as above; this one proves the undefined migration target.
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Archive Match' }))
    const dialog = within(document.body)
    await userEvent.click(await dialog.findByRole('button', { name: 'Archive' }))

    await expect(args.onArchive).toHaveBeenCalledWith('et-1', undefined)
  },
}

// The archive dialog is the one screen that has to answer "will this delete my events?", and it
// leads with the migration offer rather than burying it. Both Archive stories above confirm, so the
// dialog is gone before Chromatic shoots — this one opens it and stops, so that wording carries a
// baseline (ADR-0027 §2).
export const ArchiveDialogOpen: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Archive Match' }))
    const dialog = within(document.body)
    await expect(await dialog.findByText('Archive "Match"?')).toBeInTheDocument()
    await expect(dialog.getByText(/no event is deleted/i)).toBeInTheDocument()
    // The migration picker leads; leaving it unset is the fallback, not the default.
    await expect(dialog.getByLabelText(/Move its events/)).toBeInTheDocument()
    await expect(args.onArchive).not.toHaveBeenCalled()
  },
}

export const WithArchivedTypes: Story = {
  args: {
    eventTypes: [
      ...TYPES,
      makeEventType({ id: 'et-3', name: 'Old Social', archived: true, rosterDefault: ROSTER_OFF }),
    ],
  },
  play: async ({ canvas, userEvent, args }) => {
    // Archived types are listed apart, and cannot be edited — only restored.
    await expect(canvas.getByText('Archived')).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Edit Old Social' })).not.toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Restore Old Social' }))
    await expect(args.onUnarchive).toHaveBeenCalledWith('et-3')
  },
}

export const NameTaken: Story = {
  args: { errorCode: 'EVENT_TYPE_NAME_TAKEN' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('That event type already exists.')).toBeInTheDocument()
  },
}

// The editor hides optimistically on submit — the admin sees the save land rather than watching a
// spinner. That it comes BACK on a rejection (draft intact) is the pure rule in lib/editor-open,
// unit-tested there; a story cannot change args mid-play to drive the second half.
export const SubmitClosesTheEditorOptimistically: Story = {
  // Behavioural twin of Empty — asserts the editor is gone, which IS the empty-list picture
  // (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  args: { eventTypes: [] },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Add event type' }))
    await userEvent.type(canvas.getByLabelText('Event type name'), 'Match')
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))

    await expect(canvas.queryByLabelText('Event type name')).not.toBeInTheDocument()
  },
}

// Every code the container can produce says something. Silence would be indistinguishable from a
// save that worked.
export const UnhandledErrorStillSpeaks: Story = {
  args: { errorCode: 'FORBIDDEN' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('You are not allowed to make this change.')).toBeInTheDocument()
  },
}

// The rule that stops a team archiving its way to no types at all, and no way to create an event.
export const LastEventTypeRefused: Story = {
  args: { errorCode: 'LAST_EVENT_TYPE' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('A team must keep at least one active event type.')).toBeInTheDocument()
  },
}
