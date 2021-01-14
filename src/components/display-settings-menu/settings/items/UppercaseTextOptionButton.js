import { MenuDivider, MenuItem } from '@blueprintjs/core'
import { faTextHeight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'


import { useReduxCallbackDispatch, useShallowEqualSelector } from '@/redux/redux-helpers'

import { toggleUppercaseText } from '@/redux/settings-slice'

function UppercaseTextOptionButton() {
  const onClick = useReduxCallbackDispatch(toggleUppercaseText())
  const active = useShallowEqualSelector((state) => state.configSettings.uppercaseText)

  return (
    <>
      <MenuDivider />
      <MenuItem
        active={active}
        icon={<FontAwesomeIcon icon={faTextHeight} size="lg" />}
        onClick={onClick}
        shouldDismissPopover={false}
        text="Uppercase All Text"
      />
    </>
  )
}

UppercaseTextOptionButton.propTypes = {}

export default UppercaseTextOptionButton
