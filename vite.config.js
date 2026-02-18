import react from '@vitejs/plugin-react'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
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
    splitVendorChunkPlugin(),
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
