import React from 'react'
import { Captions, CaptionText, CaptionsContainer } from '../shared/caption-styles'
import { FONT_FAMILIES } from '@/utils/Constants'
import { useShallowEqualSelector } from '@/redux/redux-helpers'
import { getMobileFontSizeStyle } from './helpers'
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

  let finalTextCaptions = ''
  if (configSettings.viewerLanguage === 'default') {
    finalTextCaptions = finalTextQueue.map(({ text }) => text).join(' ')
  } else {
    finalTextCaptions = translations[configSettings.viewerLanguage].textQueue
      .map(({ text }) => text)
      .join(' ')
  }

  return (
    <CaptionsContainer mobilePanel>
      <Captions
        fontFamily={fontFamily}
        fontSize={fontSize}
        uppercase={configSettings.uppercaseText}
      >
        <CaptionText grayOutText={configSettings.grayOutFinalText}>{finalTextCaptions}</CaptionText>
        { configSettings.viewerLanguage === 'default' && <CaptionText interim>{interimText}</CaptionText> }
      </Captions>
    </CaptionsContainer >
  )
}

export default MobileClosedCaption
