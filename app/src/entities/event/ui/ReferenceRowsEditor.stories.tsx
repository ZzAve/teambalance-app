import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import type { ReferenceRow } from '../lib/references'
import { ReferenceRowsEditor } from './ReferenceRowsEditor'

// Stateful wrapper — the editor is controlled, so the story owns the rows to exercise add/remove.
function Harness({ initial = [] as ReferenceRow[] }) {
  const [rows, setRows] = useState<ReferenceRow[]>(initial)
  return <ReferenceRowsEditor rows={rows} onChange={setRows} />
}

const meta = {
  title: 'entities/event/ReferenceRowsEditor',
  component: Harness,
} satisfies Meta<typeof Harness>

export default meta

type Story = StoryObj<typeof meta>

export const AddAndRemove: Story = {
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.queryByLabelText('Link 1 URL')).not.toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: /Add link/ }))
    await expect(canvas.getByLabelText('Link 1 URL')).toBeInTheDocument()
    await expect(canvas.getByLabelText('Link 1 label')).toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: /Add link/ }))
    await expect(canvas.getByLabelText('Link 2 URL')).toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Remove link 1' }))
    await expect(canvas.queryByLabelText('Link 2 URL')).not.toBeInTheDocument()
    await expect(canvas.getByLabelText('Link 1 URL')).toBeInTheDocument()
  },
}

export const Prefilled: Story = {
  args: { initial: [{ title: 'Nevobo', url: 'https://nevobo.nl' }] },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Link 1 label')).toHaveValue('Nevobo')
    await expect(canvas.getByLabelText('Link 1 URL')).toHaveValue('https://nevobo.nl')
  },
}
