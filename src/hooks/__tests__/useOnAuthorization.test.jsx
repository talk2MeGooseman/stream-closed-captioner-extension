import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { useOnAuthorization } from '../useOnAuthorization'
import { renderWithRedux } from '@/setupTests'

describe('useOnAuthorization', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('should return a callback function', () => {
    const TestComponent = () => {
      const callback = useOnAuthorization()
      return (
        <div data-testid="test">
          {typeof callback === 'function' ? 'function' : 'not'}
        </div>
      )
    }

    const { container } = renderWithRedux(<TestComponent />)
    expect(
      container.querySelector('[data-testid="test"]').textContent,
    ).toContain('function')
  })
})
