import { Popover, Tooltip } from '@blueprintjs/core'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'
import React from 'react'
import { useShallowEqualSelector } from '@/redux/redux-helpers'
import { LanguageButton } from '@/components/language-button'
import { isVideoOverlay } from '@/helpers/video-helpers'
import VisibilityToggle from '@/components/VideoOverlay/VisibilityToggle'
import { SettingsMenuItems } from './menu-items'

function isPositionLeft(configSettings) {
  return isVideoOverlay() && configSettings.switchSettingsPosition
}

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
    'controls-container': isVideoOverlay(),
    'position-right': !isPositionLeft(switchSettingsPosition),
    'position-left': isPositionLeft(switchSettingsPosition),
    'mobile-controls-button': !isVideoOverlay(),
    'bg-black-transparent': true,
  })

  return (
    <nav data-testid="display-settings" className={controlClass}>
      <LanguageButton />
      <VisibilityToggle />
      <Popover
        position="left-bottom"
        content={<SettingsMenuItems />}
        captureDismiss
      >
        <Tooltip content={'Settings'}>
          <FontAwesomeIcon size="2x" icon={faCog} />
        </Tooltip>
      </Popover>
    </nav>
  )
}

export default Controls
