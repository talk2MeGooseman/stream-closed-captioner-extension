import React from 'react'
import { cleanup, fireEvent } from '@testing-library/react'
import { renderWithRedux } from '@/setupTests'
import UppercaseTextOptionButton from '../UppercaseTextOptionButton'

afterEach(cleanup)

describe('UppercaseTextOptionButton', () => {
  it('renders reset button', () => {
    const { queryByText } = renderWithRedux(
      <UppercaseTextOptionButton />,
    )

    expect(queryByText('Uppercase All Text')).toBeInTheDocument()
  })

  it('triggers reset on click', () => {
    const { queryByText, store } = renderWithRedux(
      <UppercaseTextOptionButton />,
    )

    const { configSettings: defaultSetting } = store.getState()
    expect(defaultSetting.uppercaseText).toEqual(false)

    fireEvent.click(queryByText('Uppercase All Text'))

    const { configSettings: newConfigs } = store.getState()
    expect(newConfigs.uppercaseText).toEqual(true)
  })
})
