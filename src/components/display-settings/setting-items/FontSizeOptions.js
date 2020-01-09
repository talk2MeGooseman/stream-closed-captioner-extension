import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFont } from '@fortawesome/free-solid-svg-icons'
import { MenuItem } from '@blueprintjs/core'
import { changeTextSize } from '@/redux/settingsSlice'
import { useReduxCallbackDispatch } from '@/redux/redux-helpers'

function FontSizeOptions() {
  const onClickSmallTextSize = useReduxCallbackDispatch(changeTextSize('small'))
  const onClickMediumTextSize = useReduxCallbackDispatch(changeTextSize('medium'))
  const onClickLargeTextSize = useReduxCallbackDispatch(changeTextSize('large'))

  const fontIcon = <FontAwesomeIcon icon={faFont} />

  return (
    <React.Fragment>
      <MenuItem
        icon={fontIcon}
        text="Small Text"
        onClick={onClickSmallTextSize}
        shouldDismissPopover={false}
      />
      <MenuItem
        icon={fontIcon}
        text="Medium Text"
        onClick={onClickMediumTextSize}
        shouldDismissPopover={false}
      />
      <MenuItem
        icon={fontIcon}
        text="Large Text"
        onClick={onClickLargeTextSize}
        shouldDismissPopover={false}
      />
    </React.Fragment>
  )
}

FontSizeOptions.propTypes = {}

export default FontSizeOptions
