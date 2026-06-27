import { useCallback, memo } from 'react'
import Draggable from 'react-draggable'
import { useDispatch } from 'react-redux'

import { Captions, CaptionsContainer } from '../shared/caption-styles'

import './ClosedCaption.css'
import CaptionBody from './CaptionBody'
import {
  assembleCaptionLines,
  getFontSizeStyle,
  isCaptionsHidden,
  joinCaptionLines,
} from './helpers'

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

function ClosedCaption() {
  const dispatch = useDispatch()
  const configSettings = useShallowEqualSelector(
    (state) => state.configSettings,
  )
  const { interimText, finalTextQueue, translations } = useShallowEqualSelector(
    (state) => state.captionsState,
  )
  const onDragged = useCallback(() => dispatch(setIsDragged()), [dispatch])
  const fontSize = getFontSizeStyle(configSettings.size)
  const fontFamily = configSettings.dyslexiaFontEnabled
    ? FONT_FAMILIES.DYSLEXIA
    : FONT_FAMILIES.ROBOTO

  let numberOfLines = configSettings.horizontalLineCount

  if (configSettings.ccBoxSize) {
    numberOfLines = configSettings.boxLineCount
  }

  // Roll-up layout renders each recognized segment on its own line so sentence
  // boundaries are visually explicit; the paragraph form is derived from the
  // same normalized lines so the queue is normalized only once.
  const captionLines = assembleCaptionLines(
    configSettings.viewerLanguage,
    finalTextQueue,
    translations,
  )
  const finalTextCaptions = joinCaptionLines(captionLines)
  // Roll-up (line-per-sentence) is the default; viewers can opt back into the
  // single flowing paragraph via the display settings menu.
  const rollUpCaptions = configSettings.rollUpCaptions ?? true
  // Interim text only renders for the default language, so resolve it to '' in
  // any other mode; this is the single source of truth for whether interim
  // shows and for keeping the box visible.
  const interimVisible =
    configSettings.viewerLanguage === 'default' ? interimText || '' : ''
  const isHidden = isCaptionsHidden(
    configSettings.hideCC,
    finalTextCaptions,
    interimVisible,
  )

  return (
    <Draggable bounds="parent" grid={[8, 8]} onStop={onDragged}>
      <CaptionsContainer
        $boxSize={configSettings.ccBoxSize}
        $captionsTransparency={configSettings.captionsTransparency}
        $captionsWidth={configSettings.captionsWidth}
        $fontSize={fontSize}
        $isHidden={isHidden}
        $numberOfLines={numberOfLines}
      >
        <Captions
          $fontFamily={fontFamily}
          $fontSize={fontSize}
          $uppercase={configSettings.textUppercase}
          $color={configSettings.color}
        >
          <CaptionBody
            rollUpCaptions={rollUpCaptions}
            captionLines={captionLines}
            captionText={finalTextCaptions}
            grayOutFinalText={configSettings.grayOutFinalText}
            interimText={interimVisible}
          />
        </Captions>
      </CaptionsContainer>
    </Draggable>
  )
}

// Memoize ClosedCaption component to prevent unnecessary re-renders
// Only re-renders when Redux state actually changes (via useShallowEqualSelector)
export default memo(ClosedCaption)
