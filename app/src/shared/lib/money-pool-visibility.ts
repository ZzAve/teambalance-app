/**
 * Off hides the Money tab and the Money route. Unknown (no session, or the flag not delivered yet)
 * counts as on: the page's own request still answers Off, and nothing is hidden on a guess.
 */
export function isMoneyPoolOff(user: { moneyPoolEnabled?: boolean } | null | undefined): boolean {
  return user?.moneyPoolEnabled === false
}
