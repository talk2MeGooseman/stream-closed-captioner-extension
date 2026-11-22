import { defineConfig, devices } from '@playwright/test'

// End-to-end smoke tests run against the *production build* served by
// `vite preview`, so they exercise the same bundle that ships to Twitch. The
// Twitch helper script and the Phoenix backend are faked in the tests
// (see e2e/support/fake-twitch.js), so no network access is needed.
//
// Locally: yarn build && yarn test:e2e
// Set PLAYWRIGHT_CHROMIUM_PATH to use a Chromium you already have installed.
const PORT = 4173

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
      : {},
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `yarn vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/video_overlay.html`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
