import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLanguage } from '@fortawesome/free-solid-svg-icons'
import { Tooltip, Popover } from '@blueprintjs/core'
import LanguageOptions from './LanguageOptions'
import { useShallowEqualSelector, useReduxCallbackDispatch } from '../../redux/redux-helpers'
import { toggleActivationDrawer } from '@/redux/settingsSlice'
import styled from 'styled-components'

export default function LanguageButton() {
  const isBitsEnabled = useShallowEqualSelector((state) => state.configSettings.isBitsEnabled)
  const hasTranslations = useShallowEqualSelector(
    (state) => Object.keys(state.captionsState.translations || {}).length > 0,
  )
  const toggleDrawer = useReduxCallbackDispatch(toggleActivationDrawer())

  if (!isBitsEnabled && !hasTranslations) {
    return null
  }

  let button = <FontAwesomeIcon size="2x" icon={faLanguage} onClick={toggleDrawer} />
  let tooltipText = 'Turn on Translations'

  if (hasTranslations) {
    const FAPulse = styled(FontAwesomeIcon)`
      animation: pulse 2s infinite;
      @keyframes pulse {
        0% {
          color: #ffffff;
        }
        50% {
          color: #9ccc65;
        }
        100% {
          color: #ffffff;
        }
      }
    `
    tooltipText = 'Select a Language'
    button = (
      <Popover position="left-bottom" content={<LanguageOptions />}>
        <FAPulse size="2x" icon={faLanguage} pulse />
      </Popover>
    )
  }

  return (
    <>
      <Tooltip content={tooltipText}>{button}</Tooltip>
    </>
  )
}
