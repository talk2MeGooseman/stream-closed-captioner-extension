/* eslint-disable no-param-reassign */
/* eslint-disable no-case-declarations */
import { createSlice } from '@reduxjs/toolkit';
import uuid from 'uuid/v4';

const initialState = {
  finalTextQueue: [],
  interimText: '',
  translations: {},
};

const captionsSlice = createSlice({
  name: 'captionsSlice',
  initialState,
  reducers: {
    updateCCText(state, action) {
      const newTranslations = state.translations;
      const qLength = state.finalTextQueue.length;

      state.interimText = action.payload.interim;

      const lastText = state.finalTextQueue[qLength - 1] || {};
      if (lastText.text !== action.payload.final) {
        state.finalTextQueue = [
          ...state.finalTextQueue,
          { id: uuid(), text: action.payload.final },
        ];

        if (state.finalTextQueue.length > 20) {
          state.finalTextQueue = state.finalTextQueue.shift();
        }
      }

      if (action.payload.translations) {
        const langs = Object.keys(action.payload.translations);
        langs.forEach((l) => {
          const currentLangTranslation = state.translations[l] || { textQueue: [] };
          const newTranslation = action.payload.translations[l];

          const lastTranslationIndex = currentLangTranslation.textQueue.length - 1;
          const lastTranslationText = currentLangTranslation.textQueue[lastTranslationIndex] || {};

          if (lastTranslationText.text !== newTranslation.text) {
            const newTextQueue = [
              ...currentLangTranslation.textQueue,
              { id: uuid(), text: newTranslation.text },
            ];
            if (newTextQueue.length > 20) {
              newTextQueue.shift();
            }

            newTranslations[l] = {
              name: newTranslation.name,
              textQueue: newTextQueue,
            };
          }
        });

        state.translations = newTranslations;
      }
    },
  },
});

export const { updateCCText } = captionsSlice.actions;

export default captionsSlice.reducer;
