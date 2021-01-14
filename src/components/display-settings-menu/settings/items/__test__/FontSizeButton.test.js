import { fireEvent } from '@testing-library/react'
import React from 'react'

import FontSizeOptions from '../FontSizeOptions'

import { renderWithRedux } from '@/setupTests'

import { TEXT_SIZES } from '@/utils/Constants'


describe('fontSizeOptions', () => {
  test('renders 3 buttons', () => {
    const { queryByText } = renderWithRedux(
      <FontSizeOptions />,
    )

    expect(queryByText('Small Text')).toBeInTheDocument()
    expect(queryByText('Medium Text')).toBeInTheDocument()
    expect(queryByText('Large Text')).toBeInTheDocument()
  })

  test('clicking large text triggers updates state', () => {
    const { getByText, store } = renderWithRedux(
      <FontSizeOptions />,
    )

    fireEvent.click(getByText('Large Text'))
    const { configSettings: { size } } = store.getState()

    expect(size).toStrictEqual(TEXT_SIZES.LARGE)
  })

  test('clicking medium text triggers updates state', () => {
    const { getByText, store } = renderWithRedux(
      <FontSizeOptions />,
    )

    fireEvent.click(getByText('Medium Text'))
    const { configSettings: { size } } = store.getState()

    expect(size).toStrictEqual(TEXT_SIZES.MEDIUM)
  })

  test('clicking small text triggers updates state', () => {
    const { getByText, store } = renderWithRedux(
      <FontSizeOptions />,
    )

    fireEvent.click(getByText('Small Text'))
    const { configSettings: { size } } = store.getState()

    expect(size).toStrictEqual(TEXT_SIZES.SMALL)
  })
})
