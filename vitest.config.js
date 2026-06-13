import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
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
