/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import uuid from 'uuid/v4'

const initialState = {
  viewerLanguage: 'default',
  broadcasterLanguage: 'en-US',
  ccKey: uuid(),
  isDragged: false,
  size: 'medium',
  hideCC: false,
  ccBoxSize: false,
  isBitsEnabled: false,
  isDrawerOpen: false,
  horizontalLineCount: 3,
  boxLineCount: 7,
  switchSettingsPosition: false,
}

const settingsSlice = createSlice({
  name: 'settingsSlice',
  initialState,
  reducers: {
    updateBroadcasterSettings(state, action) {
      const settings = action.payload
      Object.keys(settings).forEach((key) => {
        state[key] = settings[key]
      })
    },
    changeTextSize(state, action) {
      state.size = action.payload
    },
    changeLanguage(state, action) {
      state.viewerLanguage = action.payload
    },
    toggleVisibility(state) {
      state.hideCC = !state.hideCC
    },
    toggleBoxSize(state) {
      state.ccBoxSize = !state.ccBoxSize
    },
    setIsDragged(state) {
      state.isDragged = true
    },
    resetCCText(state) {
      state.ccKey = uuid()
    },
    toggleActivationDrawer(state) {
      state.isDrawerOpen = !state.isDrawerOpen
    },
    increaseLineCount(state) {
      if (state.ccBoxSize) {
        state.boxLineCount += 1
      }

      state.horizontalLineCount += 1
    },
    decreaseLineCount(state) {
      if (state.ccBoxSize && state.boxLineCount !== 1) {
        state.boxLineCount -= 1
      }

      if (state.horizontalLineCount !== 1) {
        state.horizontalLineCount -= 1
      }
    },
  },
})

export const {
  updateBroadcasterSettings,
  changeTextSize,
  changeLanguage,
  toggleActivationDrawer,
  toggleBoxSize,
  toggleVisibility,
  setIsDragged,
  resetCCText,
  increaseLineCount,
  decreaseLineCount,
} = settingsSlice.actions

export default settingsSlice.reducer
