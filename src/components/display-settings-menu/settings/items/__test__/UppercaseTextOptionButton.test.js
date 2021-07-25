import { fireEvent, screen } from '@testing-library/react'
import React from 'react'

import UppercaseTextOptionButton from '../UppercaseTextOptionButton'

import { renderWithRedux } from '@/setupTests'

describe('uppercaseTextOptionButton', () => {
  test('renders reset button', () => {
    renderWithRedux(<UppercaseTextOptionButton />)

    expect(screen.queryByText('Uppercase All Text')).toBeInTheDocument()
  })

  test('triggers reset on click', () => {
    const { store } = renderWithRedux(<UppercaseTextOptionButton />)

    const { configSettings: defaultSetting } = store.getState()

    expect(defaultSetting.textUppercase).toStrictEqual(false)

    fireEvent.click(screen.queryByText('Uppercase All Text'))

    const { configSettings: newConfigs } = store.getState()

    expect(newConfigs.textUppercase).toStrictEqual(true)
  })
})
