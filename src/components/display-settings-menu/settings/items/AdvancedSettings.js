import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MenuDivider, MenuItem } from '@blueprintjs/core'
import { faCogs } from '@fortawesome/free-solid-svg-icons'
import { toggleAdvancedSettingsDialog } from '@/redux/settingsSlice'
import { useReduxCallbackDispatch } from '@/redux/redux-helpers'

function AdvancedSettings() {
  const onClick = useReduxCallbackDispatch(toggleAdvancedSettingsDialog())

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
