import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GenerateInviteDialog } from './GenerateInviteDialog'

const server = setupServer(
  http.post('/api/invitations', () =>
    HttpResponse.json({ token: 'abc123', expiresAt: '2027-01-01T00:00:00Z' }, { status: 201 }),
  ),
)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function renderWithClient() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <GenerateInviteDialog />
    </QueryClientProvider>,
  )
}

describe('GenerateInviteDialog', () => {
  it('generates and displays an invite link when opened', async () => {
    renderWithClient()

    await userEvent.click(screen.getByRole('button', { name: 'Invite Link' }))

    await waitFor(() => {
      expect(screen.getByDisplayValue(/\/invite\/abc123$/)).toBeInTheDocument()
    })
  })

  it('copies the invite link to the clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })

    renderWithClient()
    await userEvent.click(screen.getByRole('button', { name: 'Invite Link' }))
    await waitFor(() => screen.getByDisplayValue(/\/invite\/abc123$/))

    await userEvent.click(screen.getByRole('button', { name: 'Copy' }))

    expect(writeText).toHaveBeenCalledWith(expect.stringMatching(/\/invite\/abc123$/))
    expect(await screen.findByRole('button', { name: 'Copied!' })).toBeInTheDocument()
  })
})
