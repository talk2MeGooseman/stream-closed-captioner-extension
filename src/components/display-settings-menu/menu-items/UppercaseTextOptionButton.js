import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MenuDivider, MenuItem } from '@blueprintjs/core'
import { faTextHeight } from '@fortawesome/free-solid-svg-icons'
import { toggleUppercaseText } from '@/redux/settingsSlice'
import {
  useReduxCallbackDispatch,
  useShallowEqualSelector,
} from '@/redux/redux-helpers'

function UppercaseTextOptionButton() {
  const onClick = useReduxCallbackDispatch(toggleUppercaseText())
  const active = useShallowEqualSelector(
    (state) => state.configSettings.uppercaseText,
  )

  return (
    <React.Fragment>
      <MenuDivider />
      <MenuItem
        active={active}
        onClick={onClick}
        icon={<FontAwesomeIcon icon={faTextHeight} size="lg" />}
        text="Uppercase All Text"
        shouldDismissPopover={false}
      />
    </React.Fragment>
  )
}

UppercaseTextOptionButton.propTypes = {}

export default UppercaseTextOptionButton
