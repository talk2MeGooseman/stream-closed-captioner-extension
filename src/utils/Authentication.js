const jwt = require('jsonwebtoken')

/**
 * Helper class for authentication against an EBS service.
 * Allows the storage of a token to be accessed across componenents.
 */
export default class Authentication {
  constructor(token, opaqueId) {
    this.state = {
      isMod: false,
      opaqueId,
      role: '',
      token,
      userId: false,
    }
  }

  // this does guarantee the user is a moderator- this is fairly simple to bypass -
  // so pass the JWT and verify
  // server-side that this is true. This, however, allows
  // you to render client-side UI for users without holding on a backend to verify the JWT.
  isModerator() {
    return this.state.isMod
  }

  // similar to mod status, this isn't always verifyable, so have your backend verify
  // before proceeding.
  hasSharedId() {
    return Boolean(this.state.userId)
  }

  getUserId() {
    return this.state.userId
  }

  // set the token in the Authentication componenent state
  setToken(token, opaqueId) {
    let mod = false
    let tokenRole = ''
    let tokenUserId = ''

    try {
      const { role, userId } = jwt.decode(token)

      mod = isMod(role, mod)

      tokenUserId = userId
      tokenRole = role

      this.state = {
        isMod: mod,
        opaqueId,
        role: tokenRole,
        token,
        userId: tokenUserId,
      }
    } catch (e) {
      this.state = {
        isMod: mod,
        opaqueId: '',
        role: tokenRole,
        token: '',
        userId: tokenUserId,
      }
    }
  }

  // checks to ensure there is a valid token in the state
  isAuthenticated() {
    if (this.state.token && this.state.opaqueId) {
      return true
    }
    return false
  }

  /**
     * Makes a call against a given endpoint using a specific method.
     *
     * Returns a Promise with the Request() object per fetch documentation.
     *
     */

  makeCall(url, method = 'GET') {
    return new Promise((resolve, reject) => {
      if (this.isAuthenticated()) {
        const headers = {
          Authorization: `Bearer ${this.state.token}`,
          'Content-Type': 'application/json',
        }

        fetch(url,
          {
            headers,
            method,
          })
          .then((response) => resolve(response))
          .catch((e) => reject(e))
      } else {
        reject('Unauthorized')
      }
    })
  }
}

function isMod(role, mod) {
  if (role === 'broadcaster' || role === 'moderator') {
    return true
  }
  return mod
}
