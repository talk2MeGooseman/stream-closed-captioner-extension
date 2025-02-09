import { screen } from '@testing-library/react'
import React from 'react'

import { CaptionsColorPicker } from '../CaptionsColorPicker'

import { renderWithRedux } from '@/setupTests'

describe('CaptionsColorPicker', () => {
  test('should be rendered', () => {
    renderWithRedux(<CaptionsColorPicker />)
    expect(
      screen.queryByText('Change the color of the captions text.'),
    ).toBeInTheDocument()
  })

  test('color defaults to white', () => {
    const { store } = renderWithRedux(<CaptionsColorPicker />)

    const { configSettings: defaultSetting } = store.getState()

    expect(defaultSetting.color).toStrictEqual('#ffffff')
  })
})
