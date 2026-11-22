import react from '@vitejs/plugin-react'
import { configDefaults, defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'test'),
    'process.browser': true
  },
  test: {
    globals: true,
    // Playwright specs in e2e/ run under `yarn test:e2e`, not vitest.
    exclude: [...configDefaults.exclude, 'e2e/**'],
    environment: 'jsdom',
    setupFiles: [
      './src/mockSetupTests.js',
      './src/setupTests.jsx'
    ],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
})
