import { Captions, CaptionsContainer } from '../shared/caption-styles'

import CaptionBody from './CaptionBody'
import {
  assembleCaptionLines,
  getMobileFontSizeStyle,
  joinCaptionLines,
} from './helpers'

import { useShallowEqualSelector } from '@/redux/redux-helpers'

import { FONT_FAMILIES } from '@/utils/Constants'
import { memo } from 'react'
// Bits - phrakberg
// Resub - phrakberg
// Donation -pikaia_xy
// Bits - DecoyDix
// Bits - ElectricHavoc
// Sub - jax05_
// Resub - roberttables
// Resub - rw_grim
// Bits - omcritzy
// Sub - el_psychic
// Resub - CreativeBuilds

function MobileClosedCaption() {
  const { interimText, finalTextQueue, translations } = useShallowEqualSelector(
    (state) => state.captionsState,
  )
  const configSettings = useShallowEqualSelector(
    (state) => state.configSettings,
  )

  const fontSize = getMobileFontSizeStyle(configSettings.size)
  const fontFamily = configSettings.dyslexiaFontEnabled
    ? FONT_FAMILIES.DYSLEXIA
    : FONT_FAMILIES.ROBOTO

  // Roll-up (line-per-sentence) is the default; viewers can opt back into the
  // single flowing paragraph via the display settings menu. The paragraph form
  // is derived from the same normalized lines so the queue is normalized once.
  const rollUpCaptions = configSettings.rollUpCaptions ?? true
  const captionLines = assembleCaptionLines(
    configSettings.viewerLanguage,
    finalTextQueue,
    translations,
  )
  const finalTextCaptions = joinCaptionLines(captionLines)
  // Interim text only renders for the default language; resolve to '' otherwise.
  const interimVisible =
    configSettings.viewerLanguage === 'default' ? interimText || '' : ''

  return (
    <CaptionsContainer
      $captionsTransparency={configSettings.captionsTransparency}
      $mobilePanel
    >
      <Captions
        $fontFamily={fontFamily}
        $fontSize={fontSize}
        $uppercase={configSettings.textUppercase}
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
  )
}

// Memoize MobileClosedCaption component to prevent unnecessary re-renders
// Only re-renders when Redux state actually changes (via useShallowEqualSelector)
export default memo(MobileClosedCaption)
