import React, { useCallback } from 'react'
import Draggable from 'react-draggable'
import { useDispatch } from 'react-redux'

import {
  Captions,
  CaptionsContainer,
  CaptionText
} from '../shared/caption-styles'

import './ClosedCaption.css'
import { getFontSizeStyle } from './helpers'

import { useShallowEqualSelector } from '@/redux/redux-helpers'

import { setIsDragged } from '@/redux/settings-slice'

import { FONT_FAMILIES } from '@/utils/Constants'

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

// eslint-disable-next-line complexity
function ClosedCaption() {
  const dispatch = useDispatch()
  const configSettings = useShallowEqualSelector(
    (state) => state.configSettings,
  )
  const { interimText, finalTextQueue, translations } = useShallowEqualSelector(
    (state) => state.captionsState,
  )
  const onDragged = useCallback(() => dispatch(setIsDragged()), [dispatch])
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
    <Draggable bounds="parent" grid={[8, 8]} onStop={onDragged}>
      <CaptionsContainer
        boxSize={configSettings.ccBoxSize}
        captionsTransparency={configSettings.captionsTransparency}
        captionsWidth={configSettings.captionsWidth}
        fontSize={fontSize}
        isHidden={isHidden}
        numberOfLines={numberOfLines}
      >
        <Captions
          fontFamily={fontFamily}
          fontSize={fontSize}
          uppercase={configSettings.textUppercase}
        >
          <CaptionText grayOutText={configSettings.grayOutFinalText}>
            {finalTextCaptions}
          </CaptionText>
          {configSettings.viewerLanguage === 'default' && (
            <CaptionText interim>{interimText}</CaptionText>
          )}
        </Captions>
      </CaptionsContainer>
    </Draggable>
  )
}

export default ClosedCaption
