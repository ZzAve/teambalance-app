// NOTE: eslint and @eslint/js are pinned to v9 because eslint-plugin-react-hooks@7 doesn't support eslint 10 yet.
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import boundaries from 'eslint-plugin-boundaries'
import globals from 'globals'

export default tseslint.config(
  { ignores: ['dist', 'storybook-static', '.tsbuild', 'src/shared/api/generated'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      boundaries,
    },
    settings: {
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app/*' },
        { type: 'pages', pattern: 'src/pages/*' },
        { type: 'widgets', pattern: 'src/widgets/*' },
        { type: 'features', pattern: 'src/features/*' },
        { type: 'entities', pattern: 'src/entities/*' },
        { type: 'shared', pattern: 'src/shared/*' },
      ],
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // #338: arbitrary Tailwind text sizes and radii are banned — the six-step type scale
      // (--text-caption/small/body/lead/title/page, app/src/app/styles/global.css) and the 8/12/16
      // radius triple (rounded-sm/md/lg) cover every real size the app needs. Flags both plain
      // string literals (className="text-[11px]") and template-literal chunks (the many
      // conditional `className={`...text-[11px]...`}` call sites) containing the arbitrary form.
      'no-restricted-syntax': [
        'error',
        {
          selector: String.raw`Literal[value=/\btext-\[\d/]`,
          message: 'Arbitrary text size — use the type scale (text-caption/small/body/lead/title/page) from app/src/app/styles/global.css instead.',
        },
        {
          selector: String.raw`TemplateElement[value.raw=/\btext-\[\d/]`,
          message: 'Arbitrary text size — use the type scale (text-caption/small/body/lead/title/page) from app/src/app/styles/global.css instead.',
        },
        {
          selector: String.raw`Literal[value=/\brounded-\[\d/]`,
          message: 'Arbitrary radius — use rounded-sm/md/lg (8/12/16, design-tokens/tokens.css) instead.',
        },
        {
          selector: String.raw`TemplateElement[value.raw=/\brounded-\[\d/]`,
          message: 'Arbitrary radius — use rounded-sm/md/lg (8/12/16, design-tokens/tokens.css) instead.',
        },
      ],
      // FSD: layers can only import from same layer or layers below
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          rules: [
            // app can import from anything
            { from: { type: 'app' }, allow: [{ to: { type: 'app' } }, { to: { type: 'pages' } }, { to: { type: 'widgets' } }, { to: { type: 'features' } }, { to: { type: 'entities' } }, { to: { type: 'shared' } }] },
            // pages can import from widgets, features, entities, shared
            { from: { type: 'pages' }, allow: [{ to: { type: 'pages' } }, { to: { type: 'widgets' } }, { to: { type: 'features' } }, { to: { type: 'entities' } }, { to: { type: 'shared' } }] },
            // widgets can import from features, entities, shared
            { from: { type: 'widgets' }, allow: [{ to: { type: 'widgets' } }, { to: { type: 'features' } }, { to: { type: 'entities' } }, { to: { type: 'shared' } }] },
            // features can import from entities, shared
            { from: { type: 'features' }, allow: [{ to: { type: 'features' } }, { to: { type: 'entities' } }, { to: { type: 'shared' } }] },
            // entities can import from shared only
            { from: { type: 'entities' }, allow: [{ to: { type: 'entities' } }, { to: { type: 'shared' } }] },
            // shared can only import from shared
            { from: { type: 'shared' }, allow: [{ to: { type: 'shared' } }] },
          ],
        },
      ],
    },
  },
)
