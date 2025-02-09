import { Slider, FormGroup } from '@blueprintjs/core'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { isVideoOverlay } from '@/helpers/video-helpers'

import { useShallowEqualSelector } from '@/redux/redux-helpers'

import { changeCaptionsTransparency } from '@/redux/settings-slice'

import { CAPTIONS_TRANSPARENCY } from '@/utils/Constants'

const renderLabel = (val) => `${val}%`

export const CaptionsTransparencySlider = () => {
  const dispatch = useDispatch()
  const captionsTransparency = useShallowEqualSelector(
    (state) => state.configSettings.captionsTransparency,
  )
  const onSliderChange = useCallback(
    (value) => {
      dispatch(changeCaptionsTransparency(value))
    },
    [dispatch],
  )

  if (!isVideoOverlay()) {
    return null
  }

  return (
    <FormGroup
      helperText="Adjust the amount of transparency the background of the Closed Captions."
      label="Transparency of Closed Captions Background"
      labelFor="captions-transparency"
    >
      <Slider
        id="captions-transparency"
        labelRenderer={renderLabel}
        labelStepSize={CAPTIONS_TRANSPARENCY.step}
        max={CAPTIONS_TRANSPARENCY.max}
        min={CAPTIONS_TRANSPARENCY.min}
        onChange={onSliderChange}
        value={captionsTransparency}
      />
    </FormGroup>
  )
}
