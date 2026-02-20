import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  useContextUpdateHandler,
  fetchChangedContextValues,
  isContextUpdated,
} from '../useContextUpdateHandler'
import { renderWithRedux } from '@/setupTests'

describe('useContextUpdateHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('should return a callback function', () => {
    const TestComponent = () => {
      const callback = useContextUpdateHandler()
      return <div>{typeof callback === 'function' ? 'callback' : 'none'}</div>
    }

    const { container } = renderWithRedux(<TestComponent />)
    expect(container.textContent).toContain('callback')
  })
})

describe('fetchChangedContextValues', () => {
  test('should extract changed values from context', () => {
    const mockContext = {
      hlsLatencyBroadcaster: 5000,
      arePlayerControlsVisible: true,
      displayResolution: '1080p',
      someOtherValue: 'ignore',
    }

    const mockDelta = ['hlsLatencyBroadcaster', 'arePlayerControlsVisible']

    const result = fetchChangedContextValues(mockContext, mockDelta)

    expect(result).toEqual({
      hlsLatencyBroadcaster: 5000,
      arePlayerControlsVisible: true,
    })
  })

  test('should handle empty delta', () => {
    const mockContext = {
      hlsLatencyBroadcaster: 5000,
    }

    const mockDelta = []

    const result = fetchChangedContextValues(mockContext, mockDelta)

    expect(result).toEqual({})
  })
})

describe('isContextUpdated', () => {
  test('should return truthy if delta contains whitelisted event', () => {
    const mockDelta = ['hlsLatencyBroadcaster']
    expect(isContextUpdated(mockDelta)).toBeTruthy()
  })

  test('should return falsy if delta contains no whitelisted events', () => {
    const mockDelta = ['someUnwantedProperty']
    expect(isContextUpdated(mockDelta)).toBeFalsy()
  })

  test('should return truthy if delta contains multiple whitelisted events', () => {
    const mockDelta = ['hlsLatencyBroadcaster', 'arePlayerControlsVisible']
    expect(isContextUpdated(mockDelta)).toBeTruthy()
  })
})
