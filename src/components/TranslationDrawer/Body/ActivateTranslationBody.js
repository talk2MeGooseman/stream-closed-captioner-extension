/* eslint-disable max-len */
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Button, Classes, MenuItem, Divider,
} from '@blueprintjs/core'
import { Select } from '@blueprintjs/select'
import { useBits, setSelectedProduct } from '@/redux/productsSlice'
import { productMenuItemRenderer } from './ProductMenuItem'

function ActivateTranslationBody({
  translationInfo: { activationInfo },
  productsCatalog,
  onUseBits,
  onProductSelect,
}) {
  let buttonCopy = productsCatalog.products[0].displayName
  if (productsCatalog.selectedProduct) {
    buttonCopy = productsCatalog.selectedProduct.displayName
  }

  const languageList = useMemo(() => {
    const languageKeys = Object.keys(activationInfo.languages)
    return languageKeys.map((langKey) => <li key={langKey}>{activationInfo.languages[langKey]}</li>)
  }, [activationInfo.languages])

  return (
    <div data-testid="activate-translation" className={Classes.DIALOG_BODY}>
      <p>Turn on <b>Translated Closed Captions</b> for everyone in the channel for <b>1 or more stream days</b>.</p>
      <p><i>A stream day is a 24 hours of active translations from the moment the broadcaster turns on Stream Closed Captioner</i></p>
      <p>Once <b>Translated Closed Captions</b> is turned on you and everyone in the channel can enjoy reading closed captions in a select number of languages.</p>
      <p>Current languages supported:</p>
      <ul>
        { languageList }
      </ul>
      <p>Select how may stream days you would like to have <b>Translated Closed Captions</b> on for below.</p>
      <Select
        items={productsCatalog.products}
        filterable={false}
        itemRenderer={productMenuItemRenderer}
        noResults={<MenuItem disabled={true} text="Not found." />}
        onItemSelect={(product) => onProductSelect(product)}>
        <Button text={buttonCopy} rightIcon="double-caret-vertical" />
      </Select>
      <Divider />
      <Button intent="success" icon="confirm" onClick={() => onUseBits(productsCatalog.selectedProduct.sku)}>
        Submit
      </Button>
    </div>
  )
}

ActivateTranslationBody.propTypes = {
  translationInfo: PropTypes.object.isRequired,
  productsCatalog: PropTypes.shape({
    products: PropTypes.array,
    selectedProduct: PropTypes.object,
  }),
  onUseBits: PropTypes.func,
  onProductSelect: PropTypes.func,
}

const mapStateToProps = (state) => ({
  translationInfo: state.translationInfo,
  productsCatalog: state.productsCatalog,
})

const mapDispatchToProps = (dispatch) => ({
  // eslint-disable-next-line react-hooks/rules-of-hooks
  onUseBits: (sku) => dispatch(useBits(sku)),
  onProductSelect: (product) => dispatch(setSelectedProduct(product)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActivateTranslationBody)