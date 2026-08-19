import { useThemeStore } from '@shared/theme/theme-store'
import { ThemeToggleView } from './ThemeToggleView'

/**
 * Thin container for the appearance control: reads the preference from the theme store and writes
 * the user's choice straight back. There is no network and no local state, so everything worth
 * asserting lives in ThemeToggleView's story; the DOM effects belong to `useThemeSync` in the root
 * layout, which is the single writer of the `.dark` class and the theme-color meta.
 */
export function ThemeToggle() {
  const preference = useThemeStore((state) => state.preference)
  const setPreference = useThemeStore((state) => state.setPreference)

  return <ThemeToggleView value={preference} onChange={setPreference} />
}
