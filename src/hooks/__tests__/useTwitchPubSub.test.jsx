import { renderHook } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTwitchPubSub } from '../useTwitchPubSub'

describe('useTwitchPubSub', () => {
  beforeEach(() => {
    delete window.Twitch
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('should set up PubSub listener when Twitch is available', () => {
    const mockListen = vi.fn()
    const mockUnlisten = vi.fn()

    window.Twitch = {
      ext: {
        listen: mockListen,
        unlisten: mockUnlisten,
      },
    }

    const mockCallback = vi.fn()
    renderHook(() => useTwitchPubSub(mockCallback))

    expect(mockUnlisten).toHaveBeenCalledWith('broadcast', expect.any(Function))
    expect(mockListen).toHaveBeenCalledWith('broadcast', expect.any(Function))
  })

  test('should parse JSON message and call callback', () => {
    let broadcasterCallback = null
    const mockListen = vi.fn((channel, callback) => {
      broadcasterCallback = callback
    })
    const mockUnlisten = vi.fn()

    window.Twitch = {
      ext: {
        listen: mockListen,
        unlisten: mockUnlisten,
      },
    }

    const mockCallback = vi.fn()
    renderHook(() => useTwitchPubSub(mockCallback))

    const testMessage = JSON.stringify({ text: 'Hello World', id: '123' })
    broadcasterCallback(null, null, testMessage)

    expect(mockCallback).toHaveBeenCalledWith({
      text: 'Hello World',
      id: '123',
    })
  })

  test('should handle invalid JSON gracefully', () => {
    let broadcasterCallback = null
    const mockListen = vi.fn((channel, callback) => {
      broadcasterCallback = callback
    })
    const mockUnlisten = vi.fn()

    window.Twitch = {
      ext: {
        listen: mockListen,
        unlisten: mockUnlisten,
      },
    }

    const mockCallback = vi.fn()
    renderHook(() => useTwitchPubSub(mockCallback))

    // Pass invalid JSON - should not throw and should not call callback
    const invalidMessage = '{invalid json}'
    expect(() => {
      broadcasterCallback(null, null, invalidMessage)
    }).not.toThrow()

    expect(mockCallback).not.toHaveBeenCalled()
  })

  test('should clean up listener on unmount', () => {
    const mockListen = vi.fn()
    const mockUnlisten = vi.fn()

    window.Twitch = {
      ext: {
        listen: mockListen,
        unlisten: mockUnlisten,
      },
    }

    const mockCallback = vi.fn()
    const { unmount } = renderHook(() => useTwitchPubSub(mockCallback))

    // Should have already called unlisten once on setup
    expect(mockUnlisten).toHaveBeenCalledTimes(1)

    unmount()

    // Should be called again on unmount
    expect(mockUnlisten).toHaveBeenCalledTimes(2)
  })

  test('should return undefined', () => {
    window.Twitch = {
      ext: {
        listen: vi.fn(),
        unlisten: vi.fn(),
      },
    }

    const mockCallback = vi.fn()
    const { result } = renderHook(() => useTwitchPubSub(mockCallback))

    expect(result.current).toBeUndefined()
  })
})
