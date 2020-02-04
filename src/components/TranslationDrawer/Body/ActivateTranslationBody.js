/* eslint-disable max-len */
import React, { useMemo, useCallback } from 'react'
import { Button, Classes, MenuItem, Divider } from '@blueprintjs/core'
import { Select } from '@blueprintjs/select'
import { useBits, setSelectedProduct } from '@/redux/productsSlice'
import { productMenuItemRenderer } from './ProductMenuItem'
import { useShallowEqualSelector, useReduxCallbackDispatch } from '@/redux/redux-helpers'

function ActivateTranslationBody() {
  const { activationInfo } = useShallowEqualSelector((state) => state.translationInfo)
  const { products, selectedProduct } = useShallowEqualSelector((state) => state.productsCatalog)

  const onUseBits = useReduxCallbackDispatch(useBits())
  const onProductSelect = useReduxCallbackDispatch(setSelectedProduct())

  let buttonCopy = products[0].displayName
  if (selectedProduct) {
    buttonCopy = selectedProduct.displayName
  }

  const languageList = useMemo(() => {
    const languageKeys = Object.keys(activationInfo.languages)
    return languageKeys.map((langKey) => <li key={langKey}>{activationInfo.languages[langKey]}</li>)
  }, [activationInfo.languages])

  const onClick = useCallback(() => onUseBits(selectedProduct.sku), [onUseBits, selectedProduct])

  return (
    <div data-testid="activate-translation" className={Classes.DIALOG_BODY}>
      <p>
        Turn on <b>Translated Closed Captions</b> for everyone in the channel for{' '}
        <b>1 or more stream days</b>.
      </p>
      <p>
        <i>
          A stream day is a 24 hours of active translations from the moment the broadcaster turns on
          Stream Closed Captioner
        </i>
      </p>
      <p>
        Once <b>Translated Closed Captions</b> is turned on you and everyone in the channel can
        enjoy reading closed captions in a select number of languages.
      </p>
      <p>Current languages supported:</p>
      <ul>{languageList}</ul>
      <p>
        Select how may stream days you would like to have <b>Translated Closed Captions</b> on for
        below.
      </p>
      <Select
        items={products}
        filterable={false}
        itemRenderer={productMenuItemRenderer}
        noResults={<MenuItem disabled={true} text="Not found." />}
        onItemSelect={(product) => onProductSelect(product)}
      >
        <Button text={buttonCopy} rightIcon="double-caret-vertical" />
      </Select>
      <Divider />
      <Button intent="success" icon="confirm" onClick={onClick}>
        Submit
      </Button>
    </div>
  )
}

export default ActivateTranslationBody
