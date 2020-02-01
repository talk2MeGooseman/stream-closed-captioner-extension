import React from 'react'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'
import { connect } from 'react-redux'
import {
  CaptionsContainer,
  Captions,
  CaptionText,
} from '../shared/caption-styles'
import './ClosedCaption.css'
import { setIsDragged } from '@/redux/settingsSlice'
import { FONT_FAMILIES } from '@/utils/Constants'
import { getFontSizeStyle } from './helpers'

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

function ClosedCaption({
  configSettings,
  ccState: { interimText, finalTextQueue, translations },
  setIsDragged,
}) {
  const finalText = finalTextQueue.join(' ')
  const fontSize = getFontSizeStyle(configSettings.size)
  const isHidden = shouldHideCC(configSettings.hideCC, interimText, finalText)
  const fontFamily = configSettings.dyslexiaFontEnabled
    ? FONT_FAMILIES.DYSLEXIA
    : FONT_FAMILIES.ROBOTO

  let numberOfLines = configSettings.horizontalLineCount
  if (configSettings.ccBoxSize) {
    // eslint-disable-next-line no-param-reassign
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
    <Draggable grid={[8, 8]} bounds="parent" onStop={setIsDragged}>
      <CaptionsContainer
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
      </CaptionsContainer>
    </Draggable>
  )
}

ClosedCaption.propTypes = {
  configSettings: PropTypes.object,
  ccState: PropTypes.object.isRequired,
  hide: PropTypes.bool,
  settings: PropTypes.object,
  numberOfLines: PropTypes.number.isRequired,
  setIsDragged: PropTypes.func,
}

ClosedCaption.defaultProps = {
  numberOfLines: 3,
}

const mapStateToProps = (state) => ({
  ccState: state.captionsState,
  configSettings: state.configSettings,
})

const mapDispatchToProps = (dispatch) => ({
  setIsDragged: () => dispatch(setIsDragged()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ClosedCaption)
