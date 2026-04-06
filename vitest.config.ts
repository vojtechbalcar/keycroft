import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      'next/link': path.resolve(__dirname, 'tests/__mocks__/next-link.tsx'),
      'next/navigation': path.resolve(
        __dirname,
        'tests/__mocks__/next-navigation.ts',
      ),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    exclude: ['e2e/**'],
  },
})
