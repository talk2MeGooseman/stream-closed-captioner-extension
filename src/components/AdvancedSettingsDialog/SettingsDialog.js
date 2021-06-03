import { Button, Classes, Dialog, Tooltip } from '@blueprintjs/core'
import React from 'react'

import { BoxWidthSlider } from './fields/BoxWidthSlider'
import { CaptionsTransparencySlider } from './fields/CaptionsTransparencySlider'
import { CaptionsColorPicker } from './fields/CaptionsColorPicker'

import {
  useReduxCallbackDispatch,
  useShallowEqualSelector,
} from '@/redux/redux-helpers'

import { toggleAdvancedSettingsDialog } from '@/redux/settings-slice'

const SettingsDialog = () => {
  const onClose = useReduxCallbackDispatch(toggleAdvancedSettingsDialog())
  const displayAdvancedSettingsDialog = useShallowEqualSelector(
    (state) => state.configSettings.displayAdvancedSettingsDialog,
  )

  return (
    <Dialog
      icon="info-sign"
      isOpen={displayAdvancedSettingsDialog}
      onClose={onClose}
      title="Advanced Settings"
    >
      <div className={Classes.DIALOG_BODY}>
        <BoxWidthSlider />
        <CaptionsTransparencySlider />
        <CaptionsColorPicker />
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Tooltip content="Close the advanced settings dialog">
            <Button onClick={onClose}>Close</Button>
          </Tooltip>
        </div>
      </div>
    </Dialog>
  )
}

export default SettingsDialog
