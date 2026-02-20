import { renderHook, waitFor } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTwitchVisibility } from '../useTwitchVisibility'

describe('useTwitchVisibility', () => {
  beforeEach(() => {
    delete window.Twitch
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('should initialize with false visibility', () => {
    window.Twitch = {
      ext: {
        onVisibilityChanged: vi.fn(),
      },
    }

    const { result } = renderHook(() => useTwitchVisibility())

    expect(result.current).toBe(false)
  })

  test('should set up visibility change listener', () => {
    const mockOnVisibilityChanged = vi.fn()
    window.Twitch = {
      ext: {
        onVisibilityChanged: mockOnVisibilityChanged,
      },
    }

    renderHook(() => useTwitchVisibility())

    expect(mockOnVisibilityChanged).toHaveBeenCalled()
  })

  test('should update visibility state when listener fires', async () => {
    let visibilityCallback = null
    const mockOnVisibilityChanged = vi.fn((callback) => {
      visibilityCallback = callback
    })

    window.Twitch = {
      ext: {
        onVisibilityChanged: mockOnVisibilityChanged,
      },
    }

    const { result } = renderHook(() => useTwitchVisibility())

    // Simulate visibility change to true
    visibilityCallback(true, {})

    await waitFor(() => {
      expect(result.current).toBe(true)
    })
  })

  test('should handle visibility change to false', async () => {
    let visibilityCallback = null
    const mockOnVisibilityChanged = vi.fn((callback) => {
      visibilityCallback = callback
    })

    window.Twitch = {
      ext: {
        onVisibilityChanged: mockOnVisibilityChanged,
      },
    }

    const { result } = renderHook(() => useTwitchVisibility())

    // Simulate visibility change to true first
    visibilityCallback(true, {})

    await waitFor(() => {
      expect(result.current).toBe(true)
    })

    // Then change to false
    visibilityCallback(false, {})

    await waitFor(() => {
      expect(result.current).toBe(false)
    })
  })

  test('should log visibility changes', async () => {
    let visibilityCallback = null
    const mockOnVisibilityChanged = vi.fn((callback) => {
      visibilityCallback = callback
    })

    window.Twitch = {
      ext: {
        onVisibilityChanged: mockOnVisibilityChanged,
      },
    }

    renderHook(() => useTwitchVisibility())

    visibilityCallback(true, {})

    expect(console.log).toHaveBeenCalledWith(
      'Twitch visibility changed to true',
    )
  })

  test('should handle missing Twitch API gracefully', () => {
    delete window.Twitch

    const { result } = renderHook(() => useTwitchVisibility())

    expect(result.current).toBe(false)
  })

  test('should handle Twitch API without ext property', () => {
    window.Twitch = {}

    const { result } = renderHook(() => useTwitchVisibility())

    expect(result.current).toBe(false)
  })
})
