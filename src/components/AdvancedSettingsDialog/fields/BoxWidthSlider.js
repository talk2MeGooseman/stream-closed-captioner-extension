import { useShallowEqualSelector } from '@/redux/redux-helpers'
import { Slider, FormGroup } from '@blueprintjs/core'
import React, { useCallback } from 'react'
import { changeCaptionsWidth } from '@/redux/settingsSlice'
import { useDispatch } from 'react-redux'
import { CAPTIONS_SIZE } from '@/utils/Constants'
import { isVideoOverlay } from '@/helpers/video-helpers'

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
        min={CAPTIONS_SIZE.minWidth}
        max={CAPTIONS_SIZE.maxWidth}
        labelStepSize={10}
        labelRenderer={renderLabel}
        value={captionsWidth}
        onChange={onSliderChange}
      />
    </FormGroup>
  )
}
