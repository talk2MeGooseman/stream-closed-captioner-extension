import { T } from 'ramda'
import React from 'react'

import ProductMenuItem from '../ProductMenuItem'

import { renderWithRedux } from '@/setupTests'


const product = {
  cost: {
    amount: 100,
  },
  displayName: 'One Day Translation',
  sku: 'translate500',
}

const modifier = {
  active: false,
}

describe('productMenuItem', () => {
  test('display product info', () => {
    const { queryByText } = renderWithRedux(
      <ProductMenuItem handleClick={T} modifiers={modifier} product={product} />,
    )

    expect(queryByText(product.displayName)).toBeInTheDocument()
  })
})
