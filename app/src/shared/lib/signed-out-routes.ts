// The demo build's signed-out screens (persona picker, top-up page): no one is signed in, so the tab bar has nowhere to go.
export function hidesBottomNav(pathname: string): boolean {
  const path = pathname.replace(/\/$/, '')
  return path === '/demo' || path === '/demo-top-up'
}
