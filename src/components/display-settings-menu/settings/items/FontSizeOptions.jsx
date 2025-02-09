import { MenuItem } from '@blueprintjs/core'
import { faFont } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

import {
  useReduxCallbackDispatch,
  useShallowEqualSelector,
} from '@/redux/redux-helpers'

import { changeTextSize } from '@/redux/settings-slice'

import { TEXT_SIZES } from '@/utils/Constants'

function FontSizeOptions() {
  const onClickSmallTextSize = useReduxCallbackDispatch(
    changeTextSize(TEXT_SIZES.SMALL),
  )
  const onClickMediumTextSize = useReduxCallbackDispatch(
    changeTextSize(TEXT_SIZES.MEDIUM),
  )
  const onClickLargeTextSize = useReduxCallbackDispatch(
    changeTextSize(TEXT_SIZES.LARGE),
  )

  const activeTextSizeOption = useShallowEqualSelector(
    (state) => state.configSettings.size,
  )

  const fontIcon = <FontAwesomeIcon icon={faFont} />

  return (
    <>
      <MenuItem
        active={activeTextSizeOption === TEXT_SIZES.SMALL}
        icon={fontIcon}
        onClick={onClickSmallTextSize}
        shouldDismissPopover={false}
        text="Small Text"
      />
      <MenuItem
        active={activeTextSizeOption === TEXT_SIZES.MEDIUM}
        icon={fontIcon}
        onClick={onClickMediumTextSize}
        shouldDismissPopover={false}
        text="Medium Text"
      />
      <MenuItem
        active={activeTextSizeOption === TEXT_SIZES.LARGE}
        icon={fontIcon}
        onClick={onClickLargeTextSize}
        shouldDismissPopover={false}
        text="Large Text"
      />
    </>
  )
}

FontSizeOptions.propTypes = {}

export default FontSizeOptions
