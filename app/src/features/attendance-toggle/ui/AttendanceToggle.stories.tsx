import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { allModes } from '../../../../.storybook/modes'
import { AttendanceToggle } from './AttendanceToggle'

// AttendanceToggle is presentational (value/onToggle/disabled). Each response state is a render arg;
// the aria-pressed button is the observable contract. The mutation lives in the page container, so
// there is nothing to mock — every state is a plain story.
//
// Token-sensitive component (ADR-0027 §3): the pressed states carry the semantic attendance colours
// (green/gold/red), which a token or Tailwind bump can break in dark while light stays green. Modes
// at the meta level give every state a light *and* a dark baseline.
const meta = {
  title: 'features/attendance-toggle/AttendanceToggle',
  component: AttendanceToggle,
  args: { onToggle: fn() },
  parameters: { chromatic: { modes: { light: allModes.light, dark: allModes.dark } } },
} satisfies Meta<typeof AttendanceToggle>

export default meta

type Story = StoryObj<typeof meta>

// Exactly one button is pressed per selected state; the other two are not.
async function expectPressed(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
  pressedName: string,
) {
  for (const name of ['Going', 'Maybe', "Can't go"]) {
    await expect(canvas.getByRole('button', { name })).toHaveAttribute(
      'aria-pressed',
      String(name === pressedName),
    )
  }
}

export const Attending: Story = {
  args: { value: 'ATTENDING' },
  play: async ({ canvas }) => expectPressed(canvas, 'Going'),
}

export const Maybe: Story = {
  args: { value: 'MAYBE' },
  play: async ({ canvas }) => expectPressed(canvas, 'Maybe'),
}

export const Absent: Story = {
  args: { value: 'ABSENT' },
  play: async ({ canvas }) => expectPressed(canvas, "Can't go"),
}

export const NotResponded: Story = {
  args: { value: 'NOT_RESPONDED' },
  play: async ({ canvas, userEvent, args }) => {
    // No option matches → none is pressed. Clicking one reports its value to the container.
    await expectPressed(canvas, '')
    await userEvent.click(canvas.getByRole('button', { name: 'Going' }))
    await expect(args.onToggle).toHaveBeenCalledWith('ATTENDING')
  },
}

export const Disabled: Story = {
  args: { value: 'ATTENDING', disabled: true },
  play: async ({ canvas }) => {
    for (const name of ['Going', 'Maybe', "Can't go"]) {
      await expect(canvas.getByRole('button', { name })).toBeDisabled()
    }
  },
}
