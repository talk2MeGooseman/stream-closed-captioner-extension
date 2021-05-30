import { pick, pipe, mergeRight } from 'ramda'
import { useState, useEffect } from 'react'

const CONTEXT_EVENTS_WHITELIST = [
  'arePlayerControlsVisible',
  'hlsLatencyBroadcaster',
  'displayResolution',
]

export const useTwitchContext = () => {
  const [twitchContext, setTwitchContext] = useState({
    arePlayerControlsVisible: false,
    displayResolution: null,
    hlsLatencyBroadcaster: 0,
  })

  const itsTwitch = window.Twitch?.ext
  useEffect(() => {
    if (itsTwitch) {
      itsTwitch.onContext((context, delta) => {
        pipe(
          pick(delta),
          pick(CONTEXT_EVENTS_WHITELIST),
          mergeRight(twitchContext),
          setTwitchContext,
        )(context)
      })
    }
  }, [itsTwitch, twitchContext])

  return twitchContext
}
