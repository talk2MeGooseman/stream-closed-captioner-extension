import {
  MenuItem,
} from '@blueprintjs/core'
import PropTypes from 'prop-types'
import React from 'react'

export function productMenuItemRenderer(product, { handleClick, modifiers }) {
  return <ProductMenuItem
    handleClick={handleClick}
    key={product.sku}
    modifiers={modifiers}
    product={product}
  />
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
  modifiers: PropTypes.shape({
    active: PropTypes.bool.isRequired,
  }),
  product: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    handleClick: PropTypes.func.isRequired,
    sku: PropTypes.string.isRequired,
    // eslint-disable-next-line sort-keys
    cost: PropTypes.shape({
      amount: PropTypes.number.isRequired,
    }),
  }),
}

export default ProductMenuItem
