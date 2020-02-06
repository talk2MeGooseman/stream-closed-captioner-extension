/* eslint-disable max-len */
import React, { useMemo, useCallback } from 'react'
import { Button, MenuItem, Divider, Classes } from '@blueprintjs/core'
import { Select } from '@blueprintjs/select'
import { useDispatch } from 'react-redux'
import { useBits, setSelectedProduct } from '@/redux/productsSlice'
import { TRANSLATION_COST } from '@/utils/Constants'
import { productMenuItemRenderer } from './ProductMenuItem'
import { useShallowEqualSelector } from '@/redux/redux-helpers'

function NagStreamerBody() {
  const dispatch = useDispatch()
  const { activationInfo } = useShallowEqualSelector((state) => state.translationInfo)
  const { products, selectedProduct } = useShallowEqualSelector((state) => state.productsCatalog)

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const onUseBits = useCallback((sku) => dispatch(useBits(sku)), [dispatch])
  const onProductSelect = useCallback((product) => dispatch(setSelectedProduct(product)), [
    dispatch,
  ])

  let buttonCopy = products[0].displayName
  if (selectedProduct) {
    buttonCopy = selectedProduct.displayName
  }

  const onClick = useCallback(() => onUseBits(selectedProduct.sku), [onUseBits, selectedProduct])
  window.Twitch.ext.bits.showBitsBalance()

  const languageList = useMemo(() => {
    const languageKeys = Object.keys(activationInfo.languages)
    return languageKeys.map((langKey) => <li key={langKey}>{activationInfo.languages[langKey]}</li>)
  }, [activationInfo.languages])

  return (
    <div data-testid="nag-streamer" className={Classes.DIALOG_BODY}>
      {!activationInfo.activated && (
        <p>
          The broadcaster currently does not have <b>Stream Closed Captioner</b> turned on.
        </p>
      )}
      {!activationInfo.balance >= TRANSLATION_COST && (
        <p>
          There are enough bits purchased to turn on translations for{' '}
          <b>{Math.floor(activationInfo.balance / TRANSLATION_COST)} day(s)</b>.
        </p>
      )}
      {!activationInfo.activated && (
        <p>
          Let the broadcaster know you would like them to turn on <b>Stream Closed Captioner</b> so
          you can see <b>Translated Closed Captions</b> by visiting{' '}
          <a href="https://stream-cc.gooseman.codes">https://stream-cc.gooseman.codes</a>
        </p>
      )}
      <p>Current languages supported:</p>
      <ul>{languageList}</ul>
      <p>You can add more translation days by selecting an option below and click Submit.</p>
      <Select
        items={products}
        filterable={false}
        itemRenderer={productMenuItemRenderer}
        noResults={<MenuItem disabled={true} text="Not found." />}
        onItemSelect={onProductSelect}
      >
        <Button text={buttonCopy} rightIcon="double-caret-vertical" />
      </Select>
      <p>
        <i>
          When you add 1 day of translations, Closed Caption translations will be on for the next 24
          hours.
        </i>
      </p>
      <Divider />
      <Button intent="success" icon="confirm" onClick={onClick}>
        Submit
      </Button>
    </div>
  )
}

export default NagStreamerBody
