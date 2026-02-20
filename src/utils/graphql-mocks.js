import { ApolloLink, Observable } from '@apollo/client'

/**
 * Dev-only GraphQL mock harness
 *
 * This module provides mock responses for GraphQL operations during development.
 * It allows the UI to be exercised locally without calling real backend endpoints.
 *
 * Production builds will NOT include this module's functionality.
 */

// Check if we're in development mode
const isDevelopment = import.meta.env.MODE === 'development'

/**
 * Mock configuration state
 * Can be updated via dev UI controls
 */
let mockConfig = {
  enabled: isDevelopment,
  useRealServer: false, // Toggle to use real server in development
  activeScenario: 'default',
  mockSubscriptionInterval: 3000, // ms between subscription events
}

/**
 * Get current mock configuration
 */
export function getMockConfig() {
  return { ...mockConfig }
}

/**
 * Update mock configuration
 * @param {Object} updates - Partial configuration updates
 */
export function updateMockConfig(updates) {
  mockConfig = { ...mockConfig, ...updates }
}

/**
 * Mock resolver map keyed by operation name
 * Returns mock data matching the shape expected by the UI
 */
const mockResolvers = {
  // Query: Get channel info
  getChannelInfo: (variables) => ({
    data: {
      channelInfo: {
        bitsBalance: {
          balance: 1000,
          __typename: 'BitsBalance',
        },
        translations: {
          activated: true,
          createdAt: new Date().toISOString(),
          languages: ['es', 'fr', 'de', 'ja'],
          __typename: 'Translations',
        },
        uid: variables.id || 'mock-channel-uid-12345',
        __typename: 'ChannelInfo',
      },
    },
  }),

  // Mutation: Process bits transaction
  processBitsTransaction: (_variables) => ({
    data: {
      processBitsTransaction: {
        message: 'Bits transaction processed successfully (MOCK)',
        __typename: 'TransactionResponse',
      },
    },
  }),

  // Subscription: New captions
  // This returns a function that creates an Observable stream
  OnCommentAdded: (_variables, _operation) => {
    return createCaptionSubscriptionStream(_variables)
  },
}

/**
 * Mock caption sentences for realistic testing
 */
const mockCaptionSentences = [
  'Welcome to the stream everyone!',
  'Thanks for joining today.',
  'Let me know if you have any questions.',
  'This is a test caption for development.',
  'The mock GraphQL harness is working correctly.',
  'You can trigger new captions from the dev controls.',
]

let mockCaptionIndex = 0

/**
 * Create a mock subscription stream for captions
 * Emits interim and final caption text on an interval
 *
 * @param {Object} variables - Subscription variables (channelId)
 * @returns {Observable} Observable stream of caption events
 */
function createCaptionSubscriptionStream(variables) {
  return new Observable((observer) => {
    console.log(
      '[GraphQL Mock] Subscription started: OnCommentAdded',
      variables,
    )

    let intervalId = null
    let isActive = true

    // Listen for manually triggered events from dev UI
    const unsubscribe = onSubscriptionEvent((data) => {
      if (isActive) {
        observer.next({
          data: {
            newTwitchCaption: {
              interim: data.interim || '',
              final: data.final || '',
              translations: data.translations || {},
              __typename: 'CaptionEvent',
            },
          },
        })
      }
    })

    // Auto-emit caption events on an interval (optional, can be disabled)
    if (mockConfig.mockSubscriptionInterval > 0) {
      intervalId = setInterval(() => {
        if (!isActive) return

        const sentence = mockCaptionSentences[mockCaptionIndex]
        mockCaptionIndex = (mockCaptionIndex + 1) % mockCaptionSentences.length

        // First emit interim text (partial sentence)
        const interimLength = Math.floor(sentence.length * 0.6)
        observer.next({
          data: {
            newTwitchCaption: {
              interim: sentence.substring(0, interimLength),
              final: '',
              translations: {},
              __typename: 'CaptionEvent',
            },
          },
        })

        // After a delay, emit final text
        setTimeout(() => {
          if (!isActive) return

          observer.next({
            data: {
              newTwitchCaption: {
                interim: '',
                final: sentence,
                translations: {
                  es: `[ES] ${sentence}`,
                  fr: `[FR] ${sentence}`,
                },
                __typename: 'CaptionEvent',
              },
            },
          })
        }, 1000)
      }, mockConfig.mockSubscriptionInterval)
    }

    // Cleanup function
    return () => {
      console.log('[GraphQL Mock] Subscription cleanup: OnCommentAdded')
      isActive = false
      unsubscribe()
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  })
}

/**
 * Get mock response for an operation
 * @param {string} operationName - GraphQL operation name
 * @param {Object} variables - Operation variables
 * @returns {Object|Function|null} Mock response data or function
 */
export function getMockResponse(operationName, variables) {
  const resolver = mockResolvers[operationName]

  if (!resolver) {
    return null
  }

  // Return the resolver as-is (function or object)
  // The caller will handle calling functions and wrapping in Observables
  return resolver
}

/**
 * Check if we should use the real server in development
 * @returns {boolean} True if real server should be used
 */
export function shouldUseRealServer() {
  return mockConfig.useRealServer
}

/**
 * Check if an operation should be mocked
 * @param {string} operationName - GraphQL operation name
 * @returns {boolean} True if operation has a mock resolver
 */
export function shouldMockOperation(operationName) {
  return (
    mockConfig.enabled &&
    !mockConfig.useRealServer &&
    operationName in mockResolvers
  )
}

/**
 * Create a mock Apollo Link that intercepts operations
 * Returns mock responses when available, otherwise forwards to the next link
 *
 * @returns {ApolloLink} Apollo Link for mocking
 */
export function createMockLink() {
  return new ApolloLink((operation, forward) => {
    const { operationName, variables } = operation

    // Only mock if enabled and we have a resolver
    if (!shouldMockOperation(operationName)) {
      // Pass through to the real links
      return forward(operation)
    }

    console.log(`[GraphQL Mock] Intercepting: ${operationName}`, variables)

    const mockResponse = getMockResponse(operationName, variables)

    if (!mockResponse) {
      return forward(operation)
    }

    // If it's a function, call it to get the actual response
    const response =
      typeof mockResponse === 'function'
        ? mockResponse(variables, operation)
        : mockResponse

    // If the response is already an Observable (subscriptions), return it directly
    if (response instanceof Observable) {
      return response
    }

    // For queries and mutations, wrap the data in an Observable
    return new Observable((observer) => {
      // Simulate network delay
      setTimeout(() => {
        observer.next(response)
        observer.complete()
      }, 100)
    })
  })
}

/**
 * Subscription mock event emitter
 * Allows dev UI to manually trigger subscription events
 */
const subscriptionListeners = new Set()

/**
 * Register a subscription listener
 * @param {Function} listener - Callback for subscription events
 * @returns {Function} Unsubscribe function
 */
export function onSubscriptionEvent(listener) {
  subscriptionListeners.add(listener)
  return () => subscriptionListeners.delete(listener)
}

/**
 * Manually trigger a subscription event (for dev UI)
 * @param {Object} data - Caption data to emit
 */
export function triggerSubscriptionEvent(data) {
  subscriptionListeners.forEach((listener) => listener(data))
}
