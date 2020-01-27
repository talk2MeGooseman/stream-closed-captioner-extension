import React from 'react'
import { Captions, MobileCaptionsContainer, CaptionText } from '../shared/caption-styles'
import './MobileClosedCaption.css'
import { TEXT_SIZES, FONT_FAMILIES } from '@/utils/Constants'
import { useShallowEqualSelector } from '@/redux/redux-helpers'

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

function setFontSizeStyle(size) {
  let fontSize = ''

  switch (size) {
  case TEXT_SIZES.SMALL:
    fontSize = '--mobile-small-font-size'
    break
  case TEXT_SIZES.MEDIUM:
    fontSize = '--mobile-medium-font-size'
    break
  case TEXT_SIZES.LARGE:
    fontSize = '--mobile-large-font-size'
    break
  default:
    fontSize = '--mobile-medium-font-size'
    break
  }

  return fontSize
}

function MobileClosedCaption() {
  const { interimText, finalTextQueue, translations } = useShallowEqualSelector(
    (state) => state.captionsState,
  )
  const configSettings = useShallowEqualSelector(
    (state) => state.configSettings,
  )

  const fontSize = setFontSizeStyle(configSettings.size)
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
    <MobileCaptionsContainer>
      <Captions
        fontFamily={fontFamily}
        fontSize={fontSize}
        uppercase={configSettings.uppercaseText}
      >
        <CaptionText grayOutText={configSettings.grayOutFinalText}>{finalTextCaptions}</CaptionText>
        <CaptionText className="interim-text">{interimText}</CaptionText>
      </Captions>
    </MobileCaptionsContainer>
  )
}

export default MobileClosedCaption
