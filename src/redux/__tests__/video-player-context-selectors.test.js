import { describe, test, expect } from 'vitest'

// Video Player Context selectors
const selectPlayerControlsVisibility = (state) =>
  state.videoPlayerContext?.arePlayerControlsVisible
const selectDisplayResolution = (state) =>
  state.videoPlayerContext?.displayResolution
const selectHlsLatency = (state) =>
  state.videoPlayerContext?.hlsLatencyBroadcaster

describe('Video Player Context Selectors', () => {
  describe('selectPlayerControlsVisibility', () => {
    test('should return true when player controls are visible', () => {
      const state = {
        videoPlayerContext: {
          arePlayerControlsVisible: true,
        },
      }

      expect(selectPlayerControlsVisibility(state)).toBe(true)
    })

    test('should return false when player controls are hidden', () => {
      const state = {
        videoPlayerContext: {
          arePlayerControlsVisible: false,
        },
      }

      expect(selectPlayerControlsVisibility(state)).toBe(false)
    })

    test('should return undefined when not set', () => {
      const state = {
        videoPlayerContext: {},
      }

      expect(selectPlayerControlsVisibility(state)).toBeUndefined()
    })
  })

  describe('selectDisplayResolution', () => {
    test('should return resolution string when set', () => {
      const state = {
        videoPlayerContext: {
          displayResolution: '1080p',
        },
      }

      expect(selectDisplayResolution(state)).toBe('1080p')
    })

    test('should handle different resolution values', () => {
      const state = {
        videoPlayerContext: {
          displayResolution: '720p',
        },
      }

      expect(selectDisplayResolution(state)).toBe('720p')
    })

    test('should return undefined when not set', () => {
      const state = {
        videoPlayerContext: {},
      }

      expect(selectDisplayResolution(state)).toBeUndefined()
    })
  })

  describe('selectHlsLatency', () => {
    test('should return HLS latency value when set', () => {
      const state = {
        videoPlayerContext: {
          hlsLatencyBroadcaster: 3000,
        },
      }

      expect(selectHlsLatency(state)).toBe(3000)
    })

    test('should return 0 when set to 0', () => {
      const state = {
        videoPlayerContext: {
          hlsLatencyBroadcaster: 0,
        },
      }

      expect(selectHlsLatency(state)).toBe(0)
    })

    test('should return undefined when not set', () => {
      const state = {
        videoPlayerContext: {},
      }

      expect(selectHlsLatency(state)).toBeUndefined()
    })

    test('should return undefined when videoPlayerContext is empty', () => {
      const state = {}

      expect(selectHlsLatency(state)).toBeUndefined()
    })
  })
})
