import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClosedCaptioning, faBan } from '@fortawesome/free-solid-svg-icons'
import { Tooltip } from '@blueprintjs/core'
import { isVideoOverlay } from '@/helpers/video-helpers'
import { toggleVisibility } from '@/redux/settingsSlice'
import { useShallowEqualSelector, useReduxCallbackDispatch } from '@/redux/redux-helpers'

const VisibilityToggle = () => {
  const videoPlayerContext = useShallowEqualSelector((state) => (state.videoPlayerContext))
  const configSettings = useShallowEqualSelector((state) => (state.configSettings))
  const onClick = useReduxCallbackDispatch(toggleVisibility())

  let ccDisabledElement = null
  let buttonCTA = 'Hide'

  if (!isVideoOverlay() || !videoPlayerContext.arePlayerControlsVisible) {
    return null
  }

  if (configSettings.hideCC) {
    ccDisabledElement = <FontAwesomeIcon icon={faBan} color="red" className="fa-stack-1x" />
    buttonCTA = 'Show'
  }

  return (
    <Tooltip content={`${buttonCTA} CC Text`}>
      <span role="button" tabIndex="0" onClick={onClick} onKeyUp={onClick} className="fa-layers fa-fw fa-2x cc-visibility-toggle">
        <FontAwesomeIcon icon={faClosedCaptioning} />
        {ccDisabledElement}
      </span>
    </Tooltip>
  )
}

export default VisibilityToggle
