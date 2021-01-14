import { fireEvent } from '@testing-library/react'
import React from 'react'

import UppercaseTextOptionButton from '../UppercaseTextOptionButton'

import { renderWithRedux } from '@/setupTests'


describe('uppercaseTextOptionButton', () => {
  test('renders reset button', () => {
    const { queryByText } = renderWithRedux(
      <UppercaseTextOptionButton />,
    )

    expect(queryByText('Uppercase All Text')).toBeInTheDocument()
  })

  test('triggers reset on click', () => {
    const { queryByText, store } = renderWithRedux(
      <UppercaseTextOptionButton />,
    )

    const { configSettings: defaultSetting } = store.getState()

    expect(defaultSetting.uppercaseText).toStrictEqual(false)

    fireEvent.click(queryByText('Uppercase All Text'))

    const { configSettings: newConfigs } = store.getState()

    expect(newConfigs.uppercaseText).toStrictEqual(true)
  })
})
