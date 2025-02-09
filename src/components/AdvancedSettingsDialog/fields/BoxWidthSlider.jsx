import { Slider, FormGroup } from '@blueprintjs/core'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { isVideoOverlay } from '@/helpers/video-helpers'

import { useShallowEqualSelector } from '@/redux/redux-helpers'

import { changeCaptionsWidth } from '@/redux/settings-slice'

import { CAPTIONS_SIZE } from '@/utils/Constants'

const renderLabel = (val) => `${val}%`

export const BoxWidthSlider = () => {
  const dispatch = useDispatch()
  const captionsWidth = useShallowEqualSelector(
    (state) => state.configSettings.captionsWidth,
  )
  const onSliderChange = useCallback(
    (value) => {
      dispatch(changeCaptionsWidth(value))
    },
    [dispatch],
  )

  if (!isVideoOverlay()) {
    return null
  }

  return (
    <FormGroup
      helperText="Adjust the width of the captions by using the slider."
      label="Captions Text Width"
      labelFor="captions-width"
    >
      <Slider
        id="captions-width"
        labelRenderer={renderLabel}
        labelStepSize={10}
        max={CAPTIONS_SIZE.maxWidth}
        min={CAPTIONS_SIZE.minWidth}
        onChange={onSliderChange}
        value={captionsWidth}
      />
    </FormGroup>
  )
}
