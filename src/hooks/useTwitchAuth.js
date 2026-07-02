import { useState, useEffect } from 'react'

import {
  isLocalDevEnabled,
  loadLocalDevSession,
} from '../utils/localDevSession'

// Owner account uid. Only used to populate a plausible userId for the
// synthesized local-dev auth; the backend trusts the JWT, not this value.
const LOCAL_DEV_USER_ID = '120750024'

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
    // Check for an admin-seeded dev session BEFORE deferring to the Twitch
    // host: the helper script (loaded from Twitch's CDN in every HTML entry
    // point) defines window.Twitch.ext even outside a Twitch iframe, where
    // onAuthorized would never fire — so a dev session must take precedence
    // for the local testing flow to be reachable at all.
    if (isLocalDevEnabled()) {
      const session = loadLocalDevSession()

      if (session) {
        setTwitchAuth({
          authorized: true,
          channelId: session.channelId,
          clientId: 'local-dev',
          token: session.token,
          userId: LOCAL_DEV_USER_ID,
        })

        return
      }
    }

    if (twitchContext) {
      twitchContext.onAuthorized((twitchResponse) => {
        setTwitchAuth({ authorized: true, ...twitchResponse })
      })
    }
  }, [twitchContext])

  return twitchAuth
}
