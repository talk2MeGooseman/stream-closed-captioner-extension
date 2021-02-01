import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { updateVideoPlayerContext } from '@/redux/video-player-context-slice'

import { CONTEXT_EVENTS_WHITELIST } from '@/utils/Constants'


export function useContextUpdateHandler() {
  const dispatch = useDispatch()

  const onUpdateVideoPlayerContext = useCallback(
    (state) => dispatch(updateVideoPlayerContext(state)),
    [dispatch]
  )

  return useCallback(
    (context, delta) => {
      if (isContextUpdated(delta)) {
        const newContext = fetchChangedContextValues(context, delta)

        onUpdateVideoPlayerContext(newContext)
      }
    },
    [onUpdateVideoPlayerContext]
  )
}

export function fetchChangedContextValues(context, delta) {
  const newData = {}

  delta.forEach((event) => {
    newData[event] = context[event]
  })

  return newData
}

export function isContextUpdated(delta) {
  return delta.find((event) => CONTEXT_EVENTS_WHITELIST.includes(event))
}
