// Chromatic modes (ADR-0032 §4-§5) and the Storybook viewport axis they share their widths with.
//
// A mode re-renders a story with globals and/or a browser viewport flipped: same args, same `play`,
// one extra snapshot with its own baseline. Two axes live here:
//
//   - viewport — the app is a single-column, mobile-first layout (`max-w-2xl` main container), so the
//     phone width is the picture that matters. preview.ts applies `xs` globally, which means *every*
//     baseline is captured at phone width instead of Chromatic's 1200px default. Page composites add
//     `xl` so the centred-desktop layout has one guard too.
//   - theme — the `.dark` token layer (preview.ts `theme` global). Only page composites and the
//     token-sensitive galleries carry `xsDark`; everything else inherits dark coverage through the
//     composite it is rendered in.
//
// Widths track Tailwind 4's default breakpoints (sm 640 / md 768 / lg 1024 / xl 1280) plus a 360px
// phone below `sm`. VIEWPORTS is the single source for both the toolbar switcher and the modes, so
// the two can never disagree about what "xs" means.
export const VIEWPORTS = {
  xs: { width: 360, height: 780, type: 'mobile' },
  sm: { width: 640, height: 960, type: 'tablet' },
  md: { width: 768, height: 1024, type: 'tablet' },
  lg: { width: 1024, height: 768, type: 'desktop' },
  xl: { width: 1280, height: 800, type: 'desktop' },
} as const

export type ViewportKey = keyof typeof VIEWPORTS

export const allModes = {
  xs: { viewport: VIEWPORTS.xs.width },
  xsDark: { theme: 'dark', viewport: VIEWPORTS.xs.width },
  xl: { viewport: VIEWPORTS.xl.width },
} as const

/** The extra baselines a page composite carries on top of the global `xs` (ADR-0032 §5). */
export const pageModes = { xsDark: allModes.xsDark, xl: allModes.xl } as const

/** The extra baseline a token-sensitive gallery carries on top of the global `xs`. */
export const darkMode = { xsDark: allModes.xsDark } as const
