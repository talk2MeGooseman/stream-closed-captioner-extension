import { pick, pipe } from 'ramda'
import { useEffect } from 'react'

import { isLocalDevEnabled, getLocalDevSession } from '../utils/localDevSession'

const CONTEXT_EVENTS_WHITELIST = [
  'arePlayerControlsVisible',
  'hlsLatencyBroadcaster',
  'displayResolution',
]

// Defaults for local dev sessions, where the Twitch player never emits
// onContext: keep the overlay controls reachable and don't delay captions by
// an unknown (NaN) HLS latency.
const LOCAL_DEV_CONTEXT = {
  arePlayerControlsVisible: true,
  hlsLatencyBroadcaster: 0,
}

export const useTwitchContext = (callback) => {
  const itsTwitch = window.Twitch?.ext
  useEffect(() => {
    // An admin-seeded dev session gets a synthesized context, since the real
    // one only ever arrives inside the Twitch player.
    if (isLocalDevEnabled() && getLocalDevSession()) {
      callback(LOCAL_DEV_CONTEXT)
      return
    }

    if (itsTwitch) {
      itsTwitch.onContext((context, delta) => {
        pipe(pick(delta), pick(CONTEXT_EVENTS_WHITELIST), callback)(context)
      })
    }
  }, [callback, itsTwitch])

  return
}
