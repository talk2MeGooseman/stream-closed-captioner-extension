import { toggleActivationDrawer } from '@/redux/settingsSlice'
import { Popover, Tooltip } from '@blueprintjs/core'
import { faLanguage } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Pulse } from '../shared/caption-styles'
import { useReduxCallbackDispatch, useShallowEqualSelector } from '../../redux/redux-helpers'
import LanguageOptions from './LanguageOptions'

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
      <Popover position="left-bottom" content={<LanguageOptions />}>
        <Pulse color="#9ccc65">
          <FontAwesomeIcon size="2x" icon={faLanguage} />
        </Pulse>
      </Popover>
    )
  } else {
    button = <FontAwesomeIcon size="2x" icon={faLanguage} onClick={toggleDrawer} />
  }

  // Display activate dialog/text
  return (
    <Tooltip content={'Translations'}>{button}</Tooltip>
  )
}
