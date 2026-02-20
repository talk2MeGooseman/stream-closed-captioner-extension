import {
  Captions,
  CaptionText,
  CaptionsContainer,
} from '../shared/caption-styles'

import { getMobileFontSizeStyle } from './helpers'

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
    : FONT_FAMILIES.ROBOT

  let finalTextCaptions

  if (configSettings.viewerLanguage === 'default') {
    finalTextCaptions = finalTextQueue.map(({ text }) => text).join(' ')
  } else {
    finalTextCaptions = translations[configSettings.viewerLanguage].textQueue
      .map(({ text }) => text)
      .join(' ')
  }

  return (
    <CaptionsContainer
      captionsTransparency={configSettings.captionsTransparency}
      mobilePanel
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
  )
}

// Memoize MobileClosedCaption component to prevent unnecessary re-renders
// Only re-renders when Redux state actually changes (via useShallowEqualSelector)
export default memo(MobileClosedCaption)
