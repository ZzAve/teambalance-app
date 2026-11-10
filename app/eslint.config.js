// NOTE: eslint and @eslint/js are pinned to v9 because eslint-plugin-react-hooks@7 doesn't support eslint 10 yet.
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import boundaries from 'eslint-plugin-boundaries'
import globals from 'globals'
import i18next from 'eslint-plugin-i18next'

// Design-token bans (#338, #387); applied to every file. Spread into each no-restricted-syntax list,
// because a later config block replaces the rule's options instead of adding to them.
const tokenSyntaxRules = [
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
  // #387: gold-dark is a chip-ground ink (2.7:1 on the light card), so it is allowed only in a
  // class string that also paints a gold tint under it. On a bare surface the token is gold-ink.
  {
    selector: String.raw`Literal[value=/^(?!.*\bbg-gold\b).*\btext-gold-dark\b/]`,
    message: 'text-gold-dark without a bg-gold tint — use text-gold-ink on a bare surface (--color-gold-ink, app/src/app/styles/global.css).',
  },
  {
    selector: String.raw`TemplateElement[value.raw=/^(?!.*\bbg-gold\b).*\btext-gold-dark\b/]`,
    message: 'text-gold-dark without a bg-gold tint — use text-gold-ink on a bare surface (--color-gold-ink, app/src/app/styles/global.css).',
  },
]

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
      'no-restricted-syntax': ['error', ...tokenSyntaxRules],
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
  // ADR-0043: user-visible text goes through t(). Stories and tests may use English literals.
  {
    files: ['src/**/*.tsx'],
    ignores: ['**/*.stories.tsx', '**/*.test.tsx'],
    plugins: { i18next },
    rules: {
      // ADR-0043: screen-reader and tooltip text is user-visible too. The brand name is the one exception.
      'no-restricted-syntax': [
        'error',
        ...tokenSyntaxRules,
        {
          selector: String.raw`JSXAttribute[name.name=/^(aria-label|alt|title)$/] > Literal[value=/[A-Za-z]/][value!='TeamBalance']`,
          message: 'Hard-coded aria-label/alt/title — use t() with a key in en.json and nl.json (app/CLAUDE.md, ADR-0043).',
        },
      ],
      'i18next/no-literal-string': [
        'error',
        {
          mode: 'jsx-text-only',
          // Glyphs with no letters (⋯, ·, –) and the two halves of the TeamBalance wordmark.
          words: { exclude: ['^[^A-Za-z]+$', '^Team$', '^Balance$'] },
        },
      ],
    },
  },
)
