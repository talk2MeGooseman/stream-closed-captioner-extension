/**
 * Storage keys and low-level accessors for the dev-only local testing session.
 *
 * Deliberately kept free of app imports (only the pure JWT decoder): both
 * `apollo.js` (socket/auth plumbing) and `localDevSession.js` (session
 * lifecycle) need these, and putting them anywhere else would create a module
 * cycle.
 *
 * The dev session owns its own `scc_dev_*` localStorage keys so it can never
 * be confused with — or delete — the primary auth token that
 * `Authentication.setToken` stores under `'token'`.
 */
import { decodeJwtPayload } from './Authentication'

export const DEV_TOKEN_KEY = 'scc_dev_token'
export const DEV_CHANNEL_KEY = 'scc_dev_channel'
export const DEV_BACKEND_KEY = 'scc_dev_backend'

const DEFAULT_BACKEND_ORIGIN = 'https://stream-cc.gooseman.codes'

/**
 * Whether local dev tooling is active. Read lazily (not a module constant) so
 * it reflects the current build mode and stays testable.
 * @returns {boolean}
 */
export function isLocalDevEnabled() {
  return import.meta.env.MODE === 'development'
}

/**
 * The seeded dev socket token, or null when absent, expired, or not in dev
 * mode. An expired token purges the whole stored session so the next boot
 * falls back to the mock harness instead of a dead real-server connection.
 * @returns {string|null}
 */
export function getDevToken() {
  if (!isLocalDevEnabled()) {
    return null
  }

  const token = localStorage.getItem(DEV_TOKEN_KEY)

  if (!token) {
    return null
  }

  if (isExpired(token)) {
    clearDevSessionStorage()
    return null
  }

  return token
}

/**
 * The backend origin the dev session was minted by (e.g. a staging deploy),
 * or null to use the production default.
 * @returns {string|null}
 */
export function getDevBackendOrigin() {
  if (!isLocalDevEnabled()) {
    return null
  }

  return localStorage.getItem(DEV_BACKEND_KEY)
}

/**
 * Websocket URL for the dev session's backend, or the production default.
 * @returns {string}
 */
export function getSocketUrl() {
  const origin = getDevBackendOrigin() || DEFAULT_BACKEND_ORIGIN
  return `${origin.replace(/^http/, 'ws')}/socket`
}

/**
 * GraphQL HTTP endpoint for the dev session's backend, or the production
 * default.
 * @returns {string}
 */
export function getGraphqlUrl() {
  const origin = getDevBackendOrigin() || DEFAULT_BACKEND_ORIGIN
  return `${origin}/api`
}

/** Remove every stored dev-session key (never touches the 'token' key). */
export function clearDevSessionStorage() {
  localStorage.removeItem(DEV_TOKEN_KEY)
  localStorage.removeItem(DEV_CHANNEL_KEY)
  localStorage.removeItem(DEV_BACKEND_KEY)
}

function isExpired(token) {
  try {
    const { exp } = decodeJwtPayload(token)
    return Boolean(exp) && exp * 1000 <= Date.now()
  } catch (_e) {
    // Unreadable tokens can't authenticate anyway — purge rather than boot
    // into a real-server session that silently shows no captions.
    return true
  }
}
