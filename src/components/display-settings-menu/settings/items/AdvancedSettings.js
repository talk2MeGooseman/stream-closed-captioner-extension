import { useReduxCallbackDispatch } from '@/redux/redux-helpers'
import { toggleAdvancedSettingsDialog } from '@/redux/settings-slice'
import { MenuDivider, MenuItem } from '@blueprintjs/core'
import { faCogs } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { isVideoOverlay } from '@/helpers/video-helpers'
import React from 'react'

function AdvancedSettings() {
  const onClick = useReduxCallbackDispatch(toggleAdvancedSettingsDialog())
  if (!isVideoOverlay()) {
    return null
  }

  return (
    <React.Fragment>
      <MenuDivider />
      <MenuItem
        active={false}
        onClick={onClick}
        icon={<FontAwesomeIcon icon={faCogs} size="lg" />}
        text="Advanced Settings"
        shouldDismissPopover={false}
      />
    </React.Fragment>
  )
}

AdvancedSettings.propTypes = {}

export default AdvancedSettings
