import { Popover } from '@blueprintjs/core'
import { faLanguage } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

import { Pulse } from '../../shared/caption-styles'
import PropTypes from 'prop-types'

import { LanguageOptions } from './language-options'

export const TranslationDialogButton = ({ hasTranslations, onClick }) =>
  hasTranslations ? (
    <Popover content={<LanguageOptions />} position="left-bottom">
      <Pulse color="#9ccc65">
        <FontAwesomeIcon icon={faLanguage} size="2x" />
      </Pulse>
    </Popover>
  ) : (
    <FontAwesomeIcon icon={faLanguage} onClick={onClick} size="2x" />
  )

TranslationDialogButton.propTypes = {
  hasTranslations: PropTypes.bool,
  onClick: PropTypes.func,
}
