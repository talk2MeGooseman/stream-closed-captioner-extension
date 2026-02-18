import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import svgrPlugin from 'vite-plugin-svgr'
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      }
    })
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
