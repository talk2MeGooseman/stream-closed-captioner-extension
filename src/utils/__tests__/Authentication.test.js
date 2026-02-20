import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import Authentication from '../Authentication'

describe('Authentication', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('should create an instance with token and opaqueId', () => {
    const auth = new Authentication('test-token', 'opaque-123')

    expect(auth.state.token).toBe('test-token')
    expect(auth.state.opaqueId).toBe('opaque-123')
  })

  test('should initialize with default state values', () => {
    const auth = new Authentication('', '')

    expect(auth.state.channelId).toBe('')
    expect(auth.state.isMod).toBe(false)
    expect(auth.state.role).toBe('')
    expect(auth.state.userId).toBe(false)
  })

  test('should return false for isModerator when not a mod', () => {
    const auth = new Authentication('token', 'opaque')
    expect(auth.isModerator()).toBe(false)
  })

  test('should return false for hasSharedId when userId is falsy', () => {
    const auth = new Authentication('token', 'opaque')
    expect(auth.hasSharedId()).toBe(false)
  })

  test('should return userId from state', () => {
    const auth = new Authentication('token', 'opaque')
    auth.state.userId = 'user-123'

    expect(auth.getUserId()).toBe('user-123')
  })

  test('should return channelId from state', () => {
    const auth = new Authentication('token', 'opaque')
    auth.state.channelId = 'channel-456'

    expect(auth.getChannelId()).toBe('channel-456')
  })

  test('should return false for isAuthenticated when token is missing', () => {
    const auth = new Authentication('', 'opaque')

    expect(auth.isAuthenticated()).toBe(false)
  })

  test('should return false for isAuthenticated when opaqueId is missing', () => {
    const auth = new Authentication('token', '')

    expect(auth.isAuthenticated()).toBe(false)
  })

  test('should return true for isAuthenticated when both token and opaqueId are present', () => {
    const auth = new Authentication('token', 'opaque')

    expect(auth.isAuthenticated()).toBe(true)
  })

  test('should set token with valid JWT and store in localStorage', () => {
    const auth = new Authentication('', '')

    // Mock JWT token  - note real token would have proper JWT format
    // For testing, we'll use a valid JWT structure
    const mockToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoibW9kZXJhdG9yIiwidXNlcklkIjoidXNlci0xMjMiLCJjaGFubmVsSWQiOiJjaGFubmVsLTQ1NiJ9.fake-signature'

    auth.setToken(mockToken, 'opaque-123')

    expect(auth.state.token).toBe(mockToken)
    expect(auth.state.opaqueId).toBe('opaque-123')
    expect(localStorage.getItem('token')).toBe(mockToken)
  })

  test('should recognize broadcaster as moderator', () => {
    const auth = new Authentication('', '')

    const mockToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYnJvYWRjYXN0ZXIiLCJ1c2VySWQiOiJ1c2VyLTEyMyIsImNoYW5uZWxJZCI6ImNoYW5uZWwtNDU2In0.fake-signature'

    auth.setToken(mockToken, 'opaque-123')

    expect(auth.isModerator()).toBe(true)
  })

  test('should recognize moderator as moderator', () => {
    const auth = new Authentication('', '')

    const mockToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoibW9kZXJhdG9yIiwidXNlcklkIjoidXNlci0xMjMiLCJjaGFubmVsSWQiOiJjaGFubmVsLTQ1NiJ9.fake-signature'

    auth.setToken(mockToken, 'opaque-123')

    expect(auth.isModerator()).toBe(true)
  })

  test('should handle invalid JWT gracefully', () => {
    const auth = new Authentication('valid-token', 'opaque-123')

    auth.setToken('invalid-jwt', 'opaque-123')

    // State should be reset but with empty values
    expect(auth.state.token).toBe('')
    expect(auth.state.isMod).toBe(false)
  })

  test('should reject unauthenticated makeCall requests', async () => {
    const auth = new Authentication('', '')

    try {
      await auth.makeCall('https://example.com', 'GET')
      expect.fail('Should have thrown')
    } catch (error) {
      expect(error).toBe('Unauthorized')
    }
  })

  test('should make authenticated fetch call with headers', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true })
    global.fetch = mockFetch

    const auth = new Authentication('test-token', 'opaque-123')

    await auth.makeCall('https://example.com', 'GET')

    expect(mockFetch).toHaveBeenCalledWith('https://example.com', {
      headers: {
        Authorization: 'Bearer test-token',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })
  })

  test('should use POST method in makeCall', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true })
    global.fetch = mockFetch

    const auth = new Authentication('test-token', 'opaque-123')

    await auth.makeCall('https://example.com', 'POST')

    expect(mockFetch).toHaveBeenCalledWith(expect.any(String), {
      headers: expect.any(Object),
      method: 'POST',
    })
  })

  test('should return response from makeCall on success', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ data: 'test' }),
    }
    vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse)

    const auth = new Authentication('test-token', 'opaque-123')

    const result = await auth.makeCall('https://example.com')

    expect(result).toBe(mockResponse)
  })
})
