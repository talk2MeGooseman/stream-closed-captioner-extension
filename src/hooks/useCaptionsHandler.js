import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { updateCCText } from '../redux/captions-slice'
import { useShallowEqualSelector } from '../redux/redux-helpers'
import { SECOND } from '../utils/Constants'

export function useCaptionsHandler() {
  const dispatch = useDispatch()

  const videoPlayerContext = useShallowEqualSelector(
    (state) => state.videoPlayerContext,
  )

  const onUpdateCCText = useCallback(
    (state) => dispatch(updateCCText(state)),
    [dispatch],
  )

  const displayClosedCaptioningText = useCallback(
    (message) => {
      const { hlsLatencyBroadcaster } = videoPlayerContext
      let delayTime = hlsLatencyBroadcaster * SECOND

      if (message.delay) {
        delayTime -= message.delay * SECOND
      }

      setTimeout(() => {
        onUpdateCCText(message)
      }, delayTime)
    },
    [onUpdateCCText, videoPlayerContext],
  )

  return useCallback(
    (target, contentType, message) => {
      let parsedMessage = null

      try {
        parsedMessage = JSON.parse(message)
      } catch (error) {
        parsedMessage = {
          interim: message,
        }
      }

      displayClosedCaptioningText(parsedMessage)
    },
    [displayClosedCaptioningText],
  )
}
