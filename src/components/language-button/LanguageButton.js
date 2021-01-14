import { Popover, Tooltip } from '@blueprintjs/core'
import { faLanguage } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

import { useReduxCallbackDispatch, useShallowEqualSelector } from '../../redux/redux-helpers'
import { Pulse } from '../shared/caption-styles'

import LanguageOptions from './LanguageOptions'

import { hasCaptionsSelector, hasCaptionsTranslationsSelector, isBitsEnabledSelector } from '@/redux/selectors'

import { toggleActivationDrawer } from '@/redux/settings-slice'

const TranslationDialogButton = ({ hasTranslations, onClick }) => (
  hasTranslations ?
    <Popover content={<LanguageOptions />} position="left-bottom">
      <Pulse color="#9ccc65">
        <FontAwesomeIcon icon={faLanguage} size="2x" />
      </Pulse>
    </Popover>
  : <FontAwesomeIcon icon={faLanguage} onClick={onClick} size="2x" />
)

// eslint-disable-next-line complexity
export default function LanguageButton() {
  const isBitsEnabled = useShallowEqualSelector(isBitsEnabledSelector)
  const hasTranslations = useShallowEqualSelector(hasCaptionsTranslationsSelector)

  const hasCaptions = useShallowEqualSelector(hasCaptionsSelector)

  const toggleDrawer = useReduxCallbackDispatch(toggleActivationDrawer())

  const notTranslatable = !isBitsEnabled && !hasTranslations

  if (notTranslatable || !hasCaptions) {
    return null
  }
  // Display activate dialog/text
  return (
    <Tooltip content="Translations"><TranslationDialogButton hasTranslations={hasTranslations} onClick={toggleDrawer} /></Tooltip>
  )
}
