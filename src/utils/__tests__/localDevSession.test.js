import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../graphql-mocks', () => ({
  updateMockConfig: vi.fn(),
}))

vi.mock('../apollo', () => ({
  initializePhoenixSocket: vi.fn(),
  connectPhoenixSocket: vi.fn(),
}))

import { updateMockConfig } from '../graphql-mocks'
import { initializePhoenixSocket, connectPhoenixSocket } from '../apollo'
import {
  isLocalDevEnabled,
  getLocalDevSession,
  loadLocalDevSession,
  setLocalDevChannel,
  clearLocalDevSession,
} from '../localDevSession'

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
      window.location.hash = '#scc_dev_token=jwt.abc.def&scc_dev_channel=12345'

      const session = loadLocalDevSession()

      expect(session).toEqual({ token: 'jwt.abc.def', channelId: '12345' })
      expect(localStorage.getItem('token')).toBe('jwt.abc.def')
      expect(localStorage.getItem('scc_dev_channel')).toBe('12345')
      expect(updateMockConfig).toHaveBeenCalledWith({ useRealServer: true })
      expect(initializePhoenixSocket).toHaveBeenCalled()
      expect(connectPhoenixSocket).toHaveBeenCalled()
      // Fragment is stripped so the token doesn't linger in the address bar.
      expect(window.location.hash).toBe('')
    })

    test('returns a previously persisted session when no fragment is present', () => {
      localStorage.setItem('token', 'stored.jwt')
      localStorage.setItem('scc_dev_channel', '999')

      const session = loadLocalDevSession()

      expect(session).toEqual({ token: 'stored.jwt', channelId: '999' })
      expect(updateMockConfig).toHaveBeenCalledWith({ useRealServer: true })
      expect(connectPhoenixSocket).toHaveBeenCalled()
    })

    test('does nothing without a session', () => {
      const session = loadLocalDevSession()

      expect(session).toBeNull()
      expect(updateMockConfig).not.toHaveBeenCalled()
      expect(connectPhoenixSocket).not.toHaveBeenCalled()
    })

    test('is inert outside development mode', () => {
      vi.stubEnv('MODE', 'production')
      window.location.hash = '#scc_dev_token=jwt.abc.def&scc_dev_channel=12345'

      const session = loadLocalDevSession()

      expect(session).toBeNull()
      expect(localStorage.getItem('token')).toBeNull()
      expect(updateMockConfig).not.toHaveBeenCalled()
    })
  })

  describe('getLocalDevSession', () => {
    test('returns null when token or channel is missing', () => {
      localStorage.setItem('token', 'only-token')
      expect(getLocalDevSession()).toBeNull()
    })
  })

  describe('setLocalDevChannel', () => {
    test('updates the stored channel id', () => {
      setLocalDevChannel('555')
      expect(localStorage.getItem('scc_dev_channel')).toBe('555')
    })
  })

  describe('clearLocalDevSession', () => {
    test('removes the session and returns to mocks', () => {
      localStorage.setItem('token', 'stored.jwt')
      localStorage.setItem('scc_dev_channel', '999')

      clearLocalDevSession()

      expect(localStorage.getItem('token')).toBeNull()
      expect(localStorage.getItem('scc_dev_channel')).toBeNull()
      expect(updateMockConfig).toHaveBeenCalledWith({ useRealServer: false })
    })
  })
})
