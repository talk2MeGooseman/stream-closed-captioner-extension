import { cleanup } from '@testing-library/react'
import React from 'react'

import ProductMenuItem from '../ProductMenuItem'

import { renderWithRedux } from '@/setupTests'


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
      <ProductMenuItem handleClick={() => {}} modifiers={modifier} product={product} />,
    )

    expect(queryByText(product.displayName)).toBeInTheDocument()
  })
})
