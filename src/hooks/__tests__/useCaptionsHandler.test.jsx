/* eslint-disable jsx-a11y/control-has-associated-label */
import { screen, fireEvent } from '@testing-library/react'
import { useDispatch } from 'react-redux'
import { beforeEach, afterEach, describe, test, expect, vi } from 'vitest'

import { useCaptionsHandler } from '../useCaptionsHandler'

import { updateVideoPlayerContext } from '@/redux/video-player-context-slice'

import { renderWithRedux } from '@/setupTests'

describe('useCaptionsHandler', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  const TestComponent = () => {
    const dispatch = useDispatch()
    const update = (state) => dispatch(updateVideoPlayerContext(state))
    const handler = useCaptionsHandler()
    const onMessage = (e) => {
      handler(null, null, e.target.value)
    }

    const onDelay = (e) => {
      update({ hlsLatencyBroadcaster: parseInt(e.target.value)})
    }

    return (
      <>
      <label>
        Caption Message
        <input onChange={onMessage} type="text" />
      </label>
      <label>
        Caption Delay
        <input onChange={onDelay} type="text" />
      </label>
      </>
    )
  }

  test('receive a message a delay it by HLS timing', () => {
    vi.spyOn(global, 'setTimeout')

    renderWithRedux(<TestComponent />)

    const delayInput = screen.getByLabelText('Caption Delay')
    const messageInput = screen.getByLabelText('Caption Message')

    fireEvent.change(delayInput, { target: { value: '2' } })
    fireEvent.change(messageInput, { target: { value: 'A' } })
    fireEvent.change(messageInput, { target: { value: 'B' } })

    expect(setTimeout).toHaveBeenCalledTimes(2)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 2000)
  })
})
