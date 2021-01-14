import { MenuItem, Divider } from '@blueprintjs/core'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

import { isVideoOverlay } from '@/helpers/video-helpers'

import { useShallowEqualSelector, useReduxCallbackDispatch } from '@/redux/redux-helpers'

import {
  increaseLineCount,
  decreaseLineCount,
} from '@/redux/settings-slice'

function LineCountOptions() {
  const ccBoxSize = useShallowEqualSelector((state) => state.configSettings.ccBoxSize)
  const horizontalLineCount = useShallowEqualSelector(
    (state) => state.configSettings.horizontalLineCount,
  )
  const boxLineCount = useShallowEqualSelector((state) => state.configSettings.boxLineCount)
  const onLineIncrease = useReduxCallbackDispatch(increaseLineCount())
  const onLineDecrease = useReduxCallbackDispatch(decreaseLineCount())

  if (!isVideoOverlay()) return null

  let disableDecrease = false

  if (ccBoxSize && boxLineCount === 1) {
    disableDecrease = true
  } else if (horizontalLineCount === 1) {
    disableDecrease = true
  }

  return (
    <>
      <Divider />
      <MenuItem
        icon={<FontAwesomeIcon icon={faPlus} />}
        onClick={onLineIncrease}
        shouldDismissPopover={false}
        text="Increase Line Count"
      />
      <MenuItem
        disabled={disableDecrease}
        icon={<FontAwesomeIcon icon={faMinus} />}
        onClick={onLineDecrease}
        shouldDismissPopover={false}
        text="Decrease Line Count"
      />
    </>
  )
}

export default LineCountOptions
