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

describe('global.css button cursor', () => {
  it('gives every enabled button the pointer, in the base layer so utilities still override it', () => {
    const match = css.match(/@layer base \{[\s\S]*?\n\}/)
    expect(match).not.toBeNull()
    expect(match![0]).toMatch(/button:not\(:disabled\)[\s\S]*cursor: pointer/)
  })
})

// Error text sits straight on the page background and on cards. Plain red is 4.42:1 on the light
// background, under the 4.5:1 that 13px text needs, and one flat red cannot serve both themes, so
// red-ink carries the per-theme value (like gold-ink). A visual diff does not fail on contrast.
describe('global.css red-ink', () => {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '')

  function declarationsOf(header: string): Map<string, string> {
    const start = stripped.indexOf(`\n${header} {\n`)
    if (start === -1) throw new Error(`global.css has no "${header} {" block`)
    const end = stripped.indexOf('\n}', start)
    const block = stripped.slice(start, end)
    return new Map([...block.matchAll(/^\s*(--[\w-]+):\s*([^;]+);/gm)].map(([, name, value]) => [name, value.trim()]))
  }

  const theme = { light: declarationsOf('@theme'), dark: declarationsOf('.dark') }

  function resolve(mode: 'light' | 'dark', name: string): string {
    const value = theme[mode].get(name) ?? theme.light.get(name)
    if (value === undefined) throw new Error(`${name} is not declared for ${mode}`)
    const alias = value.match(/^var\((--[\w-]+)\)$/)
    return alias ? resolve(mode, alias[1]) : value
  }

  function luminance(hex: string): number {
    const [r, g, b] = [1, 3, 5].map((i) => {
      const channel = parseInt(hex.slice(i, i + 2), 16) / 255
      return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  function contrast(foreground: string, background: string): number {
    const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a)
    return (lighter + 0.05) / (darker + 0.05)
  }

  it.each([
    ['light', 'background'],
    ['light', 'card'],
    ['dark', 'background'],
    ['dark', 'card'],
  ] as const)('%s: clears 4.5:1 on --color-%s', (mode, surface) => {
    const ratio = contrast(resolve(mode, '--color-red-ink'), resolve(mode, `--color-${surface}`))
    expect(ratio).toBeGreaterThanOrEqual(4.5)
  })
})
