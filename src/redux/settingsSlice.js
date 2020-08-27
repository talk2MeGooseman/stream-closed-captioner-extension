/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid'
import { TEXT_SIZES, CAPTIONS_SIZE } from '@/utils/Constants'

const initialState = {
  viewerLanguage: 'default',
  language: 'en-US',
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
  displayAdvancedSettingsDialog: false,
  captionsWidth: CAPTIONS_SIZE.defaultHorizontalWidth,
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
      if (state.ccBoxSize) {
        state.captionsWidth = CAPTIONS_SIZE.defaultBoxWidth
      } else {
        state.captionsWidth = CAPTIONS_SIZE.defaultHorizontalWidth
      }
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
    toggleAdvancedSettingsDialog(state) {
      state.displayAdvancedSettingsDialog = !state.displayAdvancedSettingsDialog
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
    changeCaptionsWidth(state, action) {
      let newWidth = action.payload
      if (newWidth < CAPTIONS_SIZE.minWidth) {
        newWidth = CAPTIONS_SIZE.minWidth
      } else if (newWidth > CAPTIONS_SIZE.maxWidth) {
        newWidth = CAPTIONS_SIZE.maxWidth
      }

      state.captionsWidth = newWidth
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
  toggleAdvancedSettingsDialog,
  changeCaptionsWidth,
} = settingsSlice.actions

export default settingsSlice.reducer
