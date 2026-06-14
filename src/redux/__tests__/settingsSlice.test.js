import settings, {
  changeCaptionsTransparency,
  changeCaptionsWidth,
  changeLanguage,
  changeTextSize,
  changeColor,
  decreaseLineCount,
  increaseLineCount,
  resetCCText,
  setIsDragged,
  toggleActivationDrawer,
  toggleAdvancedSettingsDialog,
  toggleBoxSize,
  toggleDyslexiaFamily,
  toggleGrayOutFinalText,
  toggleRollUpCaptions,
  toggleUppercaseText,
  toggleVisibility,
  updateBroadcasterSettings,
  initialState,
} from '../settings-slice'

import {
  CAPTIONS_SIZE,
  CAPTIONS_TRANSPARENCY,
  TEXT_SIZES,
} from '@/utils/Constants'

describe('settingsSlice', () => {
  test('should handle initial state', () => {
    expect(settings(undefined, {})).toStrictEqual(initialState)
  })

  describe('changeCaptionsTransparency', () => {
    test('sets the transparency', () => {
      const state = settings(initialState, changeCaptionsTransparency(50))

      expect(state.captionsTransparency).toBe(50)
    })

    test('clamps values below the minimum', () => {
      const state = settings(initialState, changeCaptionsTransparency(-10))

      expect(state.captionsTransparency).toBe(CAPTIONS_TRANSPARENCY.min)
    })

    test('clamps values above the maximum', () => {
      const state = settings(initialState, changeCaptionsTransparency(150))

      expect(state.captionsTransparency).toBe(CAPTIONS_TRANSPARENCY.max)
    })
  })

  describe('changeCaptionsWidth', () => {
    test('sets the width', () => {
      const state = settings(initialState, changeCaptionsWidth(50))

      expect(state.captionsWidth).toBe(50)
    })

    test('clamps values below the minimum width', () => {
      const state = settings(initialState, changeCaptionsWidth(1))

      expect(state.captionsWidth).toBe(CAPTIONS_SIZE.minWidth)
    })

    test('clamps values above the maximum width', () => {
      const state = settings(initialState, changeCaptionsWidth(99))

      expect(state.captionsWidth).toBe(CAPTIONS_SIZE.maxWidth)
    })
  })

  test('changeLanguage sets the viewer language', () => {
    const state = settings(initialState, changeLanguage('es'))

    expect(state.viewerLanguage).toBe('es')
  })

  test('changeTextSize sets the size', () => {
    const state = settings(initialState, changeTextSize(TEXT_SIZES.LARGE))

    expect(state.size).toBe(TEXT_SIZES.LARGE)
  })

  test('changeColor sets the color', () => {
    const state = settings(initialState, changeColor('#ff0000'))

    expect(state.color).toBe('#ff0000')
  })

  describe('line count', () => {
    test('increaseLineCount increments horizontal lines by default', () => {
      const state = settings(initialState, increaseLineCount())

      expect(state.horizontalLineCount).toBe(
        initialState.horizontalLineCount + 1,
      )
      expect(state.boxLineCount).toBe(initialState.boxLineCount)
    })

    test('increaseLineCount increments box lines in box mode', () => {
      const boxState = { ...initialState, ccBoxSize: true }
      const state = settings(boxState, increaseLineCount())

      expect(state.boxLineCount).toBe(initialState.boxLineCount + 1)
      expect(state.horizontalLineCount).toBe(initialState.horizontalLineCount)
    })

    test('decreaseLineCount decrements horizontal lines by default', () => {
      const state = settings(initialState, decreaseLineCount())

      expect(state.horizontalLineCount).toBe(
        initialState.horizontalLineCount - 1,
      )
    })

    test('decreaseLineCount does not go below one horizontal line', () => {
      const oneLineState = { ...initialState, horizontalLineCount: 1 }
      const state = settings(oneLineState, decreaseLineCount())

      expect(state.horizontalLineCount).toBe(1)
    })

    test('decreaseLineCount decrements box lines in box mode', () => {
      const boxState = { ...initialState, ccBoxSize: true }
      const state = settings(boxState, decreaseLineCount())

      expect(state.boxLineCount).toBe(initialState.boxLineCount - 1)
    })

    test('decreaseLineCount does not go below one box line', () => {
      const boxState = { ...initialState, ccBoxSize: true, boxLineCount: 1 }
      const state = settings(boxState, decreaseLineCount())

      expect(state.boxLineCount).toBe(1)
    })
  })

  test('resetCCText generates a new caption key', () => {
    const state = settings(initialState, resetCCText())

    expect(state.ccKey).toBeTruthy()
    expect(state.ccKey).not.toBe(initialState.ccKey)
  })

  test('setIsDragged marks the captions as dragged', () => {
    const state = settings(initialState, setIsDragged())

    expect(state.isDragged).toBe(true)
  })

  describe('toggles', () => {
    test('toggleActivationDrawer flips the drawer state', () => {
      let state = settings(initialState, toggleActivationDrawer())
      expect(state.isDrawerOpen).toBe(true)

      state = settings(state, toggleActivationDrawer())
      expect(state.isDrawerOpen).toBe(false)
    })

    test('toggleAdvancedSettingsDialog flips the dialog state', () => {
      const state = settings(initialState, toggleAdvancedSettingsDialog())

      expect(state.displayAdvancedSettingsDialog).toBe(true)
    })

    test('toggleDyslexiaFamily flips the dyslexia font flag', () => {
      const state = settings(initialState, toggleDyslexiaFamily())

      expect(state.dyslexiaFontEnabled).toBe(true)
    })

    test('toggleGrayOutFinalText flips the gray-out flag', () => {
      const state = settings(initialState, toggleGrayOutFinalText())

      expect(state.grayOutFinalText).toBe(true)
    })

    test('toggleRollUpCaptions flips the roll-up layout flag', () => {
      expect(initialState.rollUpCaptions).toBe(true)

      const state = settings(initialState, toggleRollUpCaptions())

      expect(state.rollUpCaptions).toBe(false)
    })

    test('toggleUppercaseText flips the uppercase flag', () => {
      const state = settings(initialState, toggleUppercaseText())

      expect(state.textUppercase).toBe(true)
    })

    test('toggleVisibility flips the hidden flag', () => {
      const state = settings(initialState, toggleVisibility())

      expect(state.hideCC).toBe(false)
    })
  })

  describe('toggleBoxSize', () => {
    test('switching to box mode applies the default box width', () => {
      const state = settings(initialState, toggleBoxSize())

      expect(state.ccBoxSize).toBe(true)
      expect(state.captionsWidth).toBe(CAPTIONS_SIZE.defaultBoxWidth)
    })

    test('switching back to horizontal mode restores the default width', () => {
      const boxState = settings(initialState, toggleBoxSize())
      const state = settings(boxState, toggleBoxSize())

      expect(state.ccBoxSize).toBe(false)
      expect(state.captionsWidth).toBe(CAPTIONS_SIZE.defaultHorizontalWidth)
    })
  })

  describe('updateBroadcasterSettings', () => {
    test('width is properly set when broadcaster chooses box size', () => {
      expect(
        settings(
          {},
          {
            payload: {
              ccBoxSize: true,
            },
            type: updateBroadcasterSettings.type,
          },
        ),
      ).toStrictEqual({
        captionsWidth: CAPTIONS_SIZE.defaultBoxWidth,
        ccBoxSize: true,
      })
    })

    test('width falls back to horizontal default without box size', () => {
      const state = settings(
        initialState,
        updateBroadcasterSettings({ color: '#00ff00', ccBoxSize: false }),
      )

      expect(state.color).toBe('#00ff00')
      expect(state.captionsWidth).toBe(CAPTIONS_SIZE.defaultHorizontalWidth)
    })

    test('copies every provided setting onto the state', () => {
      const state = settings(
        initialState,
        updateBroadcasterSettings({
          dyslexiaFontEnabled: true,
          textUppercase: true,
          size: TEXT_SIZES.LARGE,
        }),
      )

      expect(state.dyslexiaFontEnabled).toBe(true)
      expect(state.textUppercase).toBe(true)
      expect(state.size).toBe(TEXT_SIZES.LARGE)
    })
  })
})
