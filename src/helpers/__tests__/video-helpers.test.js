import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'

import {
  isVideoOverlay,
  applyVideoPlayerBackdrop,
  DEV_VIDEO_PLAYER_BACKDROP_CLASS,
} from '../video-helpers'

const OVERLAY_URL = '/test.html?anchor=video_overlay&platform=web'

describe('video-helpers', () => {
  test('returns true if video overlay', () => {
    window.history.pushState({}, 'Test Title', OVERLAY_URL)
    expect(isVideoOverlay()).toBe(true)
  })

  test('returns false if not video overlay', () => {
    window.history.pushState({}, 'Test Title', '/test.html?platform=web')
    expect(isVideoOverlay()).not.toBe(true)
  })

  describe('applyVideoPlayerBackdrop', () => {
    beforeEach(() => {
      vi.stubEnv('MODE', 'development')
    })

    afterEach(() => {
      vi.unstubAllEnvs()
      document.body.classList.remove(DEV_VIDEO_PLAYER_BACKDROP_CLASS)
    })

    test('adds the backdrop class and returns true on the video overlay page', () => {
      window.history.pushState({}, 'Test Title', OVERLAY_URL)
      const body = document.createElement('body')

      expect(applyVideoPlayerBackdrop(body)).toBe(true)
      expect(body.classList.contains(DEV_VIDEO_PLAYER_BACKDROP_CLASS)).toBe(
        true,
      )
    })

    test('defaults to document.body, the element the app styles', () => {
      window.history.pushState({}, 'Test Title', OVERLAY_URL)

      expect(applyVideoPlayerBackdrop()).toBe(true)
      expect(
        document.body.classList.contains(DEV_VIDEO_PLAYER_BACKDROP_CLASS),
      ).toBe(true)
    })

    test('does nothing when not on the video overlay page', () => {
      window.history.pushState({}, 'Test Title', '/test.html?platform=web')
      const body = document.createElement('body')

      expect(applyVideoPlayerBackdrop(body)).toBe(false)
      expect(body.classList.contains(DEV_VIDEO_PLAYER_BACKDROP_CLASS)).toBe(
        false,
      )
    })

    test('never applies the backdrop outside development mode', () => {
      vi.stubEnv('MODE', 'production')
      window.history.pushState({}, 'Test Title', OVERLAY_URL)

      expect(applyVideoPlayerBackdrop()).toBe(false)
      expect(
        document.body.classList.contains(DEV_VIDEO_PLAYER_BACKDROP_CLASS),
      ).toBe(false)
    })
  })
})
