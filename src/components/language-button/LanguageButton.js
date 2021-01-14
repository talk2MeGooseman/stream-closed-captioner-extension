import { Popover, Tooltip } from '@blueprintjs/core'
import { faLanguage } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

import { useReduxCallbackDispatch, useShallowEqualSelector } from '../../redux/redux-helpers'
import { Pulse } from '../shared/caption-styles'

import LanguageOptions from './LanguageOptions'

import { toggleActivationDrawer } from '@/redux/settings-slice'

export default function LanguageButton() {
  const isBitsEnabled = useShallowEqualSelector((state) => state.configSettings.isBitsEnabled)
  const hasTranslations = useShallowEqualSelector(
    (state) => Object.keys(state.captionsState.translations || {}).length > 0,
  )

  const hasCaptions = useShallowEqualSelector(
    (state) => state.captionsState.finalTextQueue.length > 0
      || state.captionsState.interimText.length > 0,
  )

  const toggleDrawer = useReduxCallbackDispatch(toggleActivationDrawer())

  if ((!isBitsEnabled && !hasTranslations) || !hasCaptions) {
    return null
  }

  let button = null

  if (hasTranslations) {
    button = (
      <Popover content={<LanguageOptions />} position="left-bottom">
        <Pulse color="#9ccc65">
          <FontAwesomeIcon icon={faLanguage} size="2x" />
        </Pulse>
      </Popover>
    )
  } else {
    button = <FontAwesomeIcon icon={faLanguage} onClick={toggleDrawer} size="2x" />
  }

  // Display activate dialog/text
  return (
    <Tooltip content="Translations">{button}</Tooltip>
  )
}
