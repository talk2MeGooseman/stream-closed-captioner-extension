import { describe, test, expect } from 'vitest'
import { TEXT_SIZES } from '@/utils/Constants'
import { getMobileFontSizeStyle, getFontSizeStyle } from '../helpers'

describe('Captions Helper Functions', () => {
  describe('getFontSizeStyle', () => {
    test('returns small font size CSS variable for SMALL size', () => {
      const fontSize = getFontSizeStyle(TEXT_SIZES.SMALL)

      expect(fontSize).toBe('--small-font-size')
    })

    test('returns medium font size CSS variable for MEDIUM size', () => {
      const fontSize = getFontSizeStyle(TEXT_SIZES.MEDIUM)

      expect(fontSize).toBe('--medium-font-size')
    })

    test('returns large font size CSS variable for LARGE size', () => {
      const fontSize = getFontSizeStyle(TEXT_SIZES.LARGE)

      expect(fontSize).toBe('--large-font-size')
    })

    test('returns medium as default for unknown size', () => {
      const fontSize = getFontSizeStyle('UNKNOWN_SIZE')

      expect(fontSize).toBe('--medium-font-size')
    })

    test('returns medium as default for null', () => {
      const fontSize = getFontSizeStyle(null)

      expect(fontSize).toBe('--medium-font-size')
    })

    test('returns medium as default for undefined', () => {
      const fontSize = getFontSizeStyle(undefined)

      expect(fontSize).toBe('--medium-font-size')
    })

    test('handles all TEXT_SIZES constants', () => {
      Object.values(TEXT_SIZES).forEach((size) => {
        const fontSize = getFontSizeStyle(size)
        expect(fontSize).toMatch(/^--\w+-font-size$/)
      })
    })
  })

  describe('getMobileFontSizeStyle', () => {
    test('returns mobile small font size CSS variable for SMALL size', () => {
      const fontSize = getMobileFontSizeStyle(TEXT_SIZES.SMALL)

      expect(fontSize).toBe('--mobile-small-font-size')
    })

    test('returns mobile medium font size CSS variable for MEDIUM size', () => {
      const fontSize = getMobileFontSizeStyle(TEXT_SIZES.MEDIUM)

      expect(fontSize).toBe('--mobile-medium-font-size')
    })

    test('returns mobile large font size CSS variable for LARGE size', () => {
      const fontSize = getMobileFontSizeStyle(TEXT_SIZES.LARGE)

      expect(fontSize).toBe('--mobile-large-font-size')
    })

    test('returns mobile medium as default for unknown size', () => {
      const fontSize = getMobileFontSizeStyle('UNKNOWN_SIZE')

      expect(fontSize).toBe('--mobile-medium-font-size')
    })

    test('returns mobile medium as default for null', () => {
      const fontSize = getMobileFontSizeStyle(null)

      expect(fontSize).toBe('--mobile-medium-font-size')
    })

    test('returns mobile medium as default for undefined', () => {
      const fontSize = getMobileFontSizeStyle(undefined)

      expect(fontSize).toBe('--mobile-medium-font-size')
    })

    test('handles all TEXT_SIZES constants for mobile', () => {
      Object.values(TEXT_SIZES).forEach((size) => {
        const fontSize = getMobileFontSizeStyle(size)
        expect(fontSize).toMatch(/^--mobile-\w+-font-size$/)
      })
    })
  })

  describe('Font Size Consistency', () => {
    test('desktop and mobile small sizes are consistent', () => {
      const desktop = getFontSizeStyle(TEXT_SIZES.SMALL)
      const mobile = getMobileFontSizeStyle(TEXT_SIZES.SMALL)

      expect(desktop).toContain('small')
      expect(mobile).toContain('mobile')
      expect(mobile).toContain('small')
    })

    test('desktop and mobile medium sizes are consistent', () => {
      const desktop = getFontSizeStyle(TEXT_SIZES.MEDIUM)
      const mobile = getMobileFontSizeStyle(TEXT_SIZES.MEDIUM)

      expect(desktop).toContain('medium')
      expect(mobile).toContain('mobile')
      expect(mobile).toContain('medium')
    })

    test('desktop and mobile large sizes are consistent', () => {
      const desktop = getFontSizeStyle(TEXT_SIZES.LARGE)
      const mobile = getMobileFontSizeStyle(TEXT_SIZES.LARGE)

      expect(desktop).toContain('large')
      expect(mobile).toContain('mobile')
      expect(mobile).toContain('large')
    })
  })

  describe('Edge Cases', () => {
    test('handles number input in getFontSizeStyle', () => {
      const fontSize = getFontSizeStyle(123)

      expect(fontSize).toBeDefined()
      expect(fontSize).toBe('--medium-font-size')
    })

    test('handles number input in getMobileFontSizeStyle', () => {
      const fontSize = getMobileFontSizeStyle(456)

      expect(fontSize).toBeDefined()
      expect(fontSize).toBe('--mobile-medium-font-size')
    })

    test('handles empty string input', () => {
      const fontSize = getFontSizeStyle('')

      expect(fontSize).toBe('--medium-font-size')
    })

    test('handles empty string input for mobile', () => {
      const fontSize = getMobileFontSizeStyle('')

      expect(fontSize).toBe('--mobile-medium-font-size')
    })

    test('handles object input gracefully', () => {
      const fontSize = getFontSizeStyle({})

      expect(fontSize).toBe('--medium-font-size')
    })

    test('handles array input gracefully', () => {
      const fontSize = getFontSizeStyle([])

      expect(fontSize).toBe('--medium-font-size')
    })
  })
})
