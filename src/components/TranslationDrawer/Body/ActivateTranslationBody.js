import {
  Button, Classes, MenuItem, Divider,
} from '@blueprintjs/core'
import { Select } from '@blueprintjs/select'
import React, { useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { productMenuItemRenderer } from './ProductMenuItem'

import { useBits, setSelectedProduct } from '@/redux/products-slice'

import { useShallowEqualSelector } from '@/redux/redux-helpers'

function ActivateTranslationBody() {
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

  const currentLanguage = useShallowEqualSelector(
    (state) => state.configSettings.language,
  )

  let buttonCopy = productsCatalog.products[0].displayName

  if (productsCatalog.selectedProduct) {
    buttonCopy = productsCatalog.selectedProduct.displayName
  }

  const languageList = useMemo(() => {
    const [currentLanguageKey] = currentLanguage.split('-')
    const languageKeys = Object.keys(activationInfo.languages).filter((langKey) => langKey !== currentLanguageKey)

    return languageKeys.map((langKey) => <li key={langKey}>{activationInfo.languages[langKey]}</li>)
  }, [activationInfo.languages, currentLanguage])

  return (
    <div className={Classes.DIALOG_BODY} data-testid="activate-translation">
      <p>Turn on <b>Translated Closed Captions</b> for everyone in the channel for <b>1 or more stream days</b>.</p>
      <p><i>A stream day is a 24 hours of active translations from the moment the broadcaster turns on Stream Closed Captioner</i></p>
      <p>Once <b>Translated Closed Captions</b> is turned on you and everyone in the channel can enjoy reading closed captions in a select number of languages.</p>
      <p>Current languages supported:</p>
      <ul>
        { languageList }
      </ul>
      <p>Note: Captions are free for the streamer native language.</p>
      <p>Select how may stream days you would like to have <b>Translated Closed Captions</b> on for below.</p>
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

export default ActivateTranslationBody
