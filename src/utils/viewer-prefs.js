const STORAGE_KEY = 'viewerPrefs'

/**
 * Viewer preferences persisted across page loads. Redux settings state is
 * otherwise in-memory only, which is fine for layout tweaks but not for the
 * co-streamer visibility choice — a viewer who hides guest captions expects
 * that to stick. localStorage can be unavailable inside the extension iframe
 * (sandbox/privacy modes), so every access is best-effort.
 */
export function loadViewerPrefs() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch (_error) {
    return {}
  }
}

export function saveViewerPref(key, value) {
  try {
    const prefs = loadViewerPrefs()
    prefs[key] = value
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch (_error) {
    // Persistence is a nice-to-have; the in-memory value still applies.
  }
}
