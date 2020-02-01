import React from 'react'
import PropTypes from 'prop-types'
import { MenuItem } from '@blueprintjs/core'

export function productMenuItemRenderer(product, { handleClick, modifiers }) {
  return (
    <ProductMenuItem
      key={product.sku}
      product={product}
      handleClick={handleClick}
      modifiers={modifiers}
    />
  )
}

const ProductMenuItem = ({ product, handleClick, modifiers }) => (
  <MenuItem
    active={modifiers.active}
    key={product.sku}
    label={`${product.cost.amount} bits`}
    onClick={handleClick}
    text={product.displayName}
  />
)

ProductMenuItem.propTypes = {
  product: PropTypes.shape({
    sku: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    cost: PropTypes.shape({
      amount: PropTypes.number.isRequired,
    }),
  }),
  handleClick: PropTypes.func.isRequired,
  modifiers: PropTypes.shape({
    active: PropTypes.bool.isRequired,
  }),
}

export default ProductMenuItem
