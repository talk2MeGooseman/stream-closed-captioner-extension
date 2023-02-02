import { Popover, Tooltip } from '@blueprintjs/core'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'
import React from 'react'

import { AdvancedSettingsDialog } from '../AdvancedSettingsDialog'

import { SettingsMenu } from './settings'

import { LanguageButton } from '@/components/language-button'

import VisibilityToggle from '@/components/VideoOverlay/VisibilityToggle'

import { isVideoOverlay } from '@/helpers/video-helpers'

import { useShallowEqualSelector } from '@/redux/redux-helpers'

export const positionLeft = (switchSettingsPosition) =>
  isVideoOverlay() && switchSettingsPosition

const Controls = () => {
  const arePlayerControlsVisible = useShallowEqualSelector(
    (state) => state.videoPlayerContext.arePlayerControlsVisible,
  )

  const switchSettingsPosition = useShallowEqualSelector(
    (state) => state.configSettings.switchSettingsPosition,
  )

  if (isVideoOverlay() && !arePlayerControlsVisible) {
    return null
  }

  const controlClass = classnames({
    'bg-black-transparent': true,
    'controls-container': isVideoOverlay(),
    'mobile-controls-button': !isVideoOverlay(),
    'position-left': positionLeft(switchSettingsPosition),
    'position-right': !positionLeft(switchSettingsPosition),
  })

  return (
    <>
      <nav className={controlClass} data-testid="display-settings">
        <LanguageButton />
        <VisibilityToggle />
        <Popover
          captureDismiss
          content={<SettingsMenu />}
          position="left-bottom"
        >
          <Tooltip content="Settings">
            <FontAwesomeIcon icon={faCog} size="2x" />
          </Tooltip>
        </Popover>
      </nav>
      <AdvancedSettingsDialog />
    </>
  )
}

export default Controls
