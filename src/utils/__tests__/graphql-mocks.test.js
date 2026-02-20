import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Observable } from '@apollo/client'
import {
  getMockResponse,
  shouldMockOperation,
  updateMockConfig,
  createMockLink,
} from '../graphql-mocks'

describe('graphql-mocks', () => {
  beforeEach(() => {
    updateMockConfig({ enabled: true, useRealServer: false })
  })

  describe('getMockResponse', () => {
    it('returns a function for OnCommentAdded subscription', () => {
      const response = getMockResponse('OnCommentAdded', {
        channelId: 'test-123',
      })

      expect(typeof response).toBe('function')
    })

    it('OnCommentAdded resolver returns an Observable', () => {
      const resolver = getMockResponse('OnCommentAdded', {
        channelId: 'test-123',
      })
      const observable = resolver({ channelId: 'test-123' })

      expect(observable).toBeInstanceOf(Observable)
    })

    it('OnCommentAdded Observable emits caption data with correct structure', (done) => {
      const resolver = getMockResponse('OnCommentAdded', {
        channelId: 'test-123',
      })
      const observable = resolver({ channelId: 'test-123' })

      // Subscribe and verify first emission
      const subscription = observable.subscribe({
        next: ({ data }) => {
          // Verify the data structure matches what captions-slice.js expects
          expect(data).toHaveProperty('newTwitchCaption')
          expect(data.newTwitchCaption).toHaveProperty('interim')
          expect(data.newTwitchCaption).toHaveProperty('final')
          expect(data.newTwitchCaption).toHaveProperty('translations')

          subscription.unsubscribe()
          done()
        },
        error: (err) => {
          done(err)
        },
      })
    })
  })

  describe('shouldMockOperation', () => {
    it('returns true for OnCommentAdded when mocking is enabled', () => {
      expect(shouldMockOperation('OnCommentAdded')).toBe(true)
    })

    it('returns true for getChannelInfo when mocking is enabled', () => {
      expect(shouldMockOperation('getChannelInfo')).toBe(true)
    })

    it('returns false for unknown operations', () => {
      expect(shouldMockOperation('unknownOperation')).toBe(false)
    })
  })

  describe('createMockLink', () => {
    it('handles subscription operations that return functions', (done) => {
      const mockLink = createMockLink()

      const operation = {
        operationName: 'OnCommentAdded',
        variables: { channelId: 'test-channel' },
        query: {},
        getContext: () => ({}),
        setContext: () => {},
      }

      const observable = mockLink.request(operation, () => {
        throw new Error('Should not forward to next link')
      })

      expect(observable).toBeInstanceOf(Observable)

      // Verify the subscription emits data correctly
      const subscription = observable.subscribe({
        next: ({ data }) => {
          expect(data).toHaveProperty('newTwitchCaption')
          expect(data.newTwitchCaption).toHaveProperty('interim')
          expect(data.newTwitchCaption).toHaveProperty('final')

          subscription.unsubscribe()
          done()
        },
        error: (err) => {
          done(err)
        },
      })
    })

    it('handles query operations that return data directly', (done) => {
      const mockLink = createMockLink()

      const operation = {
        operationName: 'getChannelInfo',
        variables: { id: 'test-channel' },
        query: {},
        getContext: () => ({}),
        setContext: () => {},
      }

      const observable = mockLink.request(operation, () => {
        throw new Error('Should not forward to next link')
      })

      expect(observable).toBeInstanceOf(Observable)

      observable.subscribe({
        next: ({ data }) => {
          expect(data).toHaveProperty('channelInfo')
          expect(data.channelInfo).toHaveProperty('uid')
          done()
        },
        error: (err) => {
          done(err)
        },
      })
    })
  })
})
