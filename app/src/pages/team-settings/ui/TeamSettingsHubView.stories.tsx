import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { appShell } from '../../../../storybook-support/app-shell-decorator'
import { dutchMode } from '../../../../.storybook/modes'
import { TeamSettingsHubView } from './TeamSettingsHubView'

// The Team settings hub as a phone shows it, inside the real app shell on the Team tab: one row per
// setting with its current value, in three groups. Each row opens /team/settings/<section>.
const shell = appShell('team')

const meta = {
  title: 'pages/team-settings/TeamSettingsHubView',
  component: TeamSettingsHubView,
  decorators: shell.decorators,
  parameters: shell.parameters,
  args: {
    hints: {
      positions: '6',
      eventTypes: '3',
      season: 'Sept 2026 – May 2027',
      matchFeed: 'Setpoint H1',
      moneyPool: 'On · beer €2.50',
      bunq: 'Connected',
      platformAccess: '2 visits',
    },
  },
} satisfies Meta<typeof TeamSettingsHubView>

export default meta

type Story = StoryObj<typeof meta>

const SECTIONS: [string, string][] = [
  ['Positions', 'positions'],
  ['Event types', 'event-types'],
  ['Season', 'season'],
  ['Match feed', 'match-feed'],
  ['Money pool', 'money'],
  ['Bunq', 'bunq'],
  ['Hand over as admin', 'handover'],
  ['Platform access', 'access'],
]

export const Data: Story = {
  parameters: { chromatic: { modes: dutchMode } },
  play: async ({ canvas, globals }) => {
    if (globals.locale === 'nl') {
      await expect(canvas.getByRole('heading', { name: 'Seizoensopzet' })).toBeInTheDocument()
      return
    }
    await expect(canvas.getByRole('link', { name: 'Back to team' })).toHaveAttribute('href', '/t/setpoint-vt/team')
    const groups = canvas.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)
    await expect(groups).toEqual(['Season setup', 'Money', 'Access'])
    for (const [title, section] of SECTIONS) {
      await expect(canvas.getByRole('link', { name: new RegExp(`^${title}`) })).toHaveAttribute(
        'href',
        `/t/setpoint-vt/team/settings/${section}`,
      )
    }
    // Each row says its current value.
    await expect(canvas.getByRole('link', { name: /^Money pool/ })).toHaveTextContent('On · beer €2.50')
    await expect(canvas.getByRole('link', { name: /^Platform access/ })).toHaveTextContent('2 visits')
    // People are edited on their own page, not here.
    await expect(canvas.queryByRole('link', { name: /^Members/ })).not.toBeInTheDocument()
  },
}

// While the queries behind the values load, the rows are there without a value line.
export const Shells: Story = {
  args: { hints: {} },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Positions' })).toHaveTextContent(/^Positions$/)
    await expect(canvas.getAllByRole('link', { name: /./ }).length).toBeGreaterThanOrEqual(SECTIONS.length)
  },
}
