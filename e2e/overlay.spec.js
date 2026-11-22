import { expect, test } from '@playwright/test'

import { fakeTwitch } from './support/fake-twitch'

const OVERLAY = '/video_overlay.html?anchor=video_overlay&platform=web'

// Viewers opt in on the overlay: captions start hidden (and unsubscribed) until
// the closed-captioning button is pressed.
const showCaptions = (page) => page.locator('.cc-visibility-toggle').click()

test.describe('video overlay (production build)', () => {
  test('loads without console errors or blocked content', async ({ page }) => {
    const problems = []
    page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`))
    page.on('console', (message) => {
      if (message.type() === 'error') problems.push(`console: ${message.text()}`)
    })

    await fakeTwitch(page)
    await page.goto(OVERLAY)
    await expect(page.locator('#app-container')).toBeVisible()

    expect(problems).toEqual([])
  })

  test('shows a caption pushed by the backend', async ({ page }) => {
    const backend = await fakeTwitch(page)
    await page.goto(OVERLAY)
    await showCaptions(page)

    await backend.sendCaption({ final: 'Hello from the test streamer.' })

    await expect(page.getByText('Hello from the test streamer.')).toBeVisible()
  })

  test('keeps captions hidden until the viewer turns them on', async ({ page }) => {
    const backend = await fakeTwitch(page)
    await page.goto(OVERLAY)

    await expect(page.locator('.cc-visibility-toggle')).toBeVisible()
    await page.waitForTimeout(500)
    expect(backend.subscriptionQueries()).toEqual([])

    await showCaptions(page)
    await expect
      .poll(() => backend.subscriptionQueries().length)
      .toBeGreaterThan(0)
  })

  test('shows interim text before it is finalised', async ({ page }) => {
    const backend = await fakeTwitch(page)
    await page.goto(OVERLAY)
    await showCaptions(page)

    await backend.sendCaption({ interim: 'still talk', final: '' })

    await expect(page.getByText('still talk')).toBeVisible()
  })
})

test.describe('mobile panel (production build)', () => {
  test('shows a caption pushed by the backend', async ({ page }) => {
    const backend = await fakeTwitch(page)
    await page.goto('/mobile.html?platform=mobile')

    await backend.sendCaption({ final: 'Captions on mobile.' })

    await expect(page.getByText('Captions on mobile.')).toBeVisible()
  })
})
