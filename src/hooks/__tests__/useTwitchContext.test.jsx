import { renderHook } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTwitchContext } from '../useTwitchContext'
import {
  isLocalDevEnabled,
  getLocalDevSession,
} from '../../utils/localDevSession'

vi.mock('../../utils/localDevSession', () => ({
  isLocalDevEnabled: vi.fn(() => false),
  getLocalDevSession: vi.fn(() => null),
}))

describe('useTwitchContext', () => {
  beforeEach(() => {
    delete window.Twitch
    // Local dev seam defaults to off so the Twitch-host tests are unaffected.
    vi.mocked(isLocalDevEnabled).mockReturnValue(false)
    vi.mocked(getLocalDevSession).mockReturnValue(null)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('should set up context listener when Twitch is available', () => {
    const mockOnContext = vi.fn()
    window.Twitch = {
      ext: {
        onContext: mockOnContext,
      },
    }

    const mockCallback = vi.fn()
    renderHook(() => useTwitchContext(mockCallback))

    expect(mockOnContext).toHaveBeenCalled()
  })

  test('should call callback with filtered context', () => {
    let contextCallback = null
    const mockOnContext = vi.fn((callback) => {
      contextCallback = callback
    })

    window.Twitch = {
      ext: {
        onContext: mockOnContext,
      },
    }

    const mockCallback = vi.fn()
    renderHook(() => useTwitchContext(mockCallback))

    const mockContext = {
      arePlayerControlsVisible: true,
      hlsLatencyBroadcaster: 5000,
      displayResolution: '1080p',
      someOtherProperty: 'should be filtered out',
    }

    const mockDelta = ['arePlayerControlsVisible', 'hlsLatencyBroadcaster']

    contextCallback(mockContext, mockDelta)

    expect(mockCallback).toHaveBeenCalledWith({
      arePlayerControlsVisible: true,
      hlsLatencyBroadcaster: 5000,
    })
  })

  test('should handle missing Twitch API gracefully', () => {
    delete window.Twitch

    const mockCallback = vi.fn()

    expect(() => {
      renderHook(() => useTwitchContext(mockCallback))
    }).not.toThrow()

    // Callback should not be called if Twitch is missing
    expect(mockCallback).not.toHaveBeenCalled()
  })

  test('should remove properties not in whitelist', () => {
    let contextCallback = null
    const mockOnContext = vi.fn((callback) => {
      contextCallback = callback
    })

    window.Twitch = {
      ext: {
        onContext: mockOnContext,
      },
    }

    const mockCallback = vi.fn()
    renderHook(() => useTwitchContext(mockCallback))

    const mockContext = {
      arePlayerControlsVisible: true,
      someUnwhitelistedProperty: 'value',
      anotherProperty: 'removed',
    }

    const mockDelta = ['arePlayerControlsVisible', 'someUnwhitelistedProperty']

    contextCallback(mockContext, mockDelta)

    // Only whitelisted properties should be in callback
    expect(mockCallback).toHaveBeenCalledWith({
      arePlayerControlsVisible: true,
    })
  })

  test('should return undefined', () => {
    window.Twitch = {
      ext: {
        onContext: vi.fn(),
      },
    }

    const mockCallback = vi.fn()
    const { result } = renderHook(() => useTwitchContext(mockCallback))

    expect(result.current).toBeUndefined()
  })

  test('synthesizes a player context for an active local dev session', () => {
    // The Twitch player never emits onContext during local dev sessions, so
    // sensible defaults keep the overlay controls reachable and the caption
    // delay finite (instead of NaN from an undefined hlsLatencyBroadcaster).
    vi.mocked(isLocalDevEnabled).mockReturnValue(true)
    vi.mocked(getLocalDevSession).mockReturnValue({
      token: 'dev.jwt.token',
      channelId: '999',
      backend: null,
    })
    const mockCallback = vi.fn()

    renderHook(() => useTwitchContext(mockCallback))

    expect(mockCallback).toHaveBeenCalledWith({
      arePlayerControlsVisible: true,
      hlsLatencyBroadcaster: 0,
    })
  })

  test('does not synthesize a context without a dev session', () => {
    vi.mocked(isLocalDevEnabled).mockReturnValue(true)
    const mockCallback = vi.fn()

    renderHook(() => useTwitchContext(mockCallback))

    expect(mockCallback).not.toHaveBeenCalled()
  })
})
