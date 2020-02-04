/* eslint-disable max-len */
import React, { useMemo, useCallback } from 'react'
import { Button, MenuItem, Divider, Classes } from '@blueprintjs/core'
import { Select } from '@blueprintjs/select'
import { useBits, setSelectedProduct } from '@/redux/productsSlice'
import { TRANSLATION_COST } from '@/utils/Constants'
import { productMenuItemRenderer } from './ProductMenuItem'
import { useShallowEqualSelector, useReduxCallbackDispatch } from '@/redux/redux-helpers'

function NagStreamerBody() {
  const { activationInfo } = useShallowEqualSelector((state) => state.translationInfo)
  const { products, selectedProduct } = useShallowEqualSelector((state) => state.productsCatalog)

  const onUseBits = useReduxCallbackDispatch(useBits())
  const onProductSelect = useReduxCallbackDispatch(setSelectedProduct())

  let buttonCopy = products[0].displayName
  if (selectedProduct) {
    buttonCopy = selectedProduct.displayName
  }

  const onClick = useCallback(() => onUseBits(selectedProduct.sku), [onUseBits, selectedProduct])

  const languageList = useMemo(() => {
    const languageKeys = Object.keys(activationInfo.languages)
    return languageKeys.map((langKey) => <li key={langKey}>{activationInfo.languages[langKey]}</li>)
  }, [activationInfo.languages])

  return (
    <div data-testid="nag-streamer" className={Classes.DIALOG_BODY}>
      <p>
        The broadcaster currently does not have <b>Stream Closed Captioner</b> turned on.
      </p>
      {!activationInfo.activated && (
        <>
          <p>
            But there are enough bits purchased to turn on translations for{' '}
            <b>{Math.floor(activationInfo.balance / TRANSLATION_COST)} stream day(s)</b>.
          </p>
          <p>
            <i>
              A stream day is a 24 hours of active translations from the moment the broadcaster
              turns on Stream Closed Captioner
            </i>
          </p>
        </>
      )}
      <p>
        Let the broadcaster know you would like them to turn on <b>Stream Closed Captioner</b> so
        you can see <b>Translated Closed Captions</b> by visiting{' '}
        <a href="https://stream-cc.gooseman.codes">https://stream-cc.gooseman.codes</a>
      </p>
      <p>Current languages supported:</p>
      <ul>{languageList}</ul>
      <p>You can add more translation stream days by selecting an option below and click Submit.</p>
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

export default NagStreamerBody
