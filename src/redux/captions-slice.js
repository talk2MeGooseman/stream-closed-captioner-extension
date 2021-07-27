import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid'

import { apolloClient, phxSocket } from '../utils'

import { subscriptionNewCaptions } from './utils'
import { hlsLatencyBroadcasterSelector } from './selectors'

import { TEXT_QUEUE_SIZE } from '@/utils/Constants'

const initialState = {
  finalTextQueue: [],
  interimText: '',
  translations: {},
  captionsSubscription: null,
}

const captionsSlice = createSlice({
  initialState,
  name: 'captionsSlice',
  reducers: {
    setCaptionsSubscription: (state, { payload: { subscription } }) => {
      state.captionsSubscription = subscription
    },
    stopCaptionsSubscription: (state, _) => {
      if (phxSocket.isConnected()) {
        phxSocket.disconnect()
        state.finalTextQueue = []
        state.translations = {}
      }
    },
    // eslint-disable-next-line complexity
    updateCCText(state, action) {
      const newTranslations = state.translations
      const qLength = state.finalTextQueue.length

      state.interimText = action.payload.interim

      const lastText = state.finalTextQueue[qLength - 1] || {}

      if (lastText.text !== action.payload.final) {
        state.finalTextQueue.push({ id: uuid(), text: action.payload.final })

        if (state.finalTextQueue.length > TEXT_QUEUE_SIZE) {
          state.finalTextQueue.shift()
        }
      }

      if (action.payload.translations) {
        const translatedLanguages = Object.keys(action.payload.translations)

        // eslint-disable-next-line complexity
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
  },
})

export function subscribeToCaptions(channelId) {
  return function thunk(dispatch, getState) {
    phxSocket.connect()
    return apolloClient
      .subscribe({
        variables: { channelId },
        query: subscriptionNewCaptions,
      })
      .subscribe({
        next({ data: { newTwitchCaption } }) {
          const hlsLatencyBroadcaster = hlsLatencyBroadcasterSelector(
            getState(),
          )

          let delayTimeMilliseconds = hlsLatencyBroadcaster * 1000

          setTimeout(() => {
            dispatch(updateCCText(newTwitchCaption))
          }, delayTimeMilliseconds)
        },
      })
  }
}

export const {
  updateCCText,
  setCaptionsSubscription,
  stopCaptionsSubscription,
} = captionsSlice.actions

export default captionsSlice.reducer
