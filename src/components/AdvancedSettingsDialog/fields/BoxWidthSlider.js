import {
  useShallowEqualSelector,
} from '@/redux/redux-helpers'
import {
  Slider,
  FormGroup,
} from '@blueprintjs/core'
import React, { useCallback } from 'react'
import {
  changeBoxWidth,
} from '@/redux/settingsSlice'
import { useDispatch } from 'react-redux'
import { BOX_SIZE } from '@/utils/Constants'
import { isVideoOverlay } from '@/helpers/video-helpers'

const renderLabel = (val) => `${val}%`

export const BoxWidthSlider = () => {
  const dispatch = useDispatch()
  const boxWidth = useShallowEqualSelector(
    (state) => state.configSettings.boxWidth,
  )
  const onSliderChange = useCallback(
    (value) => {
      dispatch(changeBoxWidth(value))
    },
    [dispatch],
  )

  if (!isVideoOverlay()) {
    return null
  }

  return (
    <FormGroup
      helperText="Adjust the square text box width by using slider."
      label="Square Text Box Captions Width"
      labelFor="box-width"
    >
      <Slider
        id="box-width"
        min={BOX_SIZE.minWidth}
        max={BOX_SIZE.maxWidth}
        labelStepSize={10}
        labelRenderer={renderLabel}
        value={boxWidth}
        onChange={onSliderChange}
      />
    </FormGroup>
  )
}
