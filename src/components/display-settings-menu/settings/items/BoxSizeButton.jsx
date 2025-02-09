import { MenuDivider, MenuItem } from '@blueprintjs/core'
import { faExpand, faMinus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

import { isVideoOverlay } from '@/helpers/video-helpers'

import {
  useShallowEqualSelector,
  useReduxCallbackDispatch,
} from '@/redux/redux-helpers'

import { toggleBoxSize } from '@/redux/settings-slice'

function BoxSizeButton() {
  const ccBoxSize = useShallowEqualSelector(
    (state) => state.configSettings.ccBoxSize,
  )
  const onToggleBoxSize = useReduxCallbackDispatch(toggleBoxSize())

  if (!isVideoOverlay()) {
    return null
  }

  let text = ccBoxSize ? 'Enable Horizontal Text Box' : 'Enable Square Text Box'
  let icon = ccBoxSize ? faExpand : faMinus

  return (
    <>
      <MenuDivider />
      <MenuItem
        icon={<FontAwesomeIcon icon={icon} size="lg" />}
        onClick={onToggleBoxSize}
        shouldDismissPopover={false}
        text={text}
      />
    </>
  )
}

BoxSizeButton.propTypes = {}

export default BoxSizeButton
