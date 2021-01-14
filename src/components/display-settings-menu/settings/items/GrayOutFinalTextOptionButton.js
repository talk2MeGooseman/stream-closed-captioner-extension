import { MenuDivider, MenuItem } from '@blueprintjs/core'
import { faAdjust } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'


import { useReduxCallbackDispatch, useShallowEqualSelector } from '@/redux/redux-helpers'

import { toggleGrayOutFinalText } from '@/redux/settings-slice'

function GrayOutFinalTextOptionButton() {
  const onClick = useReduxCallbackDispatch(toggleGrayOutFinalText())
  const active = useShallowEqualSelector((state) => state.configSettings.grayOutFinalText)

  return (
    <>
      <MenuDivider />
      <MenuItem
        active={active}
        icon={<FontAwesomeIcon icon={faAdjust} size="lg" />}
        onClick={onClick}
        shouldDismissPopover={false}
        text="Gray Out Finished Text"
      />
    </>
  )
}

GrayOutFinalTextOptionButton.propTypes = {}

export default GrayOutFinalTextOptionButton
