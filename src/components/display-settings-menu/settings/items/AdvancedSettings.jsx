import { MenuDivider, MenuItem } from '@blueprintjs/core'
import { faCogs } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import { useCallback } from 'react'

import { isVideoOverlay } from '@/helpers/video-helpers'

import { useReduxCallbackDispatch } from '@/redux/redux-helpers'

import { toggleAdvancedSettingsDialog } from '@/redux/settings-slice'

function AdvancedSettings({ onOpen }) {
  const toggleDialog = useReduxCallbackDispatch(toggleAdvancedSettingsDialog())
  const onClick = useCallback(() => {
    onOpen?.()
    toggleDialog()
  }, [onOpen, toggleDialog])

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

AdvancedSettings.propTypes = {
  onOpen: PropTypes.func,
}

export default AdvancedSettings
