import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import boundaries from 'eslint-plugin-boundaries'
import globals from 'globals'

export default tseslint.config(
  { ignores: ['dist', 'src/shared/api/generated'] },
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
      // FSD: layers can only import from same layer or layers below
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            // app can import from anything
            { from: 'app', allow: ['app', 'pages', 'widgets', 'features', 'entities', 'shared'] },
            // pages can import from widgets, features, entities, shared
            { from: 'pages', allow: ['pages', 'widgets', 'features', 'entities', 'shared'] },
            // widgets can import from features, entities, shared
            { from: 'widgets', allow: ['widgets', 'features', 'entities', 'shared'] },
            // features can import from entities, shared
            { from: 'features', allow: ['features', 'entities', 'shared'] },
            // entities can import from shared only
            { from: 'entities', allow: ['entities', 'shared'] },
            // shared can only import from shared
            { from: 'shared', allow: ['shared'] },
          ],
        },
      ],
    },
  },
)
