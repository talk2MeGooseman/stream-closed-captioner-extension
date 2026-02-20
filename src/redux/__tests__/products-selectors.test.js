import { describe, test, expect } from 'vitest'

// Products state selectors
const selectProducts = (state) => state.productsState?.products || []
const selectChannelId = (state) => state.productsState?.channelId
const selectProcessing = (state) => state.productsState?.processing || false

describe('Products Selectors', () => {
  describe('selectProducts', () => {
    test('should return products array when present', () => {
      const state = {
        productsState: {
          products: [
            { sku: '100bits', cost: { amount: 100 } },
            { sku: '500bits', cost: { amount: 500 } },
          ],
        },
      }

      expect(selectProducts(state)).toHaveLength(2)
      expect(selectProducts(state)[0].sku).toBe('100bits')
    })

    test('should return empty array when products is empty', () => {
      const state = {
        productsState: {
          products: [],
        },
      }

      expect(selectProducts(state)).toEqual([])
    })

    test('should return empty array when productsState is undefined', () => {
      const state = {}

      expect(selectProducts(state)).toEqual([])
    })
  })

  describe('selectChannelId', () => {
    test('should return channel ID when set', () => {
      const state = {
        productsState: {
          channelId: 'channel-12345',
        },
      }

      expect(selectChannelId(state)).toBe('channel-12345')
    })

    test('should return undefined when not set', () => {
      const state = {
        productsState: {
          channelId: null,
        },
      }

      expect(selectChannelId(state)).toBeNull()
    })

    test('should return undefined when productsState is undefined', () => {
      const state = {}

      expect(selectChannelId(state)).toBeUndefined()
    })
  })

  describe('selectProcessing', () => {
    test('should return true when processing', () => {
      const state = {
        productsState: {
          processing: true,
        },
      }

      expect(selectProcessing(state)).toBe(true)
    })

    test('should return false when not processing', () => {
      const state = {
        productsState: {
          processing: false,
        },
      }

      expect(selectProcessing(state)).toBe(false)
    })

    test('should return false when productsState is undefined', () => {
      const state = {}

      expect(selectProcessing(state)).toBe(false)
    })
  })
})
