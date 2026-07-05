/**
 * Dev-only "local extension testing" session.
 *
 * Lets the maintainer run this front end locally (`yarn start`) and connect to
 * a real, currently-live broadcaster's captions in order to validate that
 * extension changes didn't break anything.
 *
 * The token, channel id, and backend origin are minted/listed by the
 * admin-only "Local Extension Testing" page on the backend (restricted to the
 * owner account) and handed to the local build through the URL fragment, e.g.:
 *
 *   http://localhost:8080/?anchor=video_overlay&platform=web#scc_dev_token=<jwt>&scc_dev_channel=<uid>&scc_dev_backend=<origin>
 *
 * The session lives under its own `scc_dev_*` localStorage keys (see
 * `devSessionStorage.js`) so it can never collide with the primary auth token
 * the Twitch host stores under `'token'`. Expired tokens are purged on read,
 * falling back to the mock harness.
 *
 * Every entry point is gated on `import.meta.env.MODE === 'development'`, so the
 * behavior is inert in production builds (the same approach the existing mock
 * harness uses). The module may still be bundled, but it never runs outside dev.
 */
import { updateMockConfig } from './graphql-mocks'
import {
  initializePhoenixSocket,
  connectPhoenixSocket,
  disconnectPhoenixSocket,
} from './apollo'
import {
  DEV_TOKEN_KEY,
  DEV_CHANNEL_KEY,
  DEV_BACKEND_KEY,
  isLocalDevEnabled,
  getDevToken,
  getDevBackendOrigin,
  clearDevSessionStorage,
} from './devSessionStorage'

export { isLocalDevEnabled }

function parseHashParams() {
  const hash = window.location?.hash || ''
  return new URLSearchParams(hash.replace(/^#/, ''))
}

/**
 * Remove the fragment from the address bar so the token isn't left lingering
 * in the URL after we've persisted it.
 */
function stripHash() {
  if (typeof window.history?.replaceState === 'function') {
    const { pathname, search } = window.location
    window.history.replaceState(null, '', `${pathname}${search}`)
  }
}

/**
 * Read a dev session that's already persisted in localStorage.
 * @returns {{token: string, channelId: string, backend: string|null}|null}
 */
export function getLocalDevSession() {
  const token = getDevToken()

  if (!token) {
    return null
  }

  const channelId = localStorage.getItem(DEV_CHANNEL_KEY)

  if (!channelId) {
    return null
  }

  return { token, channelId, backend: getDevBackendOrigin() }
}

/**
 * Boot-time entry point (called from `useTwitchAuth` before deferring to the
 * Twitch host). Seeds a session from the URL fragment if present, then, if a
 * session exists, switches Apollo to the real backend and opens the websocket.
 *
 * @returns {{token: string, channelId: string, backend: string|null}|null}
 */
export function loadLocalDevSession() {
  if (!isLocalDevEnabled()) {
    return null
  }

  const params = parseHashParams()
  const hashToken = (params.get(DEV_TOKEN_KEY) || '').trim()
  const hashChannel = (params.get(DEV_CHANNEL_KEY) || '').trim()
  const hashBackend = (params.get(DEV_BACKEND_KEY) || '').trim()

  // Clear the fragment whenever any dev-session param carries a value (so a
  // lone token can't linger in the address bar), but only persist a session
  // when both token and channel are present.
  if (hashToken || hashChannel || hashBackend) {
    if (hashToken && hashChannel) {
      localStorage.setItem(DEV_TOKEN_KEY, hashToken)
      localStorage.setItem(DEV_CHANNEL_KEY, hashChannel)

      // A stale backend from a previous session must not outlive the session
      // that owned it, so an absent param clears the override.
      if (hashBackend) {
        localStorage.setItem(DEV_BACKEND_KEY, hashBackend)
      } else {
        localStorage.removeItem(DEV_BACKEND_KEY)
      }
    }

    stripHash()
  }

  const session = getLocalDevSession()

  if (session) {
    // Bypass the mock harness and talk to the real backend, then make sure the
    // socket exists and is connected before the caption subscription runs.
    updateMockConfig({ useRealServer: true })
    initializePhoenixSocket()
    connectPhoenixSocket()
  }

  return session
}

/**
 * Whether a (non-expired) socket token has already been seeded via an admin
 * link. Switching channels in the dev dialog only works once a token exists.
 * @returns {boolean}
 */
export function hasLocalDevToken() {
  return Boolean(getDevToken())
}

/**
 * Point the local build at a different live channel (reusing the stored token).
 * No-op outside development, and ignores empty/whitespace input.
 * @param {string} channelId
 */
export function setLocalDevChannel(channelId) {
  if (!isLocalDevEnabled()) {
    return
  }

  const trimmed = (channelId || '').trim()

  if (trimmed) {
    localStorage.setItem(DEV_CHANNEL_KEY, trimmed)
  }
}

/**
 * Tear down the dev session and return to the mock harness. No-op outside
 * development; only the dev session's own `scc_dev_*` keys are removed, so the
 * primary auth token is never touched. Also closes the websocket so live
 * captions stop flowing even if the caller doesn't immediately reload.
 */
export function clearLocalDevSession() {
  if (!isLocalDevEnabled()) {
    return
  }

  clearDevSessionStorage()
  updateMockConfig({ useRealServer: false })
  disconnectPhoenixSocket()
}
