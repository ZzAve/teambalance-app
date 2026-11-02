import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Stack } from '@shared/testing/stack'
import { Avatar } from './avatar'

// A stand-in photo that needs no network: a flat portrait as an inline SVG.
const PHOTO =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="#2f6f4f"/>' +
      '<circle cx="128" cy="104" r="48" fill="#f2c14e"/><rect x="56" y="168" width="144" height="88" rx="64" fill="#f2c14e"/></svg>',
  )

const meta = {
  title: 'shared/ui/Avatar',
  component: Avatar,
  args: { userId: 'u1', name: 'Ada Lovelace' },
} satisfies Meta<typeof Avatar>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  render: (args) => (
    <Stack
      items={{
        Initials: (
          <div className="flex items-center gap-3">
            <Avatar {...args} size="sm" />
            <Avatar {...args} size="md" />
            <Avatar {...args} size="lg" />
          </div>
        ),
        Photo: (
          <div className="flex items-center gap-3">
            <Avatar {...args} size="sm" photoUrl={PHOTO} />
            <Avatar {...args} size="md" photoUrl={PHOTO} />
            <Avatar {...args} size="lg" photoUrl={PHOTO} />
          </div>
        ),
        // A photo that cannot be fetched shows the initials, never a broken image.
        'Photo fails to load': <Avatar {...args} size="md" photoUrl="/no-such-photo.webp" />,
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => canvas.getByRole('region', { name })
    await expect(region('Initials')).toHaveTextContent('AL')
    await expect(region('Photo').querySelectorAll('img')).toHaveLength(3)
    await expect(await within(region('Photo fails to load')).findByText('AL')).toBeInTheDocument()
    await expect(region('Photo fails to load').querySelector('img')).toBeNull()
  },
}
