import { useState, useEffect } from 'react'

export const useTwitchAuth = () => {
  const [twitchAuth, setTwitchAuth] = useState({
    authorized: false,
    channelId: '',
    clientId: '',
    token: '',
    userId: '',
  })

  const twitchContext = window.Twitch?.ext

  useEffect(() => {
    if (twitchContext) {
      twitchContext.onAuthorized((twitchResponse) => {
        setTwitchAuth({ authorized: true, ...twitchResponse })
      })
    }
  }, [twitchContext])

  return twitchAuth
}
