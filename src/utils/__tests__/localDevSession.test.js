import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../graphql-mocks', () => ({
  updateMockConfig: vi.fn(),
}))

vi.mock('../apollo', () => ({
  initializePhoenixSocket: vi.fn(),
  connectPhoenixSocket: vi.fn(),
  disconnectPhoenixSocket: vi.fn(),
}))

import { updateMockConfig } from '../graphql-mocks'
import {
  initializePhoenixSocket,
  connectPhoenixSocket,
  disconnectPhoenixSocket,
} from '../apollo'
import {
  isLocalDevEnabled,
  getLocalDevSession,
  loadLocalDevSession,
  setLocalDevChannel,
  clearLocalDevSession,
  hasLocalDevToken,
} from '../localDevSession'
import { getSocketUrl, getGraphqlUrl } from '../devSessionStorage'

/**
 * Builds a decodable (unsigned) JWT so the session helpers can read claims.
 * No exp claim means the token never expires.
 */
function fakeJwt(payload = {}) {
  const body = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
  return `header.${body}.signature`
}

const expiredJwt = () => fakeJwt({ exp: Math.floor(Date.now() / 1000) - 60 })

describe('localDevSession', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    vi.stubEnv('MODE', 'development')
    window.location.hash = ''
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    window.location.hash = ''
  })

  describe('isLocalDevEnabled', () => {
    test('is true in development mode', () => {
      expect(isLocalDevEnabled()).toBe(true)
    })

    test('is false outside development mode', () => {
      vi.stubEnv('MODE', 'production')
      expect(isLocalDevEnabled()).toBe(false)
    })
  })

  describe('loadLocalDevSession', () => {
    test('seeds a session from the URL fragment and enables the real server', () => {
      const token = fakeJwt()
      window.location.hash = `#scc_dev_token=${token}&scc_dev_channel=12345`

      const session = loadLocalDevSession()

      expect(session).toEqual({ token, channelId: '12345', backend: null })
      expect(localStorage.getItem('scc_dev_token')).toBe(token)
      expect(localStorage.getItem('scc_dev_channel')).toBe('12345')
      expect(updateMockConfig).toHaveBeenCalledWith({ useRealServer: true })
      expect(initializePhoenixSocket).toHaveBeenCalled()
      expect(connectPhoenixSocket).toHaveBeenCalled()
      // Fragment is stripped so the token doesn't linger in the address bar.
      expect(window.location.hash).toBe('')
    })

    test('seeds the backend origin from the fragment when present', () => {
      const token = fakeJwt()
      const backend = encodeURIComponent('https://staging.example.com')
      window.location.hash = `#scc_dev_token=${token}&scc_dev_channel=12345&scc_dev_backend=${backend}`

      const session = loadLocalDevSession()

      expect(session).toEqual({
        token,
        channelId: '12345',
        backend: 'https://staging.example.com',
      })
      expect(localStorage.getItem('scc_dev_backend')).toBe(
        'https://staging.example.com',
      )
    })

    test('clears a stale backend when a new session omits it', () => {
      localStorage.setItem('scc_dev_backend', 'https://old.example.com')
      const token = fakeJwt()
      window.location.hash = `#scc_dev_token=${token}&scc_dev_channel=12345`

      const session = loadLocalDevSession()

      expect(session.backend).toBeNull()
      expect(localStorage.getItem('scc_dev_backend')).toBeNull()
    })

    test('returns a previously persisted session when no fragment is present', () => {
      const token = fakeJwt()
      localStorage.setItem('scc_dev_token', token)
      localStorage.setItem('scc_dev_channel', '999')

      const session = loadLocalDevSession()

      expect(session).toEqual({ token, channelId: '999', backend: null })
      expect(updateMockConfig).toHaveBeenCalledWith({ useRealServer: true })
      expect(connectPhoenixSocket).toHaveBeenCalled()
    })

    test('purges an expired session and stays on the mock harness', () => {
      localStorage.setItem('scc_dev_token', expiredJwt())
      localStorage.setItem('scc_dev_channel', '999')
      localStorage.setItem('scc_dev_backend', 'https://staging.example.com')

      const session = loadLocalDevSession()

      expect(session).toBeNull()
      expect(localStorage.getItem('scc_dev_token')).toBeNull()
      expect(localStorage.getItem('scc_dev_channel')).toBeNull()
      expect(localStorage.getItem('scc_dev_backend')).toBeNull()
      expect(updateMockConfig).not.toHaveBeenCalled()
      expect(connectPhoenixSocket).not.toHaveBeenCalled()
    })

    test('does nothing without a session', () => {
      const session = loadLocalDevSession()

      expect(session).toBeNull()
      expect(updateMockConfig).not.toHaveBeenCalled()
      expect(connectPhoenixSocket).not.toHaveBeenCalled()
    })

    test('is inert outside development mode', () => {
      vi.stubEnv('MODE', 'production')
      window.location.hash = `#scc_dev_token=${fakeJwt()}&scc_dev_channel=12345`

      const session = loadLocalDevSession()

      expect(session).toBeNull()
      expect(localStorage.getItem('scc_dev_token')).toBeNull()
      expect(updateMockConfig).not.toHaveBeenCalled()
    })

    test('trims fragment values and ignores whitespace-only ones', () => {
      window.location.hash = '#scc_dev_token=%20%20&scc_dev_channel=%20%20'

      const session = loadLocalDevSession()

      expect(session).toBeNull()
      expect(localStorage.getItem('scc_dev_token')).toBeNull()
      expect(localStorage.getItem('scc_dev_channel')).toBeNull()
    })

    test('clears a partial fragment without persisting a session', () => {
      window.location.hash = `#scc_dev_token=${fakeJwt()}`

      const session = loadLocalDevSession()

      expect(session).toBeNull()
      expect(localStorage.getItem('scc_dev_token')).toBeNull()
      // The lone token is scrubbed from the address bar rather than left behind.
      expect(window.location.hash).toBe('')
    })
  })

  describe('hasLocalDevToken', () => {
    test('reflects whether a token is stored', () => {
      expect(hasLocalDevToken()).toBe(false)
      localStorage.setItem('scc_dev_token', fakeJwt())
      expect(hasLocalDevToken()).toBe(true)
    })

    test('is false (and purges) when the stored token is expired', () => {
      localStorage.setItem('scc_dev_token', expiredJwt())

      expect(hasLocalDevToken()).toBe(false)
      expect(localStorage.getItem('scc_dev_token')).toBeNull()
    })

    test('is false outside development mode', () => {
      localStorage.setItem('scc_dev_token', fakeJwt())
      vi.stubEnv('MODE', 'production')
      expect(hasLocalDevToken()).toBe(false)
    })
  })

  describe('getLocalDevSession', () => {
    test('returns null when token or channel is missing', () => {
      localStorage.setItem('scc_dev_token', fakeJwt())
      expect(getLocalDevSession()).toBeNull()
    })
  })

  describe('setLocalDevChannel', () => {
    test('updates the stored channel id, trimming whitespace', () => {
      setLocalDevChannel('  555  ')
      expect(localStorage.getItem('scc_dev_channel')).toBe('555')
    })

    test('ignores empty/whitespace input', () => {
      setLocalDevChannel('   ')
      expect(localStorage.getItem('scc_dev_channel')).toBeNull()
    })

    test('is a no-op outside development mode', () => {
      vi.stubEnv('MODE', 'production')
      setLocalDevChannel('555')
      expect(localStorage.getItem('scc_dev_channel')).toBeNull()
    })
  })

  describe('clearLocalDevSession', () => {
    test('removes the session and returns to mocks', () => {
      localStorage.setItem('scc_dev_token', fakeJwt())
      localStorage.setItem('scc_dev_channel', '999')
      localStorage.setItem('scc_dev_backend', 'https://staging.example.com')

      clearLocalDevSession()

      expect(localStorage.getItem('scc_dev_token')).toBeNull()
      expect(localStorage.getItem('scc_dev_channel')).toBeNull()
      expect(localStorage.getItem('scc_dev_backend')).toBeNull()
      expect(updateMockConfig).toHaveBeenCalledWith({ useRealServer: false })
      expect(disconnectPhoenixSocket).toHaveBeenCalled()
    })

    test('never touches the primary auth token, even in dev mode', () => {
      localStorage.setItem('token', 'real-auth-token')
      localStorage.setItem('scc_dev_token', fakeJwt())
      localStorage.setItem('scc_dev_channel', '999')

      clearLocalDevSession()

      expect(localStorage.getItem('token')).toBe('real-auth-token')
      expect(localStorage.getItem('scc_dev_token')).toBeNull()
    })

    test('is a no-op outside development mode', () => {
      vi.stubEnv('MODE', 'production')
      localStorage.setItem('scc_dev_token', 'anything')

      clearLocalDevSession()

      expect(localStorage.getItem('scc_dev_token')).toBe('anything')
      expect(updateMockConfig).not.toHaveBeenCalled()
    })
  })

  describe('backend URL derivation (devSessionStorage)', () => {
    test('defaults to the production endpoints without a dev backend', () => {
      expect(getSocketUrl()).toBe('wss://stream-cc.gooseman.codes/socket')
      expect(getGraphqlUrl()).toBe('https://stream-cc.gooseman.codes/api')
    })

    test('derives ws/http URLs from the seeded backend origin', () => {
      localStorage.setItem('scc_dev_backend', 'http://localhost:4000')
      expect(getSocketUrl()).toBe('ws://localhost:4000/socket')
      expect(getGraphqlUrl()).toBe('http://localhost:4000/api')

      localStorage.setItem('scc_dev_backend', 'https://staging.example.com')
      expect(getSocketUrl()).toBe('wss://staging.example.com/socket')
    })

    test('ignores the seeded backend outside development mode', () => {
      localStorage.setItem('scc_dev_backend', 'http://localhost:4000')
      vi.stubEnv('MODE', 'production')

      expect(getSocketUrl()).toBe('wss://stream-cc.gooseman.codes/socket')
      expect(getGraphqlUrl()).toBe('https://stream-cc.gooseman.codes/api')
    })
  })
})
