import { renderHook, waitFor } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTwitchAuth } from '../useTwitchAuth'
import {
  isLocalDevEnabled,
  loadLocalDevSession,
} from '../../utils/localDevSession'

vi.mock('../../utils/localDevSession', () => ({
  isLocalDevEnabled: vi.fn(() => false),
  loadLocalDevSession: vi.fn(() => null),
}))

describe('useTwitchAuth', () => {
  beforeEach(() => {
    // Reset Twitch mock before each test
    delete window.Twitch
    // Local dev seam defaults to off so the Twitch-host tests are unaffected.
    vi.mocked(isLocalDevEnabled).mockReturnValue(false)
    vi.mocked(loadLocalDevSession).mockReturnValue(null)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('should initialize with default auth state', () => {
    window.Twitch = {
      ext: {
        onAuthorized: vi.fn(),
      },
    }

    const { result } = renderHook(() => useTwitchAuth())

    expect(result.current).toEqual({
      authorized: false,
      channelId: '',
      clientId: '',
      token: '',
      userId: '',
    })
  })

  test('should call onAuthorized listener when Twitch is available', () => {
    const mockOnAuthorized = vi.fn()
    window.Twitch = {
      ext: {
        onAuthorized: mockOnAuthorized,
      },
    }

    renderHook(() => useTwitchAuth())

    expect(mockOnAuthorized).toHaveBeenCalled()
  })

  test('should update auth state when onAuthorized callback fires', async () => {
    let authCallback = null
    const mockOnAuthorized = vi.fn((callback) => {
      authCallback = callback
    })

    window.Twitch = {
      ext: {
        onAuthorized: mockOnAuthorized,
      },
    }

    const { result } = renderHook(() => useTwitchAuth())

    const mockAuthResponse = {
      token: 'mock-token-123',
      userId: 'user-456',
      clientId: 'client-789',
      channelId: 'channel-000',
    }

    // Simulate Twitch calling the onAuthorized callback
    authCallback(mockAuthResponse)

    await waitFor(() => {
      expect(result.current.authorized).toBe(true)
      expect(result.current.token).toBe('mock-token-123')
      expect(result.current.userId).toBe('user-456')
    })
  })

  test('should handle missing Twitch API gracefully', () => {
    // Don't set window.Twitch
    delete window.Twitch

    // Should not throw error
    expect(() => {
      renderHook(() => useTwitchAuth())
    }).not.toThrow()

    const { result } = renderHook(() => useTwitchAuth())
    expect(result.current.authorized).toBe(false)
  })

  test('should handle Twitch API without ext property', () => {
    window.Twitch = {}

    // Should not throw error
    expect(() => {
      renderHook(() => useTwitchAuth())
    }).not.toThrow()

    const { result } = renderHook(() => useTwitchAuth())
    expect(result.current.authorized).toBe(false)
  })

  test('synthesizes auth from a local dev session when Twitch is absent', async () => {
    delete window.Twitch
    vi.mocked(isLocalDevEnabled).mockReturnValue(true)
    vi.mocked(loadLocalDevSession).mockReturnValue({
      token: 'dev.jwt.token',
      channelId: '12345',
    })

    const { result } = renderHook(() => useTwitchAuth())

    await waitFor(() => {
      expect(result.current.authorized).toBe(true)
      expect(result.current.channelId).toBe('12345')
      expect(result.current.token).toBe('dev.jwt.token')
      expect(result.current.userId).toBe('120750024')
    })
  })

  test('does not synthesize auth when no dev session exists', () => {
    delete window.Twitch
    vi.mocked(isLocalDevEnabled).mockReturnValue(true)
    vi.mocked(loadLocalDevSession).mockReturnValue(null)

    const { result } = renderHook(() => useTwitchAuth())

    expect(result.current.authorized).toBe(false)
  })
})
