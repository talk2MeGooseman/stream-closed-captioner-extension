import {
  Button, Classes, Divider, MenuItem
} from '@blueprintjs/core'
import { Select } from '@blueprintjs/select'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { productMenuItemRenderer } from './ProductMenuItem'

import { setSelectedProduct, useBits } from '@/redux/products-slice'

import { useShallowEqualSelector } from '@/redux/redux-helpers'

import { useLanguageList } from '@/shared/hooks'

import { TRANSLATION_COST } from '@/utils/Constants'







// eslint-disable-next-line complexity
function NagStreamerBody() {
  const dispatch = useDispatch()
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const onUseBits = useCallback((sku) => dispatch(useBits(sku)), [dispatch])
  const onProductSelect = useCallback((product) => dispatch(setSelectedProduct(product)), [dispatch])

  const activationInfo = useShallowEqualSelector(
    (state) => state.translationInfo.activationInfo,
  )
  const productsCatalog = useShallowEqualSelector(
    (state) => state.productsCatalog,
  )

  const languageList = useLanguageList()

  let buttonCopy = productsCatalog.products[0].displayName

  if (productsCatalog.selectedProduct) {
    buttonCopy = productsCatalog.selectedProduct.displayName
  }


  let extraBitsBalanceInfo = (
    <>
      <p>But there are enough bits purchased to turn on translations for <b>{Math.floor(activationInfo.balance / TRANSLATION_COST)} stream day(s)</b>.</p>
      <p><i>A stream day is a 24 hours of active translations from the moment the broadcaster turns on Stream Closed Captioner</i></p>
    </>
  )

  if (activationInfo.activated) {
    extraBitsBalanceInfo = null
  }

  return (
    <div className={Classes.DIALOG_BODY} data-testid="nag-streamer">
      <p>The broadcaster currently does not have <b>Stream Closed Captioner</b> turned on.</p>
      { activationInfo.activated && extraBitsBalanceInfo }
      <p>Let the broadcaster know you would like them to turn on <b>Stream Closed Captioner</b> so you can see <b>Translated Closed Captions</b> by visiting <a href="https://stream-cc.gooseman.codes">https://stream-cc.gooseman.codes</a></p>
      <p>Current languages supported:</p>
      <ul>
        {languageList.map((language) => (
          <li key={language.locale}>{language.name}</li>
        ))}
      </ul>
      <p>You can add more translation stream days by selecting an option below and click Submit.</p>
      <Select
        filterable={false}
        itemRenderer={productMenuItemRenderer}
        items={productsCatalog.products}
        noResults={<MenuItem disabled text="Not found." />}
        onItemSelect={(product) => onProductSelect(product)}>
        <Button rightIcon="double-caret-vertical" text={buttonCopy} />
      </Select>
      <Divider />
      <Button icon="confirm" intent="success" onClick={() => onUseBits(productsCatalog.selectedProduct.sku)}>
          Submit
      </Button>
    </div>
  )
}

export default NagStreamerBody
