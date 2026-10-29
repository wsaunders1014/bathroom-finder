import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    // e2e/ holds Playwright tests, which Vitest can't run.
    exclude: ['**/node_modules/**', 'e2e/**'],
  },
})
