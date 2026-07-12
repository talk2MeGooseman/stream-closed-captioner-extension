import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid'

import {
  apolloClient,
  connectPhoenixSocket,
  isPhoenixSocketConnected,
  disconnectPhoenixSocket,
} from '../utils'

import {
  subscriptionNewCaptions,
  subscriptionNewCostreamCaptions,
} from './utils'
import { hlsLatencyBroadcasterSelector } from './selectors'

import { TEXT_QUEUE_SIZE } from '@/utils/Constants'

const initialState = {
  // Chronological feed of final caption segments. Broadcaster entries are
  // { id, text }; co-streamer guest entries additionally carry
  // { guestId, name } so views can prefix/filter them.
  finalTextQueue: [],
  interimText: '',
  // Live interim text per connected guest: guestId -> { name, text }
  costreamInterim: {},
  translations: {},
  captionsSubscription: null,
}

// Dedupe finals per speaker: the broadcaster's repeat-suppression must not be
// defeated by a guest line landing in between (and vice versa).
function lastEntryFor(queue, guestId) {
  for (let i = queue.length - 1; i >= 0; i--) {
    const entry = queue[i]
    if ((entry.guestId || null) === (guestId || null)) return entry
  }
  return {}
}

const captionsSlice = createSlice({
  initialState,
  name: 'captionsSlice',
  reducers: {
    setCaptionsSubscription: (state, { payload: { subscription } }) => {
      state.captionsSubscription = subscription
    },
    stopCaptionsSubscription: (state, _) => {
      if (isPhoenixSocketConnected()) {
        disconnectPhoenixSocket()
        state.finalTextQueue = []
        state.interimText = ''
        state.costreamInterim = {}
        state.translations = {}
      }
    },

    updateCCText(state, action) {
      const newTranslations = state.translations

      state.interimText = action.payload.interim

      const lastText = lastEntryFor(state.finalTextQueue, null)

      if (lastText.text !== action.payload.final) {
        state.finalTextQueue.push({ id: uuid(), text: action.payload.final })

        if (state.finalTextQueue.length > TEXT_QUEUE_SIZE) {
          state.finalTextQueue.shift()
        }
      }

      if (action.payload.translations) {
        const translatedLanguages = Object.keys(action.payload.translations)

        translatedLanguages.forEach((language) => {
          const currentLangTranslation = state.translations[language] || {
            textQueue: [],
          }
          const newTranslation = action.payload.translations[language]

          const lastTranslationIndex =
            currentLangTranslation.textQueue.length - 1
          const lastTranslationText =
            currentLangTranslation.textQueue[lastTranslationIndex] || {}

          if (lastTranslationText.text !== newTranslation.text) {
            const newTextQueue = [
              ...currentLangTranslation.textQueue,
              { id: uuid(), text: newTranslation.text },
            ]

            if (newTextQueue.length > TEXT_QUEUE_SIZE) {
              newTextQueue.shift()
            }

            newTranslations[language] = {
              name: newTranslation.name,
              textQueue: newTextQueue,
            }
          }
        })

        state.translations = newTranslations
      }
    },

    // Guest (co-streamer) captions: no translations, no pirate mode — just
    // interim + final text attributed to a guest. Finals land in the shared
    // finalTextQueue so broadcaster and guest lines interleave chronologically.
    updateCostreamText(state, action) {
      const { guestId, name, interim, final } = action.payload

      if (interim) {
        state.costreamInterim[guestId] = { name, text: interim }
      } else {
        delete state.costreamInterim[guestId]
      }

      if (final) {
        const lastText = lastEntryFor(state.finalTextQueue, guestId)

        if (lastText.text !== final) {
          state.finalTextQueue.push({ id: uuid(), guestId, name, text: final })

          if (state.finalTextQueue.length > TEXT_QUEUE_SIZE) {
            state.finalTextQueue.shift()
          }
        }
      }
    },
  },
})

export function subscribeToCaptions(channelId) {
  return function thunk(dispatch, getState) {
    // Connect Phoenix socket (safe no-op if socket doesn't exist in dev mode)
    connectPhoenixSocket()

    return apolloClient
      .subscribe({
        variables: { channelId },
        query: subscriptionNewCaptions,
      })
      .subscribe({
        next({ data: { newTwitchCaption } }) {
          const hlsLatencyBroadcaster =
            hlsLatencyBroadcasterSelector(getState())

          let delayTimeMilliseconds = hlsLatencyBroadcaster * 1000

          setTimeout(() => {
            dispatch(updateCCText(newTwitchCaption))
          }, delayTimeMilliseconds)
        },
      })
  }
}

// Mirrors subscribeToCaptions, including the broadcaster-latency delay so
// guest lines stay roughly in sync with the video like broadcaster lines do.
export function subscribeToCostreamCaptions(channelId) {
  return function thunk(dispatch, getState) {
    connectPhoenixSocket()

    return apolloClient
      .subscribe({
        variables: { channelId },
        query: subscriptionNewCostreamCaptions,
      })
      .subscribe({
        next({ data: { newCostreamCaption } }) {
          const hlsLatencyBroadcaster =
            hlsLatencyBroadcasterSelector(getState())

          let delayTimeMilliseconds = hlsLatencyBroadcaster * 1000

          setTimeout(() => {
            dispatch(updateCostreamText(newCostreamCaption))
          }, delayTimeMilliseconds)
        },
      })
  }
}

export const {
  updateCCText,
  updateCostreamText,
  setCaptionsSubscription,
  stopCaptionsSubscription,
} = captionsSlice.actions

export default captionsSlice.reducer
