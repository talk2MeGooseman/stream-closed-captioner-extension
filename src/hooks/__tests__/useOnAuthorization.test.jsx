import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'

import { useOnAuthorization } from '../useOnAuthorization'
import { setChannelId } from '@/redux/products-slice'
import { apolloClient } from '@/utils'
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

  test('dispatches the channel id and a translation status request', async () => {
    // Stub store so the requestTranslationStatus thunk is captured
    // instead of executed (it would otherwise hit the network)
    const dispatch = vi.fn()
    const store = {
      dispatch,
      getState: () => ({}),
      subscribe: () => () => {},
    }
    const querySpy = vi
      .spyOn(apolloClient, 'query')
      .mockResolvedValue({ data: null })

    const TestComponent = () => {
      const onAuthorized = useOnAuthorization()
      return (
        <button onClick={() => onAuthorized({ channelId: '444' })}>
          authorize
        </button>
      )
    }

    const { getByText } = render(
      <Provider store={store}>
        <TestComponent />
      </Provider>,
    )

    fireEvent.click(getByText('authorize'))

    expect(dispatch).toHaveBeenCalledWith(setChannelId('444'))

    // Run the captured requestTranslationStatus thunk and verify it
    // queries with the authorized channel id
    const thunk = dispatch.mock.calls
      .map(([action]) => action)
      .find((action) => typeof action === 'function')
    expect(thunk).toBeTruthy()

    await thunk(vi.fn())

    expect(querySpy).toHaveBeenCalledWith(
      expect.objectContaining({ variables: { id: '444' } }),
    )
  })
})
