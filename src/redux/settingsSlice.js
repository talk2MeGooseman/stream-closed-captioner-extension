/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import uuid from 'uuid/v4';

const initialState = {
  selectedLanguage: 'default',
  finishedLoading: false,
  ccKey: uuid(),
  isDragged: false,
  size: 'medium',
  hideCC: false,
  ccBoxSize: false,
  isBitsEnabled: false,
  isDrawerOpen: false,
  fetchingStatus: false,
  activationInfo: null,
  horizontalLineCount: 3,
  boxLineCount: 7,
};

const settingsSlice = createSlice({
  name: 'settingsSlice',
  initialState,
  reducers: {
    updateBroadcasterSettings(state, action) {
      const settings = action.payload;
      Object.keys(settings).forEach((key) => {
        state[key] = settings[key];
      });
    },
    changeTextSize(state, action) {
      state.size = action.payload;
    },
    changeLanguage(state, action) {
      state.language = action.payload;
    },
    toggleVisibility(state) {
      state.hideCC = !state.hideCC;
    },
    toggleBoxSize(state) {
      state.ccBoxSize = !state.ccBoxSize;
    },
    setIsDragged(state) {
      state.isDragged = true;
    },
    resetCCText(state) {
      state.ccKey = uuid();
    },
    toggleActivationDrawer(state) {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    requestingTranslationStatus(state) {
      state.fetchingStatus = true;
    },
    doneRequestingTranslationStatus(state, action) {
      state.fetchingStatus = false;
      state.activationInfo = action.payload;
    },
    increaseLineCount(state) {
      if (state.ccBoxSize) {
        state.boxLineCount += 1;
      }

      state.horizontalLineCount += 1;
    },
    decreaseLineCount(state) {
      if (state.ccBoxSize && state.boxLineCount !== 1) {
        state.boxLineCount -= 1;
      }

      if (state.horizontalLineCount !== 1) {
        state.horizontalLineCount -= 1;
      }
    },
  },
});

export const {
  updateBroadcasterSettings,
  changeTextSize,
  changeLanguage,
  toggleActivationDrawer,
  toggleBoxSize,
  toggleVisibility,
  setIsDragged,
  resetCCText,
  requestingTranslationStatus,
  doneRequestingTranslationStatus,
  increaseLineCount,
  decreaseLineCount,
} = settingsSlice.actions;

export default settingsSlice.reducer;

export function requestTranslationStatus() {
  return function thunk(dispatch, getState) {
    dispatch(requestingTranslationStatus());

    const { channelId } = getState().productsCatalog;
    return fetch(`https://stream-cc.gooseman.codes/api/translation_status/${channelId}`, {
      cache: 'no-cache',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(doneRequestingTranslationStatus(data));
      });
  };
}
