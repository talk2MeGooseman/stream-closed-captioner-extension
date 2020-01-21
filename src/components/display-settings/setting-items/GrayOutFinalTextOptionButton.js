import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MenuDivider, MenuItem } from '@blueprintjs/core'
import { faAdjust } from '@fortawesome/free-solid-svg-icons'
import { toggleGrayOutFinalText } from '@/redux/settingsSlice'
import { useReduxCallbackDispatch, useShallowEqualSelector } from '@/redux/redux-helpers'

function GrayOutFinalTextOptionButton() {
  const onClick = useReduxCallbackDispatch(toggleGrayOutFinalText())
  const active = useShallowEqualSelector((state) => state.configSettings.grayOutFinalText)

  return (
    <React.Fragment>
      <MenuDivider />
      <MenuItem
        active={active}
        onClick={onClick}
        icon={<FontAwesomeIcon icon={faAdjust} size="lg" />}
        text="Gray Out Finished Text"
        shouldDismissPopover={false}
      />
    </React.Fragment>
  )
}

GrayOutFinalTextOptionButton.propTypes = {}

export default GrayOutFinalTextOptionButton
