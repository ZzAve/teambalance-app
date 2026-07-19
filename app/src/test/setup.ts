// Registers @testing-library/jest-dom matchers (toBeInTheDocument, etc.) on Vitest's
// expect, and augments its types. Loaded via vitest.config.ts (unit project setupFiles).
import '@testing-library/jest-dom/vitest'
import { configure } from '@testing-library/react'

// The unit (jsdom) project runs concurrently with the headless-browser Storybook project under
// `make test-app`. That contention starves the jsdom tests of CPU, so async assertions in the
// render-gate tests (waitFor/findBy on a navigation that chains an MSW mock → react-query mutation
// → cache invalidation+refetch → router navigate) intermittently blow past Testing Library's
// default 1000ms deadline — a flake that only surfaces under load (e.g. CI). Give them real
// headroom; a genuinely-broken assertion still fails, just after a longer wait.
configure({ asyncUtilTimeout: 5000 })
