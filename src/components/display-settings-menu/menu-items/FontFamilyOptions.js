import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClosedCaptioning } from '@fortawesome/free-solid-svg-icons'
import { MenuItem, Divider } from '@blueprintjs/core'
import { toggleDyslexiaFamily } from '@/redux/settingsSlice'
import { useShallowEqualSelector, useReduxCallbackDispatch } from '@/redux/redux-helpers'

function FontFamilyOptions() {
  const enabled = useShallowEqualSelector((state) => state.configSettings.dyslexiaFontEnabled)

  const toggleFont = useReduxCallbackDispatch(toggleDyslexiaFamily())

  return (
    <>
      <Divider />
      <MenuItem
        active={enabled}
        icon={<FontAwesomeIcon icon={faClosedCaptioning} />}
        text="Use Dyslexia Font"
        onClick={toggleFont}
        shouldDismissPopover={false}
      />
    </>
  )
}

export default FontFamilyOptions
