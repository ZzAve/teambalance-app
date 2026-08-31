import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import type { ReferenceRow } from '../lib/references'
import { ReferenceRowsEditor } from './ReferenceRowsEditor'

// Stateful wrapper — the editor is controlled, so the story owns the rows to exercise add/remove.
// `onChange` (default fn() spy from meta) is forwarded before the local state update so a story can
// assert the prop-contract — that an edit reports the next rows array up — while the controlled
// editor still re-renders from the updated state.
function Harness({
  initial = [] as ReferenceRow[],
  onChange,
}: {
  initial?: ReferenceRow[]
  onChange?: (rows: ReferenceRow[]) => void
}) {
  const [rows, setRows] = useState<ReferenceRow[]>(initial)
  return (
    <ReferenceRowsEditor
      rows={rows}
      onChange={(next) => {
        onChange?.(next)
        setRows(next)
      }}
    />
  )
}

const meta = {
  title: 'entities/event/ReferenceRowsEditor',
  component: Harness,
  args: { onChange: fn() },
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

// Prop-contract: adding a row and typing into it each report the next rows array up via onChange.
// The stateful stories above assert the resulting DOM; this asserts the wiring — that the add and
// update paths call onChange with the expected array, which a getByLabelText check can't prove.
export const ReportsEdits: Story = {
  // Behavioural twin of AddAndRemove — the onChange spy's final frame is AddAndRemove's added-row
  // state (ADR-0027 §2).
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Add link/ }))
    await expect(args.onChange).toHaveBeenCalledWith([{ title: '', url: '' }])

    await userEvent.type(canvas.getByLabelText('Link 1 URL'), 'https://nevobo.nl')
    await expect(args.onChange).toHaveBeenLastCalledWith([{ title: '', url: 'https://nevobo.nl' }])
  },
}
