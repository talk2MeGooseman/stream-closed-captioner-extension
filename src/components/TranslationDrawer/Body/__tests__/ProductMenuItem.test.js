import React from 'react'
import { cleanup } from '@testing-library/react'
import { renderWithRedux } from '@/setupTests'
import ProductMenuItem from '../ProductMenuItem'

afterEach(cleanup)

const product = {
  sku: 'translate500',
  displayName: 'One Day Translation',
  cost: {
    amount: 100,
  },
}

const modifier = {
  active: false,
}

describe('ProductMenuItem', () => {
  it('display product info', () => {
    const { queryByText } = renderWithRedux(
      <ProductMenuItem product={product} modifiers={modifier} handleClick={() => {}} />,
    )

    expect(queryByText(product.displayName)).toBeInTheDocument()
  })
})
