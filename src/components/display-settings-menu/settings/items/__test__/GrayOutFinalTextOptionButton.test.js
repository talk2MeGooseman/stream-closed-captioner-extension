import { cleanup, fireEvent } from '@testing-library/react'
import React from 'react'

import GrayOutFinalTextOptionButton from '../GrayOutFinalTextOptionButton'

import { renderWithRedux } from '@/setupTests'


afterEach(cleanup)

describe('GrayOutFinalTextOptionButton ', () => {
  it('renders reset button', () => {
    const { queryByText } = renderWithRedux(
      <GrayOutFinalTextOptionButton />,
    )

    expect(queryByText('Gray Out Finished Text')).toBeInTheDocument()
  })

  it('triggers reset on click', () => {
    const { queryByText, store } = renderWithRedux(
      <GrayOutFinalTextOptionButton />,
    )

    const { configSettings: defaultSetting } = store.getState()

    expect(defaultSetting.grayOutFinalText).toEqual(false)
    fireEvent.click(queryByText('Gray Out Finished Text'))
    const { configSettings: newConfigs } = store.getState()

    expect(newConfigs.grayOutFinalText).toEqual(true)
  })
})
