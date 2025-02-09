import { Tooltip } from '@blueprintjs/core'
import { faClosedCaptioning, faBan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

import { isVideoOverlay } from '@/helpers/video-helpers'

import {
  useShallowEqualSelector,
  useReduxCallbackDispatch,
} from '@/redux/redux-helpers'

import { toggleVisibility } from '@/redux/settings-slice'

// eslint-disable-next-line complexity
const VisibilityToggle = () => {
  const videoPlayerContext = useShallowEqualSelector(
    (state) => state.videoPlayerContext,
  )
  const configSettings = useShallowEqualSelector(
    (state) => state.configSettings,
  )
  const onClick = useReduxCallbackDispatch(toggleVisibility())

  let ccDisabledElement = null
  let buttonCTA = 'Hide'

  if (!isVideoOverlay() || !videoPlayerContext.arePlayerControlsVisible) {
    return null
  }

  if (configSettings.hideCC) {
    ccDisabledElement = (
      <FontAwesomeIcon className="fa-stack-1x" color="red" icon={faBan} />
    )
    buttonCTA = 'Show'
  }

  return (
    <Tooltip content={`${buttonCTA} CC Text`}>
      <span
        className="fa-layers fa-fw fa-2x cc-visibility-toggle"
        onClick={onClick}
        onKeyUp={onClick}
        role="button"
        tabIndex="0"
      >
        <FontAwesomeIcon icon={faClosedCaptioning} />
        {ccDisabledElement}
      </span>
    </Tooltip>
  )
}

export default VisibilityToggle
