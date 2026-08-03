import { MAX_SLUG_LENGTH } from './validate-slug'

/**
 * Suggests a URL slug from a team name — pure UX sugar (#158): it pre-fills the slug field until the
 * user edits it. It carries **no correctness contract** (the backend validates the submitted slug, it
 * does not derive one), so a suggestion that needs tidying is fine. Lowercases, turns each run of
 * non-alphanumerics into a single hyphen, trims stray hyphens, and caps at the max slug length.
 */
export function suggestSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-+$/g, '')
}
