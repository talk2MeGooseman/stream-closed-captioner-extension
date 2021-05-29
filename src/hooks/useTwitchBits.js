import { useState, useEffect } from 'react'

export const useTwitchBits = (onComplete) => {
  const [products, setProducts] = useState({})

  const itsTwitch = window.Twitch?.ext
  useEffect(() => {
    if (itsTwitch) {
      itsTwitch.configuration.onChanged(() => {
        const { getProducts, onTransactionComplete } = itsTwitch.bits

        getProducts().then(setProducts)
        onTransactionComplete(onComplete)
      })
    }
  }, [onComplete, itsTwitch])

  return { products }
}
