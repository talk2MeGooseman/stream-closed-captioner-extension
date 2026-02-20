import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
  split,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { getMainDefinition } from '@apollo/client/utilities'
import * as AbsintheSocket from '@absinthe/socket'
import { createAbsintheSocketLink } from '@absinthe/socket-apollo-link'
import { Socket as PhoenixSocket } from 'phoenix'
import { createMockLink, shouldUseRealServer } from './graphql-mocks'

// Check if we're in development mode
const isDevelopment = import.meta.env.MODE === 'development'

// Phoenix socket and Absinthe link - lazy initialized
let phxSocket = null
let absintheSocketLink = null

/**
 * Initialize Phoenix WebSocket connection
 * Called lazily when needed (production or dev with real server toggle)
 */
function initializePhoenixSocket() {
  if (!phxSocket) {
    phxSocket = new PhoenixSocket('wss://stream-cc.gooseman.codes/socket', {
      params: () => {
        const token = localStorage.getItem('token')
        if (token) {
          return { Authorization: `Bearer ${token}` }
        } else {
          return {}
        }
      },
    })

    absintheSocketLink = createAbsintheSocketLink(
      AbsintheSocket.create(phxSocket),
    )
  }
  return { phxSocket, absintheSocketLink }
}

// In production, initialize immediately
// In development, initialize on-demand when real server is enabled
if (!isDevelopment) {
  initializePhoenixSocket()
}

// Export for backwards compatibility and on-demand initialization
export { phxSocket, absintheSocketLink, initializePhoenixSocket }

/**
 * Get the current Phoenix socket (may be null in dev mode with mocks)
 * @returns {PhoenixSocket|null}
 */
export function getPhoenixSocket() {
  return phxSocket
}

/**
 * Check if Phoenix socket is connected
 * Safe to call even if socket is null
 * @returns {boolean}
 */
export function isPhoenixSocketConnected() {
  return phxSocket?.isConnected() || false
}

/**
 * Connect Phoenix socket if it exists
 * Safe to call even if socket is null (no-op in that case)
 */
export function connectPhoenixSocket() {
  if (phxSocket) {
    phxSocket.connect()
  }
}

/**
 * Disconnect Phoenix socket if it exists and is connected
 * Safe to call even if socket is null (no-op in that case)
 */
export function disconnectPhoenixSocket() {
  if (phxSocket?.isConnected()) {
    phxSocket.disconnect()
  }
}

const httpLink = createHttpLink({
  uri: 'https://stream-cc.gooseman.codes/api',
})

const authLink = setContext(({ operationName }, { headers }) => {
  // get the authentication token from local storage if it exists
  const tokenType =
    operationName === 'processBitsTransaction' ? 'transactionToken' : 'token'
  const token = localStorage.getItem(tokenType)

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

// Chain the HTTP link and the authorization link.
const authedHttpLink = authLink.concat(httpLink)

// Create a dynamic link that can switch between real and mock server in development
let dynamicLink

if (isDevelopment) {
  // In development: Create a link that checks useRealServer flag at runtime
  dynamicLink = new ApolloLink((operation, forward) => {
    // Check if we should use real server
    if (shouldUseRealServer()) {
      // Initialize WebSocket if not already done
      const { absintheSocketLink: realAbsintheLink } = initializePhoenixSocket()

      // Use split link for real server (WebSocket for subscriptions)
      const realSplitLink = split(
        ({ query }) => {
          const definition = getMainDefinition(query)
          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          )
        },
        realAbsintheLink,
        authedHttpLink,
      )

      return realSplitLink.request(operation, forward)
    }

    // Otherwise use mock link
    const mockLink = createMockLink()
    return mockLink.request(operation, forward)
  })
} else {
  // In production: Use standard split link with WebSocket
  dynamicLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    absintheSocketLink,
    authedHttpLink,
  )
}

// Final link chain:
// Development: Auth → Dynamic Link (switches between Mock and Real based on config)
// Production: Auth → Split Link (WebSocket for subscriptions, HTTP for queries/mutations)
const finalLink = authLink.concat(dynamicLink)

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: finalLink,
})
