import { describe, test, expect } from 'vitest'

// Translation state selectors
const selectActivationInfo = (state) => state.translationState?.activationInfo
const selectTranslationLoading = (state) =>
  state.translationState?.loading || false

describe('Translation Selectors', () => {
  describe('selectActivationInfo', () => {
    test('should return activation info when present', () => {
      const activationInfo = {
        id: '123',
        status: 'active',
      }

      const state = {
        translationState: {
          activationInfo,
        },
      }

      expect(selectActivationInfo(state)).toEqual(activationInfo)
    })

    test('should return null when not set', () => {
      const state = {
        translationState: {
          activationInfo: null,
        },
      }

      expect(selectActivationInfo(state)).toBeNull()
    })

    test('should return undefined when translationState is undefined', () => {
      const state = {}

      expect(selectActivationInfo(state)).toBeUndefined()
    })
  })

  describe('selectTranslationLoading', () => {
    test('should return true when loading', () => {
      const state = {
        translationState: {
          loading: true,
        },
      }

      expect(selectTranslationLoading(state)).toBe(true)
    })

    test('should return false when not loading', () => {
      const state = {
        translationState: {
          loading: false,
        },
      }

      expect(selectTranslationLoading(state)).toBe(false)
    })

    test('should return false when translationState is undefined', () => {
      const state = {}

      expect(selectTranslationLoading(state)).toBe(false)
    })
  })
})
