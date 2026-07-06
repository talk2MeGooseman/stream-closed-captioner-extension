import 'url-search-params-polyfill'

export function isVideoOverlay() {
  const search = new URLSearchParams(window.location.search)
  const platform = search.get('platform')
  const anchor = search.get('anchor')

  return anchor === 'video_overlay' && platform === 'web'
}

export const DEV_VIDEO_PLAYER_BACKDROP_CLASS = 'dev-video-player-backdrop'

// Local-dev-only: marks the page so CSS can paint a dark, video-player-like
// backdrop behind the transparent overlay. On Twitch the real video sits
// behind the iframe, so this must never run in production. MODE is read at
// call time (the same pattern as isLocalDevEnabled) so tests can stub it;
// callers additionally guard with the statically-replaced import.meta.env.DEV
// so the backdrop stylesheet is dead code in production builds.
export function applyVideoPlayerBackdrop(body = document.body) {
  if (import.meta.env.MODE !== 'development' || !isVideoOverlay()) {
    return false
  }

  body.classList.add(DEV_VIDEO_PLAYER_BACKDROP_CLASS)
  return true
}
