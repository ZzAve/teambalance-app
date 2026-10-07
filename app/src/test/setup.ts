// Registers @testing-library/jest-dom matchers (toBeInTheDocument, etc.) on Vitest's
// expect, and augments its types. Loaded via vitest.config.ts (unit project setupFiles).
import '@testing-library/jest-dom/vitest'
import { configure } from '@testing-library/react'

// The unit (jsdom) project runs concurrently with the headless-browser Storybook project under
// `make test-app`, and that CPU contention can push the async assertions in the render-gate tests
// (waitFor/findBy on router navigation) past Testing Library's default 1000ms deadline. Route
// component chunks are no longer transformed mid-test (autoCodeSplitting is off under Vitest, see
// vite.config.ts), so 5000ms is headroom for load, not for a slow chain.
configure({ asyncUtilTimeout: 5000 })
