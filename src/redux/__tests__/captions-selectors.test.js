import { describe, test, expect } from 'vitest'
import {
  hasCaptionsSelector,
  hasCaptionsTranslationsSelector,
  hlsLatencyBroadcasterSelector,
} from '../selectors/captions'

describe('Captions Selectors', () => {
  describe('hasCaptionsSelector', () => {
    test('should return true when finalTextQueue has items', () => {
      const state = {
        captionsState: {
          finalTextQueue: [{ id: '1', text: 'Hello' }],
          interimText: '',
        },
      }

      expect(hasCaptionsSelector(state)).toBe(true)
    })

    test('should return true when interimText has content', () => {
      const state = {
        captionsState: {
          finalTextQueue: [],
          interimText: 'Interim text',
        },
      }

      expect(hasCaptionsSelector(state)).toBe(true)
    })

    test('should return false when both are empty', () => {
      const state = {
        captionsState: {
          finalTextQueue: [],
          interimText: '',
        },
      }

      expect(hasCaptionsSelector(state)).toBe(false)
    })
  })

  describe('hasCaptionsTranslationsSelector', () => {
    test('should return true when translations has entries', () => {
      const state = {
        captionsState: {
          translations: {
            es: { name: 'Spanish', textQueue: [{ id: '1', text: 'Hola' }] },
          },
        },
      }

      expect(hasCaptionsTranslationsSelector(state)).toBe(true)
    })

    test('should return false when translations is empty', () => {
      const state = {
        captionsState: {
          translations: {},
        },
      }

      expect(hasCaptionsTranslationsSelector(state)).toBe(false)
    })

    test('should return false when translations is undefined', () => {
      const state = {
        captionsState: {
          translations: undefined,
        },
      }

      expect(hasCaptionsTranslationsSelector(state)).toBe(false)
    })

    test('should return false when translations is null', () => {
      const state = {
        captionsState: {
          translations: null,
        },
      }

      expect(hasCaptionsTranslationsSelector(state)).toBe(false)
    })
  })

  describe('hlsLatencyBroadcasterSelector', () => {
    test('should return HLS latency value when present', () => {
      const state = {
        videoPlayerContext: {
          hlsLatencyBroadcaster: 5000,
        },
      }

      expect(hlsLatencyBroadcasterSelector(state)).toBe(5000)
    })

    test('should return 0 when latency is not set', () => {
      const state = {
        videoPlayerContext: {},
      }

      expect(hlsLatencyBroadcasterSelector(state)).toBe(0)
    })

    test('should return 0 when videoPlayerContext is undefined', () => {
      const state = {}

      expect(hlsLatencyBroadcasterSelector(state)).toBe(0)
    })

    test('should handle null videoPlayerContext', () => {
      const state = {
        videoPlayerContext: null,
      }

      expect(hlsLatencyBroadcasterSelector(state)).toBe(0)
    })
  })
})
