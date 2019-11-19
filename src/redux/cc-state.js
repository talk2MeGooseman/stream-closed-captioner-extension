/* eslint-disable no-case-declarations */
import uuid from 'uuid/v4';

export const UPDATE_CC_TEXT = 'UPDATE_CC_TEXT';

export function actionUpdateCCText(state) {
  return { type: UPDATE_CC_TEXT, ...state };
}

const initialState = {
  finalTextQueue: [],
  interimText: '',
  translations: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case UPDATE_CC_TEXT:
    let newQueue = state.finalTextQueue;
    const newTranslations = state.translations;
    const qLength = state.finalTextQueue.length;
    const lastText = state.finalTextQueue[qLength - 1] || {};

    if (lastText.text !== action.final) {
      newQueue = [...state.finalTextQueue, { id: uuid(), text: action.final }];

      if (newQueue.length > 20) {
        newQueue.shift();
      }
    }

    if (action.translations) {
      const langs = Object.keys(action.translations);
      langs.forEach((l) => {
        const currentLangTranslation = state.translations[l] || { textQueue: [] };
        const newTranslation = action.translations[l];

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
    }

    return {
      ...state,
      finalTextQueue: newQueue,
      interimText: action.interim,
      translations: newTranslations,
    };

  default:
    return state;
  }
}
