import { render, screen } from '@testing-library/react'
import { RootErrorBoundary } from './RootErrorBoundary'

// The prod crash surfaced as React's onUncaughtError with the thrown value `undefined` — an error
// that escaped every boundary and blanked the root. This boundary must catch exactly that (a thrown
// primitive/undefined, not just an Error) and render the themed retry screen instead of nothing.
function Thrower({ value }: { value: unknown }): never {
  throw value
}

describe('RootErrorBoundary', () => {
  it('renders the children when nothing throws', () => {
    render(
      <RootErrorBoundary>
        <p>all good</p>
      </RootErrorBoundary>,
    )
    expect(screen.getByText('all good')).toBeInTheDocument()
  })

  it('catches a thrown `undefined` and shows the themed retry fallback (not a blank frame)', () => {
    // React logs the caught error; silence the expected noise so the run stays readable.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <RootErrorBoundary>
        <Thrower value={undefined} />
      </RootErrorBoundary>,
    )
    expect(screen.getByText(/couldn't load this page/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    spy.mockRestore()
  })

  it('also catches a thrown Error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <RootErrorBoundary>
        <Thrower value={new Error('boom')} />
      </RootErrorBoundary>,
    )
    expect(screen.getByText(/couldn't load this page/i)).toBeInTheDocument()
    spy.mockRestore()
  })
})
