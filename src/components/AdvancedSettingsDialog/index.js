import {
  useReduxCallbackDispatch,
  useShallowEqualSelector,
} from '@/redux/redux-helpers'
import {
  AnchorButton,
  Button,
  Classes,
  Dialog,
  Intent,
  Tooltip,
  Slider,
} from '@blueprintjs/core'
import React, { useCallback } from 'react'
import { toggleAdvancedSettingsDialog, changeBoxWidth } from '@/redux/settingsSlice'
import { useDispatch } from 'react-redux'

const renderLabel = (val) => (`${val}%`)

export const AdvancedSettingsDialog = () => {
  const dispatch = useDispatch()
  const onClose = useReduxCallbackDispatch(toggleAdvancedSettingsDialog())
  const displayAdvancedSettingsDialog = useShallowEqualSelector(
    (state) => state.configSettings.displayAdvancedSettingsDialog,
  )
  const boxWidth = useShallowEqualSelector(
    (state) => state.configSettings.boxWidth,
  )

  const onSliderChange = useCallback((value) => {
    dispatch(changeBoxWidth(value))
  }, [dispatch])

  return (
    <Dialog
      icon="info-sign"
      onClose={onClose}
      title="Advanced Settings"
      isOpen={displayAdvancedSettingsDialog}
    >
      <div className={Classes.DIALOG_BODY}>
        <Slider
          min={30}
          max={80}
          labelStepSize={10}
          labelRenderer={renderLabel}
          value={boxWidth}
          onChange={onSliderChange}
        />
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Tooltip content="This button is hooked up to close the dialog.">
            <Button onClick={onClose}>Close</Button>
          </Tooltip>
          <AnchorButton
            intent={Intent.PRIMARY}
            href="https://www.palantir.com/palantir-foundry/"
            target="_blank"
          >
            Visit the Foundry website
          </AnchorButton>
        </div>
      </div>
    </Dialog>
  )
}
