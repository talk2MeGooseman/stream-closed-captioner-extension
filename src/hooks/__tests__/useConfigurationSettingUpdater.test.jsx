import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { useConfigurationSettingUpdater } from '../useConfigurationSettingUpdater'
import { renderWithRedux } from '@/setupTests'

describe('useConfigurationSettingUpdater', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('should return a callback function', () => {
    const TestComponent = () => {
      const mockSetReady = vi.fn()
      const callback = useConfigurationSettingUpdater(null, mockSetReady)
      return <div>{typeof callback === 'function' ? 'callback' : 'none'}</div>
    }

    const { container } = renderWithRedux(<TestComponent />)
    expect(container.textContent).toContain('callback')
  })

  test('should call setReady when callback executes', () => {
    let setReadyCalled = false
    let testCallback = null

    const TestComponent = () => {
      const mockSetReady = vi.fn(() => {
        setReadyCalled = true
      })
      const mockTwitch = {
        configuration: {
          broadcaster: {
            content: JSON.stringify({ fontSize: 20 }),
          },
        },
        features: {
          isBitsEnabled: true,
        },
      }

      const callback = useConfigurationSettingUpdater(mockTwitch, mockSetReady)
      testCallback = callback

      return <div>component</div>
    }

    renderWithRedux(<TestComponent />)

    if (testCallback) {
      testCallback()
      expect(setReadyCalled).toBe(true)
    }
  })
})
