import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { ccStyles } from '../shared/caption-styles'
import './MobileClosedCaption.css'
import { TEXT_SIZES } from '@/utils/Constants'

const classNames = require('classnames')

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
    fontSize = 'var(--mobile-small-font-size)'
    break
  case TEXT_SIZES.MEDIUM:
    fontSize = 'var(--mobile-medium-font-size)'
    break
  case TEXT_SIZES.LARGE:
    fontSize = 'var(--mobile-large-font-size)'
    break
  default:
    fontSize = 'var(--mobile-medium-font-size)'
    break
  }

  return fontSize
}

function MobileClosedCaption({
  ccState: { interimText, finalTextQueue, translations },
  configSettings,
}) {
  const fontSize = setFontSizeStyle(configSettings.size)

  const textStyles = { ...ccStyles, fontSize }

  const ccTextClasses = classNames({
    'text-capitalize': configSettings.uppercaseText,
    'text-mix-case': !configSettings.uppercaseText,
  })

  const finalTextClasses = classNames({
    'gray-text': configSettings.grayOutFinalText,
  })

  let finalTextCaptions = ''
  if (configSettings.viewerLanguage === 'default') {
    finalTextCaptions = finalTextQueue
      .map(({ text }) => text)
      .join(' ')
  } else {
    finalTextCaptions = translations[configSettings.viewerLanguage].textQueue
      .map(({ text }) => text)
      .join(' ')
  }

  return (
    <div className="caption-container">
      <main className={ccTextClasses} style={textStyles}>
        <span className={finalTextClasses}>{finalTextCaptions}</span>
        <span className="interim-text">{interimText}</span>
      </main>
    </div>
  )
}

MobileClosedCaption.propTypes = {
  configSettings: PropTypes.object,
  ccState: PropTypes.object,
}

MobileClosedCaption.defaultProps = {}

const mapStateToProps = (state) => ({
  ccState: state.captionsState,
  configSettings: state.configSettings,
})

export default connect(mapStateToProps)(MobileClosedCaption)
