import { useEffect } from 'react'
import { pipe } from 'ramda'

export const useTwitchPubSub = (onBroadcast) => {
  const itsTwitch = window.Twitch?.ext
  useEffect(() => {
    const broadcaster = (_target, _contentType, message) => {
      try {
        pipe(JSON.parse, onBroadcast)(message)
        // eslint-disable-next-line no-empty
      } catch (error) {}
    }

    if (itsTwitch) {
      itsTwitch.unlisten('broadcast', broadcaster)
      itsTwitch.listen('broadcast', broadcaster)
    }

    return () => {
      itsTwitch.unlisten('broadcast', broadcaster)
    }
  }, [onBroadcast, itsTwitch])

  return
}
