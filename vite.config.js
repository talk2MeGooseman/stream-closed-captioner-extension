import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import svgrPlugin from 'vite-plugin-svgr'
import eslint from 'vite-plugin-eslint'
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  server: {
    port: 8080
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        config: path.resolve(__dirname, 'config.html'),
        liveConfig: path.resolve(__dirname, 'live_config.html'),
        mobile: path.resolve(__dirname, 'mobile.html'),
        videoOverlay: path.resolve(__dirname, 'video_overlay.html')
      },
      output: {
        manualChunks: (id) => {
          // Core React and Redux dependencies - shared across all entry points
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-core'
            }
            if (id.includes('@reduxjs/toolkit') || id.includes('redux')) {
              return 'vendor-core'
            }
            if (id.includes('@apollo/client')) {
              return 'vendor-apollo'
            }
            if (id.includes('@blueprintjs') || id.includes('react-draggable')) {
              return 'vendor-ui'
            }
            // All other vendor modules (lodash, ramda, styled-components, etc.)
            return 'vendor'
          }
          // Shared Redux slices
          if (id.includes('/redux/')) {
            return 'shared-redux'
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'production'),
    'process.browser': true
  },
  plugins: [
    react(),
    nodePolyfills(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      }
    }),
    // eslint({
    //   fix: true,
    // })
  ]
})
