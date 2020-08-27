import React from 'react'
import { cleanup, fireEvent } from '@testing-library/react'
import { renderWithRedux } from '@/setupTests'
import { TEXT_SIZES } from '@/utils/Constants'
import FontSizeOptions from '../FontSizeOptions'

afterEach(cleanup)

describe('FontSizeOptions', () => {
  it('renders 3 buttons', () => {
    const { queryByText } = renderWithRedux(
      <FontSizeOptions />,
    )

    expect(queryByText('Small Text')).toBeInTheDocument()
    expect(queryByText('Medium Text')).toBeInTheDocument()
    expect(queryByText('Large Text')).toBeInTheDocument()
  })

  it('clicking large text triggers updates state', () => {
    const { getByText, store } = renderWithRedux(
      <FontSizeOptions />,
    )

    fireEvent.click(getByText('Large Text'))
    const { configSettings: { size } } = store.getState()
    expect(size).toEqual(TEXT_SIZES.LARGE)
  })

  it('clicking medium text triggers updates state', () => {
    const { getByText, store } = renderWithRedux(
      <FontSizeOptions />,
    )

    fireEvent.click(getByText('Medium Text'))
    const { configSettings: { size } } = store.getState()
    expect(size).toEqual(TEXT_SIZES.MEDIUM)
  })

  it('clicking small text triggers updates state', () => {
    const { getByText, store } = renderWithRedux(
      <FontSizeOptions />,
    )

    fireEvent.click(getByText('Small Text'))
    const { configSettings: { size } } = store.getState()
    expect(size).toEqual(TEXT_SIZES.SMALL)
  })
})
