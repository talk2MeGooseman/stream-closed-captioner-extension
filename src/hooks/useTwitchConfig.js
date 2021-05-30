import { useState, useEffect } from 'react'

export const useTwitchConfig = () => {
  const [broadcastConfig, setBroadcastConfig] = useState({})
  const [globalConfig, setGlobalConfig] = useState({})
  const [features, setFeatures] = useState({})

  const itsTwitch = window.Twitch?.ext
  useEffect(() => {
    if (itsTwitch) {
      itsTwitch.configuration.onChanged(() => {
        const broadcast = itsTwitch.configuration.broadcaster?.content || '{}'
        const global = itsTwitch.configuration.global?.content || '{}'

        setFeatures(itsTwitch?.features)
        setBroadcastConfig(JSON.parse(broadcast))
        setGlobalConfig(JSON.parse(global))
      })
    }
  }, [itsTwitch])

  return { broadcastConfig, features, globalConfig }
}
