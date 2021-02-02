/* eslint-disable jsx-a11y/control-has-associated-label */
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { useDispatch } from 'react-redux'

import { useCaptionsHandler } from '../useCaptionsHandler'

import { updateVideoPlayerContext } from '@/redux/video-player-context-slice'

import { renderWithRedux } from '@/setupTests'

describe('useCaptionsHandler', () => {
  jest.useFakeTimers()

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
    renderWithRedux(<TestComponent />)

    const delayInput = screen.getByLabelText('Caption Delay')

    userEvent.type(delayInput , "2")

    const messageInput = screen.getByLabelText('Caption Message')

    userEvent.type(messageInput , 'A')

    expect(setTimeout).toHaveBeenCalledTimes(2)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 2000)
  })
})
