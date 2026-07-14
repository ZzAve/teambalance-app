import { test, expect } from '@playwright/test'
import { login } from './helpers'

// Isolate-first filter chips: from the all-active state a tap isolates that
// type; from a subset a tap toggles it; deselecting the last chip restores all.
test('event type chips isolate first, then toggle subsets, then restore all', async ({ page }) => {
  await login(page)

  const trainingChip = page.getByRole('button', { name: 'Training', exact: true })
  const matchChip = page.getByRole('button', { name: 'Match', exact: true })
  const matchCard = page.getByText('League Match vs Smash United')
  const tournamentCard = page.getByText('Spring Tournament')
  const trainingCard = page.getByText('Friendly (date TBC)')

  // All types active: events of every type are listed.
  await expect(matchCard).toBeVisible()
  await expect(tournamentCard).toBeVisible()

  // Tapping Training from all-active isolates it.
  await trainingChip.click()
  await expect(trainingCard).toBeVisible()
  await expect(matchCard).toBeHidden()
  await expect(tournamentCard).toBeHidden()

  // Tapping Match from a subset adds it (Training + Match).
  await matchChip.click()
  await expect(matchCard).toBeVisible()
  await expect(trainingCard).toBeVisible()
  await expect(tournamentCard).toBeHidden()

  // Toggling Training off leaves only Match.
  await trainingChip.click()
  await expect(trainingCard).toBeHidden()
  await expect(matchCard).toBeVisible()

  // Deselecting the last active chip restores all types.
  await matchChip.click()
  await expect(trainingCard).toBeVisible()
  await expect(matchCard).toBeVisible()
  await expect(tournamentCard).toBeVisible()
})
