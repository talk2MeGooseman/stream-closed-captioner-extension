import {
  useReduxCallbackDispatch,
  useShallowEqualSelector,
} from '@/redux/redux-helpers'
import {
  Button,
  Classes,
  Dialog,
  Tooltip,
} from '@blueprintjs/core'
import React from 'react'
import {
  toggleAdvancedSettingsDialog,
} from '@/redux/settingsSlice'
import { BoxWidthSlider } from './fields/BoxWidthSlider'

const SettingsDialog = () => {
  const onClose = useReduxCallbackDispatch(toggleAdvancedSettingsDialog())
  const displayAdvancedSettingsDialog = useShallowEqualSelector(
    (state) => state.configSettings.displayAdvancedSettingsDialog,
  )

  return (
    <Dialog
      icon="info-sign"
      onClose={onClose}
      title="Advanced Settings"
      isOpen={displayAdvancedSettingsDialog}
    >
      <div className={Classes.DIALOG_BODY}>
        <BoxWidthSlider />
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
