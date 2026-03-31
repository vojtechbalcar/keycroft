import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
  globalIgnores([
    '.next/**',
    '.worktrees/**',
    '.playwright/**',
    'out/**',
    'build/**',
    'coverage/**',
    'node_modules/**',
    'next-env.d.ts',
    'docs/**',
    'skills/**',
  ]),
])

export default eslintConfig
