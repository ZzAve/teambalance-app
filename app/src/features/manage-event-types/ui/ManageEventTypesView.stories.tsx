import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { EventTypeItem } from '@shared/api/event-types'
import type { Position } from '@shared/api/positions'
import { Stack } from '@shared/testing/stack'
import { makeEventType, ROSTER_OFF } from '@shared/testing/event-fixtures'
import { ManageEventTypesView } from './ManageEventTypesView'

// The admin surface behind the ManageEventTypes container: create / rename / recolor / archive, each
// type carrying the roster default its events inherit. Prop-only, so every state — including the
// archive dialog and its migration offer — renders from props with no network (ADR-0017).
//
// One quiet row per type (issue #341, variant B): colour dot + name + roster summary as text, and a
// single overflow (⋯) menu carrying "Edit" and "Archive…" — Archive is deliberately NOT the red
// destructive treatment, since it only ever hides a type (reversible from the Archived section).
//
// Three-story shape (ADR-0032 §1):
//   1. Data — the one populated live instance, and the picture of this View.
//   2. Shells — every non-data state (load / error / empty / archived / the three error codes)
//      stacked in one frame, each state's assertions scoped to its labelled region.
//   3. Interactions — no picture; one play walks every interaction (create, edit a roster default,
//      drop a target to zero, archive with and without migration), routed through each row's ⋯ menu,
//      and keeps every onCreate/onUpdate/onArchive/onUnarchive spy assertion.
// Plus two extra pictures for frames no composite shows: ArchiveDialogOpen (the open dialog) and
// MenuOpen (the open ⋯ menu itself — a distinct frame the Interactions play never rests on, since it
// always proceeds to click a menu item).
const POSITIONS: Position[] = [
  { id: 'p1', label: 'Setter', kind: 'PLAYING' },
  { id: 'p2', label: 'Libero', kind: 'PLAYING' },
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

const WITH_ARCHIVED: EventTypeItem[] = [
  ...TYPES,
  makeEventType({ id: 'et-3', name: 'Old Social', archived: true, rosterDefault: ROSTER_OFF }),
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

// Each row summarises what its type asks for, so an admin reads the whole configuration without
// opening anything — including the tracked-but-unrequired state, which is easily mistaken for a bug.
export const Data: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Match')).toBeInTheDocument()
    await expect(canvas.getByText('2 Setter · 12 total')).toBeInTheDocument()
    await expect(canvas.getByText('No roster')).toBeInTheDocument()
    // One overflow-menu trigger per row, no inline Edit/Archive buttons.
    await expect(canvas.getAllByLabelText(/^Actions for /)).toHaveLength(2)
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Loading: <ManageEventTypesView {...args} isLoading />,
        Error: <ManageEventTypesView {...args} isError />,
        Empty: <ManageEventTypesView {...args} eventTypes={[]} />,
        // Archived types are listed apart, and cannot be edited — only restored.
        'With archived types': <ManageEventTypesView {...args} eventTypes={WITH_ARCHIVED} />,
        'Name taken': <ManageEventTypesView {...args} errorCode="EVENT_TYPE_NAME_TAKEN" />,
        // Every code the container can produce says something. Silence would be indistinguishable
        // from a save that worked.
        'Not allowed': <ManageEventTypesView {...args} errorCode="FORBIDDEN" />,
        // The rule that stops a team archiving its way to no types at all, and no way to create an
        // event.
        'Last type refused': <ManageEventTypesView {...args} errorCode="LAST_EVENT_TYPE" />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument()
    await expect(
      region('Loading').queryByRole('button', { name: 'Add event type' }),
    ).not.toBeInTheDocument()

    await expect(
      region('Error').getByText("Couldn't load event types. Please try again."),
    ).toBeInTheDocument()

    await expect(region('Empty').getByText('No event types yet. Add one below.')).toBeInTheDocument()

    await expect(region('With archived types').getByText('Archived')).toBeInTheDocument()
    // Archived rows only offer Restore — no ⋯ actions menu at all.
    await expect(
      region('With archived types').queryByLabelText('Actions for Old Social'),
    ).not.toBeInTheDocument()

    await expect(
      region('Name taken').getByText('That event type already exists.'),
    ).toBeInTheDocument()
    await expect(
      region('Not allowed').getByText('You are not allowed to make this change.'),
    ).toBeInTheDocument()
    await expect(
      region('Last type refused').getByText('A team must keep at least one active event type.'),
    ).toBeInTheDocument()
  },
}

// The ⋯ menu itself is a frame the Interactions play never rests on — every step that opens it goes
// on to click a menu item. Archive… is deliberately not the red destructive treatment (it only ever
// hides a type, and can be restored), so this is also where that non-styling carries a baseline.
export const MenuOpen: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Match'))
    const menu = within(document.body)
    const archiveItem = await menu.findByRole('menuitem', { name: 'Archive…' })
    await expect(menu.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument()
    await expect(archiveItem).not.toHaveAttribute('data-tone', 'destructive')
  },
}

// The archive dialog is the one screen that has to answer "will this delete my events?", and it
// leads with the migration offer rather than burying it. The Interactions play below confirms it
// twice (with and without migration), so the dialog is gone before Chromatic shoots — this one opens
// it (via the row's ⋯ menu) and stops, so that wording carries a baseline (ADR-0027 §2).
export const ArchiveDialogOpen: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByLabelText('Actions for Match'))
    const portal = within(document.body)
    await userEvent.click(await portal.findByRole('menuitem', { name: 'Archive…' }))
    await expect(await portal.findByText('Archive "Match"?')).toBeInTheDocument()
    // Says plainly that no event is deleted — the fear this dialog has to answer.
    await expect(portal.getByText(/no event is deleted/i)).toBeInTheDocument()
    // The migration picker leads; leaving it unset is the fallback, not the default.
    await expect(portal.getByLabelText(/Move its events/)).toBeInTheDocument()
    await expect(args.onArchive).not.toHaveBeenCalled()
  },
}

// Picture owned by Data, Shells, MenuOpen and ArchiveDialogOpen — behavioural only (ADR-0032 §1).
// Three instances because the create flow needs an empty list to create into and restoring needs an
// archived type, while the rest edit and archive types already on the list.
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        List: <ManageEventTypesView {...args} />,
        Empty: <ManageEventTypesView {...args} eventTypes={[]} />,
        Archived: <ManageEventTypesView {...args} eventTypes={WITH_ARCHIVED} />,
      }}
    />
  ),
  play: async ({ canvas, userEvent, args }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))
    const portal = within(document.body)

    // Creating: the editor hides optimistically on submit — the admin sees the save land rather
    // than watching a spinner.
    await userEvent.click(region('Empty').getByRole('button', { name: 'Add event type' }))
    await userEvent.type(region('Empty').getByLabelText('Event type name'), 'Tournament')
    await userEvent.click(region('Empty').getByRole('button', { name: 'Save' }))
    await expect(args.onCreate).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Tournament', rosterDefault: ROSTER_OFF }),
    )
    await expect(region('Empty').queryByLabelText('Event type name')).not.toBeInTheDocument()

    // The roster default is authored in the same editor the per-event override uses, so the two
    // can't disagree about what a blank field means. Reached via the row's ⋯ menu, not an inline
    // Edit button.
    await userEvent.click(region('List').getByLabelText('Actions for Training'))
    await userEvent.click(await portal.findByRole('menuitem', { name: 'Edit' }))
    // Tracking starts off for Training, so the targets are hidden until it is switched on.
    await expect(region('List').queryByLabelText('People needed in total')).not.toBeInTheDocument()
    await userEvent.click(region('List').getByRole('switch', { name: 'Track roster' }))
    await userEvent.type(region('List').getByLabelText(/People needed in total/), '10')
    await userEvent.click(region('List').getByRole('button', { name: 'Save' }))
    await expect(args.onUpdate).toHaveBeenCalledWith(
      'et-2',
      expect.objectContaining({
        name: 'Training',
        rosterDefault: expect.objectContaining({ trackRoster: true, totalTarget: 10 }),
      }),
    )

    // A zero is "no target", the same as blank — and the same as what the server does with one.
    await userEvent.click(region('List').getByLabelText('Actions for Match'))
    await userEvent.click(await portal.findByRole('menuitem', { name: 'Edit' }))
    const setter = region('List').getByLabelText('Setter')
    await userEvent.clear(setter)
    await userEvent.type(setter, '0')
    await userEvent.click(region('List').getByRole('button', { name: 'Save' }))
    await expect(args.onUpdate).toHaveBeenCalledWith(
      'et-1',
      expect.objectContaining({
        rosterDefault: expect.objectContaining({ positionTargets: [] }),
      }),
    )

    // The destructive path. It leads with the migration offer, because leaving events on a type no
    // picker shows is the fallback, not the default. Reached via the ⋯ menu; Archive… itself carries
    // no destructive styling (it only ever hides a type — MenuOpen carries that baseline).
    await userEvent.click(region('List').getByLabelText('Actions for Match'))
    await userEvent.click(await portal.findByRole('menuitem', { name: 'Archive…' }))
    await expect(await portal.findByText('Archive "Match"?')).toBeInTheDocument()
    // Says plainly that no event is deleted — the fear this dialog has to answer.
    await expect(portal.getByText(/no event is deleted/i)).toBeInTheDocument()
    await userEvent.selectOptions(portal.getByLabelText(/Move its events/), 'et-2')
    await userEvent.click(portal.getByRole('button', { name: 'Archive' }))
    await expect(args.onArchive).toHaveBeenCalledWith('et-1', 'et-2')

    // Declining the migration is a real choice, not an oversight: the events keep the archived type.
    await userEvent.click(region('List').getByLabelText('Actions for Match'))
    await userEvent.click(await portal.findByRole('menuitem', { name: 'Archive…' }))
    await userEvent.click(await portal.findByRole('button', { name: 'Archive' }))
    await expect(args.onArchive).toHaveBeenCalledWith('et-1', undefined)

    // Restoring an archived type is the only action its row offers — no ⋯ menu for archived rows.
    await userEvent.click(region('Archived').getByRole('button', { name: 'Restore Old Social' }))
    await expect(args.onUnarchive).toHaveBeenCalledWith('et-3')
  },
}
