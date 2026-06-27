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
    if (twitchContext) {
      twitchContext.onAuthorized((twitchResponse) => {
        setTwitchAuth({ authorized: true, ...twitchResponse })
      })
      return
    }

    // Running locally, outside the Twitch host. If a dev session was seeded via
    // the admin "Local Extension Testing" page, behave as if Twitch authorized
    // us for that broadcaster so the normal caption flow runs unchanged.
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
      }
    }
  }, [twitchContext])

  return twitchAuth
}
