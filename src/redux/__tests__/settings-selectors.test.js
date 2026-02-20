import { describe, test, expect } from 'vitest'
import { isBitsEnabledSelector, captionsColor } from '../selectors/settings'

describe('Settings Selectors', () => {
  describe('isBitsEnabledSelector', () => {
    test('should return true when bits are enabled', () => {
      const state = {
        configSettings: {
          isBitsEnabled: true,
        },
      }

      expect(isBitsEnabledSelector(state)).toBe(true)
    })

    test('should return false when bits are disabled', () => {
      const state = {
        configSettings: {
          isBitsEnabled: false,
        },
      }

      expect(isBitsEnabledSelector(state)).toBe(false)
    })

    test('should return undefined when isBitsEnabled is not set', () => {
      const state = {
        configSettings: {},
      }

      expect(isBitsEnabledSelector(state)).toBeUndefined()
    })
  })

  describe('captionsColor', () => {
    test('should return color value when set', () => {
      const state = {
        configSettings: {
          color: '#FFFFFF',
        },
      }

      expect(captionsColor(state)).toBe('#FFFFFF')
    })

    test('should return different color values', () => {
      const state = {
        configSettings: {
          color: '#FF0000',
        },
      }

      expect(captionsColor(state)).toBe('#FF0000')
    })

    test('should return undefined when color is not set', () => {
      const state = {
        configSettings: {},
      }

      expect(captionsColor(state)).toBeUndefined()
    })

    test('should handle null color value', () => {
      const state = {
        configSettings: {
          color: null,
        },
      }

      expect(captionsColor(state)).toBeNull()
    })
  })
})
