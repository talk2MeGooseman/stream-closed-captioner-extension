/**
 * Dev-only "local extension testing" session.
 *
 * Lets the maintainer run this front end locally (`yarn start`) and connect to
 * a real, currently-live broadcaster's captions in order to validate that
 * extension changes didn't break anything.
 *
 * The token + channel id are minted/listed by the admin-only "Local Extension
 * Testing" page on the backend (restricted to the owner account) and handed to
 * the local build through the URL fragment, e.g.:
 *
 *   http://localhost:8080/?anchor=video_overlay#scc_dev_token=<jwt>&scc_dev_channel=<uid>
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

const TOKEN_KEY = 'token'
const CHANNEL_KEY = 'scc_dev_channel'
const HASH_TOKEN_KEY = 'scc_dev_token'
const HASH_CHANNEL_KEY = 'scc_dev_channel'

/**
 * Whether local dev tooling is active. Read lazily (not a module constant) so
 * it reflects the current build mode and stays testable.
 * @returns {boolean}
 */
export function isLocalDevEnabled() {
  return import.meta.env.MODE === 'development'
}

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
 * @returns {{token: string, channelId: string}|null}
 */
export function getLocalDevSession() {
  if (!isLocalDevEnabled()) {
    return null
  }

  const token = localStorage.getItem(TOKEN_KEY)
  const channelId = localStorage.getItem(CHANNEL_KEY)

  if (token && channelId) {
    return { token, channelId }
  }

  return null
}

/**
 * Boot-time entry point (called from `useTwitchAuth` when there's no Twitch
 * host). Seeds a session from the URL fragment if present, then, if a session
 * exists, switches Apollo to the real backend and opens the websocket.
 *
 * @returns {{token: string, channelId: string}|null} active session, if any
 */
export function loadLocalDevSession() {
  if (!isLocalDevEnabled()) {
    return null
  }

  const params = parseHashParams()
  const hashToken = (params.get(HASH_TOKEN_KEY) || '').trim()
  const hashChannel = (params.get(HASH_CHANNEL_KEY) || '').trim()

  // Only persist (and clear the fragment) when both values are actually present
  // after trimming, so stray whitespace can't leave a broken session behind.
  if (hashToken && hashChannel) {
    localStorage.setItem(TOKEN_KEY, hashToken)
    localStorage.setItem(CHANNEL_KEY, hashChannel)
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
    localStorage.setItem(CHANNEL_KEY, trimmed)
  }
}

/**
 * Tear down the dev session and return to the mock harness. No-op outside
 * development so the primary auth token is never touched in production.
 * Also closes the websocket so live captions stop flowing even if the caller
 * doesn't immediately reload the page.
 */
export function clearLocalDevSession() {
  if (!isLocalDevEnabled()) {
    return
  }

  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(CHANNEL_KEY)
  updateMockConfig({ useRealServer: false })
  disconnectPhoenixSocket()
}
