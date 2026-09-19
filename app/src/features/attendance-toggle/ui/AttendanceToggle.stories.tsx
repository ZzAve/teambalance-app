import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { darkMode } from '../../../../.storybook/modes'
import { AttendanceToggle, type AttendanceState } from './AttendanceToggle'

// AttendanceToggle is presentational (value/onToggle/disabled). Each response state is a render arg;
// the aria-pressed button is the observable contract. The mutation lives in the page container, so
// there is nothing to mock — every state is a plain render.
//
// Token-sensitive component (ADR-0027 §3): the pressed states carry the semantic attendance colours
// (green/gold/red), which a token or Tailwind bump can break in dark while light stays green. Modes
// at the meta level give every state a light *and* a dark baseline.
//
// One gallery story (ADR-0032 §2): every variant side by side, one snapshot, every branch asserted.
// `Interactions` (disableSnapshot) keeps the one prop-contract spy: clicking an option reports its
// value to the container.
const VARIANTS: Record<string, { value: AttendanceState; disabled?: boolean }> = {
  attending: { value: 'ATTENDING' },
  maybe: { value: 'MAYBE' },
  absent: { value: 'ABSENT' },
  notResponded: { value: 'NOT_RESPONDED' },
  disabled: { value: 'ATTENDING', disabled: true },
}

const meta = {
  title: 'features/attendance-toggle/AttendanceToggle',
  component: AttendanceToggle,
  args: { onToggle: fn() },
  parameters: { chromatic: { modes: darkMode } },
} satisfies Meta<typeof AttendanceToggle>

export default meta

type Story = StoryObj<typeof meta>

// Exactly one button is pressed per selected state; the other two are not.
async function expectPressed(canvas: ReturnType<typeof within>, pressedName: string) {
  for (const name of ['Going', 'Maybe', "Can't go"]) {
    await expect(canvas.getByRole('button', { name })).toHaveAttribute(
      'aria-pressed',
      String(name === pressedName),
    )
  }
}

export const Gallery: Story = {
  // Unused by render below — every variant supplies its own `value` — but required to satisfy the
  // story's prop contract (`value` is required on AttendanceToggle).
  args: { value: 'ATTENDING' },
  render: (args) => (
    <div className="flex flex-wrap items-start gap-6">
      {Object.entries(VARIANTS).map(([name, props]) => (
        <div key={name} data-testid={`variant-${name}`}>
          <AttendanceToggle {...args} {...props} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const variant = (name: keyof typeof VARIANTS) => within(canvas.getByTestId(`variant-${name}`))

    await expectPressed(variant('attending'), 'Going')
    await expectPressed(variant('maybe'), 'Maybe')
    await expectPressed(variant('absent'), "Can't go")
    // No option matches NOT_RESPONDED → none is pressed.
    await expectPressed(variant('notResponded'), '')

    for (const name of ['Going', 'Maybe', "Can't go"]) {
      await expect(variant('disabled').getByRole('button', { name })).toBeDisabled()
    }
  },
}

// Picture owned by Gallery — behavioural only (ADR-0032 §1).
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  args: { value: 'NOT_RESPONDED' },
  play: async ({ canvas, userEvent, args }) => {
    // Clicking an option reports its value to the container.
    await userEvent.click(canvas.getByRole('button', { name: 'Going' }))
    await expect(args.onToggle).toHaveBeenCalledWith('ATTENDING')
  },
}
