/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid'
import {
  TEXT_SIZES,
  CAPTIONS_SIZE,
  CAPTIONS_TRANSPARENCY,
} from '@/utils/Constants'

export const initialState = {
  boxLineCount: 7,
  captionsTransparency: CAPTIONS_TRANSPARENCY.default,
  captionsWidth: CAPTIONS_SIZE.defaultHorizontalWidth,
  ccBoxSize: false,
  ccKey: uuid(),
  displayAdvancedSettingsDialog: false,
  dyslexiaFontEnabled: false,
  grayOutFinalText: false,
  hideCC: false,
  horizontalLineCount: 3,
  isBitsEnabled: false,
  isDragged: false,
  isDrawerOpen: false,
  language: 'en-US',
  size: TEXT_SIZES.MEDIUM,
  switchSettingsPosition: false,
  uppercaseText: false,
  viewerLanguage: 'default',
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

      if (state.ccBoxSize) {
        state.captionsWidth = CAPTIONS_SIZE.defaultBoxWidth
      } else {
        state.captionsWidth = CAPTIONS_SIZE.defaultHorizontalWidth
      }
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
    changeCaptionsTransparency(state, action) {
      let value = action.payload
      if (value < CAPTIONS_TRANSPARENCY.min) {
        value = CAPTIONS_TRANSPARENCY.min
      } else if (value > CAPTIONS_TRANSPARENCY.max) {
        value = CAPTIONS_TRANSPARENCY.max
      }

      state.captionsTransparency = value
    },
  },
})

export const {
  changeCaptionsTransparency,
  changeCaptionsWidth,
  changeLanguage,
  changeTextSize,
  decreaseLineCount,
  increaseLineCount,
  resetCCText,
  setIsDragged,
  toggleActivationDrawer,
  toggleAdvancedSettingsDialog,
  toggleBoxSize,
  toggleDyslexiaFamily,
  toggleGrayOutFinalText,
  toggleUppercaseText,
  toggleVisibility,
  updateBroadcasterSettings,
} = settingsSlice.actions

export default settingsSlice.reducer
