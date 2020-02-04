import React from 'react'
import Draggable from 'react-draggable'
import { VideoCaptionsContainer, Captions, CaptionText } from './captions.styled'
import './ClosedCaption.css'
import { setIsDragged } from '@/redux/settingsSlice'
import { FONT_FAMILIES } from '@/utils/Constants'
import { getFontSizeStyle } from './helpers'
import { useShallowEqualSelector, useReduxCallbackDispatch } from '@/redux/redux-helpers'

// Bits 100 from electrichavoc
// Resub Nyixxs
// Resub Nataliexo93
// Resub lurking_kat
// Bits  302 corbob
// Bits 11 taylorishere
// Bits 301 adam13531
// Bits 200 rhyolight
// Bits 400 booperinos
// Bits 1 ninjabunny9000
// Sub DannyKampsGamez

function isEmptyCC(text) {
  return text.length === 0
}

function shouldHideCC(shouldHide, interimText, finalText) {
  return shouldHide || isEmptyCC(interimText + finalText)
}

function ClosedCaption() {
  const onDrag = useReduxCallbackDispatch(setIsDragged())
  const configSettings = useShallowEqualSelector((state) => state.configSettings)
  const { interimText, finalTextQueue, translations } = useShallowEqualSelector(
    (state) => state.captionsState,
  )

  const finalText = finalTextQueue.join(' ')
  const fontSize = getFontSizeStyle(configSettings.size)
  const isHidden = shouldHideCC(configSettings.hideCC, interimText, finalText)
  const fontFamily = configSettings.dyslexiaFontEnabled
    ? FONT_FAMILIES.DYSLEXIA
    : FONT_FAMILIES.ROBOTO

  let numberOfLines = configSettings.horizontalLineCount
  if (configSettings.ccBoxSize) {
    numberOfLines = configSettings.boxLineCount
  }

  let finalTextCaptions = ''

  if (configSettings.viewerLanguage === 'default') {
    finalTextCaptions = finalTextQueue.map(({ text }) => text).join(' ')
  } else {
    finalTextCaptions = translations[configSettings.viewerLanguage].textQueue
      .map(({ text }) => text)
      .join(' ')
  }

  return (
    <Draggable grid={[8, 8]} bounds="parent" onStop={onDrag}>
      <VideoCaptionsContainer
        fontSize={fontSize}
        numberOfLines={numberOfLines}
        isHidden={isHidden}
        boxSize={configSettings.ccBoxSize}
      >
        <Captions
          fontFamily={fontFamily}
          fontSize={fontSize}
          uppercase={configSettings.uppercaseText}
        >
          <CaptionText grayOutText={configSettings.grayOutFinalText}>
            {finalTextCaptions}
          </CaptionText>
          {configSettings.viewerLanguage === 'default' && (
            <CaptionText interim>{interimText}</CaptionText>
          )}
        </Captions>
      </VideoCaptionsContainer>
    </Draggable>
  )
}

export default ClosedCaption
