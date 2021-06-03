import { FormGroup } from '@blueprintjs/core'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { useShallowEqualSelector } from '@/redux/redux-helpers'
import { captionsColor } from '@/redux/selectors'

import { changeColor } from '@/redux/settings-slice'

import { CompactPicker } from 'react-color'

export const CaptionsColorPicker = () => {
  const dispatch = useDispatch()
  const color = useShallowEqualSelector(captionsColor)
  const onColorChange = useCallback(
    ({ hex }) => {
      dispatch(changeColor(hex))
    },
    [dispatch],
  )

  return (
    <FormGroup
      helperText="Change the color of the captions text."
      label="Captions Text Color"
      labelFor="captions-color"
    >
      <CompactPicker color={color} onChangeComplete={onColorChange} />
    </FormGroup>
  )
}
