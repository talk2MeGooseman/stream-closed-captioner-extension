/* eslint-disable no-param-reassign */
/* eslint-disable no-case-declarations */
import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid'

import { TEXT_QUEUE_SIZE } from '@/utils/Constants'

const initialState = {
  finalTextQueue: [],
  interimText: '',
  translations: {},
}

const captionsSlice = createSlice({
  name: 'captionsSlice',
  initialState,
  reducers: {
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

        translatedLanguages.forEach((language) => {
          const currentLangTranslation = state.translations[language] || { textQueue: [] }
          const newTranslation = action.payload.translations[language]

          const lastTranslationIndex = currentLangTranslation.textQueue.length - 1
          const lastTranslationText = currentLangTranslation.textQueue[lastTranslationIndex] || {}

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

export const { updateCCText } = captionsSlice.actions

export default captionsSlice.reducer
