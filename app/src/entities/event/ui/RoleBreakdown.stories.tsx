import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { RoleBreakdown } from './RoleBreakdown'

const meta = {
  title: 'entities/event/RoleBreakdown',
  component: RoleBreakdown,
} satisfies Meta<typeof RoleBreakdown>

export default meta

type Story = StoryObj<typeof meta>

export const Populated: Story = {
  args: {
    breakdown: [
      { role: 'Setter', attending: 2 },
      { role: 'Outside Hitter', attending: 3 },
      { role: 'Libero', attending: 1 },
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('2 Setter')).toBeInTheDocument()
    await expect(canvas.getByText('3 Outside Hitter')).toBeInTheDocument()
    await expect(canvas.getByText('1 Libero')).toBeInTheDocument()
  },
}

export const Empty: Story = {
  args: {
    breakdown: [],
  },
  play: async ({ canvasElement }) => {
    // Nothing to break down -> the component renders nothing at all.
    await expect(canvasElement).toBeEmptyDOMElement()
  },
}

// The backend groups the attending summary by position and includes an "Unassigned" bucket for
// members with no position; the component renders whatever the API returns, verbatim.
export const WithUnassigned: Story = {
  args: {
    breakdown: [
      { role: 'Setter', attending: 2 },
      { role: 'Libero', attending: 1 },
      { role: 'Unassigned', attending: 3 },
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('2 Setter')).toBeInTheDocument()
    await expect(canvas.getByText('3 Unassigned')).toBeInTheDocument()
  },
}
