import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFont } from '@fortawesome/free-solid-svg-icons'
import { MenuItem } from '@blueprintjs/core'
import { changeTextSize } from '@/redux/settings-slice'
import { useReduxCallbackDispatch, useShallowEqualSelector } from '@/redux/redux-helpers'
import { TEXT_SIZES } from '@/utils/Constants'

function FontSizeOptions() {
  const onClickSmallTextSize = useReduxCallbackDispatch(changeTextSize(TEXT_SIZES.SMALL))
  const onClickMediumTextSize = useReduxCallbackDispatch(changeTextSize(TEXT_SIZES.MEDIUM))
  const onClickLargeTextSize = useReduxCallbackDispatch(changeTextSize(TEXT_SIZES.LARGE))

  const activeTextSizeOption = useShallowEqualSelector((state) => state.configSettings.size)

  const fontIcon = <FontAwesomeIcon icon={faFont} />

  return (
    <React.Fragment>
      <MenuItem
        active={activeTextSizeOption === TEXT_SIZES.SMALL}
        icon={fontIcon}
        text="Small Text"
        onClick={onClickSmallTextSize}
        shouldDismissPopover={false}
      />
      <MenuItem
        active={activeTextSizeOption === TEXT_SIZES.MEDIUM}
        icon={fontIcon}
        text="Medium Text"
        onClick={onClickMediumTextSize}
        shouldDismissPopover={false}
      />
      <MenuItem
        active={activeTextSizeOption === TEXT_SIZES.LARGE}
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
