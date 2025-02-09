import { MenuDivider, MenuItem } from '@blueprintjs/core'
import { faUndo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

import { isVideoOverlay } from '@/helpers/video-helpers'

import { useReduxCallbackDispatch } from '@/redux/redux-helpers'

import { resetCCText } from '@/redux/settings-slice'

function ResetButton() {
  const onResetPosition = useReduxCallbackDispatch(resetCCText())

  if (!isVideoOverlay()) {
    return null
  }

  return (
    <>
      <MenuDivider />
      <MenuItem
        icon={<FontAwesomeIcon icon={faUndo} size="lg" />}
        onClick={onResetPosition}
        shouldDismissPopover={false}
        text="Reset Position"
      />
    </>
  )
}

ResetButton.propTypes = {}

export default ResetButton
