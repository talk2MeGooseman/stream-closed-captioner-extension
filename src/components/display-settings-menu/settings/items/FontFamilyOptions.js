import { MenuItem, Divider } from '@blueprintjs/core'
import { faClosedCaptioning } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

import {
  useShallowEqualSelector,
  useReduxCallbackDispatch,
} from '@/redux/redux-helpers'

import { toggleDyslexiaFamily } from '@/redux/settings-slice'

function FontFamilyOptions() {
  const enabled = useShallowEqualSelector(
    (state) => state.configSettings.dyslexiaFontEnabled,
  )

  const toggleFont = useReduxCallbackDispatch(toggleDyslexiaFamily())

  return (
    <>
      <Divider />
      <MenuItem
        active={enabled}
        icon={<FontAwesomeIcon icon={faClosedCaptioning} />}
        onClick={toggleFont}
        shouldDismissPopover={false}
        text="Use Dyslexia Font"
      />
    </>
  )
}

export default FontFamilyOptions
