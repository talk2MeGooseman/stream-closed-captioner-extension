/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid'
import { TEXT_SIZES } from '@/utils/Constants'

const initialState = {
  viewerLanguage: 'default',
  broadcasterLanguage: 'en-US',
  ccKey: uuid(),
  isDragged: false,
  size: TEXT_SIZES.MEDIUM,
  hideCC: false,
  ccBoxSize: false,
  isBitsEnabled: false,
  isDrawerOpen: false,
  horizontalLineCount: 3,
  boxLineCount: 7,
  switchSettingsPosition: false,
  grayOutFinalText: false,
  uppercaseText: false,
  dyslexiaFontEnabled: false,
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
    toggleGrayOutFinalText(state) {
      state.grayOutFinalText = !state.grayOutFinalText
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
    toggleUppercaseText(state) {
      state.uppercaseText = !state.uppercaseText
    },
    increaseLineCount(state) {
      if (state.ccBoxSize) {
        state.boxLineCount += 1
      }

      state.horizontalLineCount += 1
    },
    toggleDyslexiaFamily(state) {
      state.dyslexiaFontEnabled = !state.dyslexiaFontEnabled
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
  toggleGrayOutFinalText,
  toggleUppercaseText,
  toggleDyslexiaFamily,
} = settingsSlice.actions

export default settingsSlice.reducer
