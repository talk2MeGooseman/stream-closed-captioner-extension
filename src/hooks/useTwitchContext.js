import { pick, pipe } from 'ramda'
import { useEffect } from 'react'

const CONTEXT_EVENTS_WHITELIST = [
  'arePlayerControlsVisible',
  'hlsLatencyBroadcaster',
  'displayResolution',
]

export const useTwitchContext = (callback) => {
  const itsTwitch = window.Twitch?.ext
  useEffect(() => {
    if (itsTwitch) {
      itsTwitch.onContext((context, delta) => {
        pipe(pick(delta), pick(CONTEXT_EVENTS_WHITELIST), callback)(context)
      })
    }
  }, [callback, itsTwitch])

  return
}
