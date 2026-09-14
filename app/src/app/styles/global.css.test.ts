import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// #337: four independent animation systems stacked with no prefers-reduced-motion escape hatch.
// This is the lowest layer that proves the CSS fix landed — jsdom doesn't evaluate @media queries
// against a real UA, so we assert on the text of the block itself rather than computed style.
const cssPath = join(dirname(fileURLToPath(import.meta.url)), 'global.css')
const css = readFileSync(cssPath, 'utf-8')

describe('global.css prefers-reduced-motion', () => {
  it('defines a reduced-motion media block covering every animation system', () => {
    const match = css.match(/@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\n\}/)
    expect(match).not.toBeNull()

    const block = match![0]
    expect(block).toContain('.card-enter')
    expect(block).toContain('.att-bounce')
    expect(block).toContain('view-transition')
  })
})
