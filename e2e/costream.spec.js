import { expect, test } from '@playwright/test'

import { fakeTwitch } from './support/fake-twitch'

const OVERLAY = '/video_overlay.html?anchor=video_overlay&platform=web'

const showCaptions = (page) => page.locator('.cc-visibility-toggle').click()
const openSettings = (page) => page.getByLabel('Open settings menu').click()

test.describe('co-streamer captions (production build)', () => {
  test('flagged channel: guest captions render name-prefixed next to the streamer', async ({
    page,
  }) => {
    const backend = await fakeTwitch(page, {
      channelInfoOverrides: { costreamEnabled: true },
    })
    await page.goto(OVERLAY)
    await showCaptions(page)

    await backend.sendCaption({ final: 'Welcome to the stream.' })
    await backend.sendCostreamCaption({ guestId: '7', name: 'Alice', final: 'Thanks for having me.' })

    await expect(page.getByText('Welcome to the stream.')).toBeVisible()
    await expect(page.getByText('Alice: Thanks for having me.')).toBeVisible()
  })

  test('flagged channel: viewer can hide guest captions from the settings menu', async ({
    page,
  }) => {
    const backend = await fakeTwitch(page, {
      channelInfoOverrides: { costreamEnabled: true },
    })
    await page.goto(OVERLAY)
    await showCaptions(page)

    await backend.sendCostreamCaption({ guestId: '7', name: 'Alice', final: 'Hello everyone.' })
    await backend.sendCaption({ final: 'Streamer line.' })
    await expect(page.getByText('Alice: Hello everyone.')).toBeVisible()

    await openSettings(page)
    await page.getByText('Co-Streamer Captions').click()

    await expect(page.getByText('Alice: Hello everyone.')).toBeHidden()
    await expect(page.getByText('Streamer line.')).toBeVisible()
  })

  test('unflagged channel: no guest subscription and no settings toggle', async ({ page }) => {
    const backend = await fakeTwitch(page)
    await page.goto(OVERLAY)
    await showCaptions(page)

    // Wait until the normal caption subscription is up, then check the guest one never opened.
    await expect
      .poll(() => backend.subscriptionQueries().some((q) => q.includes('newTwitchCaption')))
      .toBe(true)
    expect(backend.subscriptionQueries().some((q) => q.includes('newCostreamCaption'))).toBe(false)

    await openSettings(page)
    await expect(page.getByText('Large Text')).toBeVisible()
    await expect(page.getByText('Co-Streamer Captions')).toBeHidden()
  })
})
