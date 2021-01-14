import { fireEvent } from '@testing-library/react'
import React from 'react'

import FontFamilyOptions from '../FontFamilyOptions'

import { renderWithRedux } from '@/setupTests'

describe('fontFamilyOptions', () => {
  test('renders', () => {
    const { queryByText } = renderWithRedux(<FontFamilyOptions />)

    expect(queryByText('Use Dyslexia Font')).toBeInTheDocument()
  })

  test('clicking on dyslexia enables it', () => {
    const { getByText, store } = renderWithRedux(<FontFamilyOptions />)

    const { configSettings: defaultSetting } = store.getState()

    expect(defaultSetting.dyslexiaFontEnabled).toStrictEqual(false)

    fireEvent.click(getByText('Use Dyslexia Font'))

    const { configSettings: newConfigs } = store.getState()

    expect(newConfigs.dyslexiaFontEnabled).toStrictEqual(true)
  })
})
