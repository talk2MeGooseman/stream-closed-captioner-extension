import { describe, test, expect, vi, beforeEach } from 'vitest'
import { phxSocket, absintheSocketLink, apolloClient } from '../apollo'

describe('Apollo Client Setup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('phxSocket', () => {
    test('should create a phoenix socket instance', () => {
      expect(phxSocket).toBeDefined()
      expect(typeof phxSocket).toBe('object')
    })

    test('should have socket endpoint configured', () => {
      expect(phxSocket.endPoint).toBeDefined()
    })

    test('should include connect method', () => {
      expect(typeof phxSocket.connect).toBe('function')
    })
  })

  describe('absintheSocketLink', () => {
    test('should create an absinthe socket link', () => {
      expect(absintheSocketLink).toBeDefined()
    })

    test('should have apollo link interface', () => {
      // Apollo links are functions that can be composed
      expect(typeof absintheSocketLink.request).toBe('function')
    })
  })

  describe('apolloClient', () => {
    test('should create apollo client instance', () => {
      expect(apolloClient).toBeDefined()
      expect(typeof apolloClient).toBe('object')
    })

    test('should have cache configured', () => {
      expect(apolloClient.cache).toBeDefined()
    })

    test('should have InMemoryCache', () => {
      const cache = apolloClient.cache
      expect(cache).toBeDefined()
      // InMemoryCache has a data property
      expect(typeof cache.data).toBe('object')
    })

    test('should have link configured', () => {
      expect(apolloClient.link).toBeDefined()
    })

    test('should be able to create a new Apollo Client', () => {
      // Verify client is properly instantiated with ApolloClient constructor
      const clientMethods = [
        'query',
        'mutate',
        'subscribe',
        'resetStore',
        'clearStore',
      ]
      clientMethods.forEach((method) => {
        expect(typeof apolloClient[method]).toBe('function')
      })
    })

    test('should have query method available', async () => {
      expect(typeof apolloClient.query).toBe('function')
    })

    test('should have mutate method available', async () => {
      expect(typeof apolloClient.mutate).toBe('function')
    })

    test('should have subscribe method available', async () => {
      expect(typeof apolloClient.subscribe).toBe('function')
    })

    test('should have clearStore method for cleanup', () => {
      expect(typeof apolloClient.clearStore).toBe('function')
    })

    test('should have resetStore method for reset', () => {
      expect(typeof apolloClient.resetStore).toBe('function')
    })
  })

  describe('Socket Configuration', () => {
    test('should configure socket with proper parameters', () => {
      // Socket should have essential Phoenix Socket properties
      expect(phxSocket.endPoint).toMatch(/wss?:\/\//)
    })

    test('should socket be ready for connection', () => {
      expect(phxSocket.endPoint).toBeTruthy()
    })
  })

  describe('Absinthe Link Configuration', () => {
    test('should absinthe link be usable with apollo', () => {
      // The link should be composable with other apollo links
      expect(absintheSocketLink).toBeTruthy()
      expect(typeof absintheSocketLink.request).toBe('function')
    })
  })
})
