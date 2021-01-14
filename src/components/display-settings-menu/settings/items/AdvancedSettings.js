import { MenuDivider, MenuItem } from '@blueprintjs/core'
import { faCogs } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

import { isVideoOverlay } from '@/helpers/video-helpers'

import { useReduxCallbackDispatch } from '@/redux/redux-helpers'

import { toggleAdvancedSettingsDialog } from '@/redux/settings-slice'

function AdvancedSettings() {
  const onClick = useReduxCallbackDispatch(toggleAdvancedSettingsDialog())

  if (!isVideoOverlay()) {
    return null
  }

  return (
    <>
      <MenuDivider />
      <MenuItem
        active={false}
        icon={<FontAwesomeIcon icon={faCogs} size="lg" />}
        onClick={onClick}
        shouldDismissPopover={false}
        text="Advanced Settings"
      />
    </>
  )
}

AdvancedSettings.propTypes = {}

export default AdvancedSettings
