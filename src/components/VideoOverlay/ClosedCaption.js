import React from 'react'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'
import { connect } from 'react-redux'
import { ccStyles } from '../shared/caption-styles'

import './ClosedCaption.css'
import { setIsDragged } from '@/redux/settingsSlice'
import { TEXT_SIZES } from '@/utils/Constants'

const classNames = require('classnames')

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

function setFontSizeStyle(size) {
  let fontSize = ''

  switch (size) {
  case TEXT_SIZES.SMALL:
    fontSize = 'var(--small-font-size)'
    break
  case TEXT_SIZES.MEDIUM:
    fontSize = 'var(--medium-font-size)'
    break
  case TEXT_SIZES.LARGE:
    fontSize = 'var(--large-font-size)'
    break
  default:
    fontSize = 'var(--medium-font-size)'
    break
  }

  return fontSize
}

function ClosedCaption({
  configSettings,
  ccState: { interimText, finalTextQueue, translations },
  setIsDragged,
}) {
  const finalText = finalTextQueue.join(' ')

  const fontSize = setFontSizeStyle(configSettings.size)
  const textStyles = { ...ccStyles, fontSize }

  let numberOfLines = configSettings.horizontalLineCount
  if (configSettings.ccBoxSize) {
    // eslint-disable-next-line no-param-reassign
    numberOfLines = configSettings.boxLineCount
  }

  const styles = {
    maxHeight: `calc(${fontSize} * var(--line-height) * ${numberOfLines} + var(--caption-pad-bottom))`,
    overflow: 'hidden',
  }

  const containerClasses = classNames({
    'caption-container': true,
    'box-size': configSettings.ccBoxSize,
    hide: shouldHideCC(configSettings.hideCC, interimText, finalText),
  })

  const ccTextClasses = classNames({
    'text-capitalize': configSettings.uppercaseText,
    'text-mix-case': !configSettings.uppercaseText,
  })

  const finalTextClasses = classNames({
    'gray-text': configSettings.grayOutFinalText,
  })

  let finalTextCaptions = ''
  if (configSettings.viewerLanguage === 'default') {
    finalTextCaptions = finalTextQueue.map(({ text }) => text).join(' ')
  } else {
    finalTextCaptions = translations[configSettings.viewerLanguage].textQueue.map(({ text }) => text).join(' ')
  }

  return (
    <Draggable grid={[8, 8]} bounds="parent" onStop={setIsDragged}>
      <div className={containerClasses} style={styles}>
        <main className={ccTextClasses} style={textStyles} >
          <span className={finalTextClasses}>{finalTextCaptions}</span>
          <span className="interim-text">{interimText}</span>
        </main>
      </div>
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
