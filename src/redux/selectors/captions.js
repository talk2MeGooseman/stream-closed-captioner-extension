import { isEmpty } from 'ramda'

export const hasCaptionsSelector = (state) =>
  !isEmpty(state.captionsState.finalTextQueue) ||
  !isEmpty(state.captionsState.interimText)

export const hasCaptionsTranslationsSelector = (state) =>
  !isEmpty(Object.keys(state.captionsState.translations || {}))

export const hlsLatencyBroadcasterSelector = (state) =>
  state?.videoPlayerContext?.hlsLatencyBroadcaster || 0
