import { MenuDivider, MenuItem } from '@blueprintjs/core'
import { faExpand, faMinus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

import { isVideoOverlay } from '@/helpers/video-helpers'

import { useShallowEqualSelector, useReduxCallbackDispatch } from '@/redux/redux-helpers'

import { toggleBoxSize } from '@/redux/settings-slice'

function BoxSizeButton() {
  const ccBoxSize = useShallowEqualSelector((state) => state.configSettings.ccBoxSize)
  const onToggleBoxSize = useReduxCallbackDispatch(toggleBoxSize())

  if (!isVideoOverlay()) {
    return null
  }

  let text = 'Enable Square Text Box'
  let icon = faExpand

  if (ccBoxSize) {
    text = 'Enable Horizontal Text Box'
    icon = faMinus
  }

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
