import {
  Captions,
  CaptionText,
  CaptionsContainer,
} from '../shared/caption-styles'

import {
  assembleCaptionLines,
  assembleCaptionText,
  getMobileFontSizeStyle,
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
  // single flowing paragraph via the display settings menu.
  const rollUpCaptions = configSettings.rollUpCaptions ?? true
  const captionLines = assembleCaptionLines(
    configSettings.viewerLanguage,
    finalTextQueue,
    translations,
  )
  const finalTextCaptions = assembleCaptionText(
    configSettings.viewerLanguage,
    finalTextQueue,
    translations,
  )

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
        {rollUpCaptions ? (
          captionLines.map((line) => (
            <CaptionText
              key={line.id}
              $block
              $grayOutText={configSettings.grayOutFinalText}
            >
              {line.text}
            </CaptionText>
          ))
        ) : (
          <CaptionText $grayOutText={configSettings.grayOutFinalText}>
            {finalTextCaptions}
          </CaptionText>
        )}
        {configSettings.viewerLanguage === 'default' && interimText && (
          <CaptionText $block={rollUpCaptions} $interim>
            {interimText}
          </CaptionText>
        )}
      </Captions>
    </CaptionsContainer>
  )
}

// Memoize MobileClosedCaption component to prevent unnecessary re-renders
// Only re-renders when Redux state actually changes (via useShallowEqualSelector)
export default memo(MobileClosedCaption)
