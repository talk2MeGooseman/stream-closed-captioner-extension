import { useShallowEqualSelector } from '@/redux/redux-helpers'
import { Slider, FormGroup } from '@blueprintjs/core'
import React, { useCallback } from 'react'
import { changeCaptionsTransparency } from '@/redux/settingsSlice'
import { useDispatch } from 'react-redux'
import { isVideoOverlay } from '@/helpers/video-helpers'
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
        min={CAPTIONS_TRANSPARENCY.min}
        max={CAPTIONS_TRANSPARENCY.max}
        labelStepSize={CAPTIONS_TRANSPARENCY.step}
        labelRenderer={renderLabel}
        value={captionsTransparency}
        onChange={onSliderChange}
      />
    </FormGroup>
  )
}
