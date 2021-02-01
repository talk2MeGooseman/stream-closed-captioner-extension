import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import {
  useCaptionsHandler,
  useOnAuthorization,
  useContextUpdateHandler,
  useConfigurationSettingUpdater,
} from './hooks'
import { completeBitsTransaction, setProducts } from './redux/products-slice'

import { TranslationsDrawer } from '@/components/TranslationDrawer'

// Resub - rw_grim
//

export function TwitchExtension({ children }) {
  const twitch = window?.Twitch?.ext
  const [ready, setReady] = useState(false)
  const dispatch = useDispatch()
  // Authentication = new Authentication()

  const onSetProducts = useCallback(
    (products) => dispatch(setProducts(products)),
    [dispatch],
  )
  const onCompleteTransaction = useCallback(
    (transaction) => dispatch(completeBitsTransaction(transaction)),
    [dispatch],
  )

  const pubSubMessageHandler = useCaptionsHandler()
  const onAuthorized = useOnAuthorization()
  const contextUpdate = useContextUpdateHandler()
  const setConfigurationSettings = useConfigurationSettingUpdater(
    twitch,
    setReady,
  )

  // eslint-disable-next-line no-warning-comments
  // TODO: Uncomment to test with bits locally
  // twitch.bits.setUseLoopback = true;

  useEffect(() => {
    twitch.onAuthorized(onAuthorized)
  }, [onAuthorized, twitch])

  useEffect(() => {
    if (!twitch) {
      return null
    }

    twitch.onContext(contextUpdate)
    twitch.configuration.onChanged(setConfigurationSettings)
    twitch.bits.getProducts().then(onSetProducts)
    twitch.bits.onTransactionComplete(onCompleteTransaction)
    twitch.listen('broadcast', pubSubMessageHandler)
    return () => {
      if (twitch) {
        twitch.unlisten('broadcast', pubSubMessageHandler)
      }
    }
  }, [
    contextUpdate,
    onCompleteTransaction,
    onSetProducts,
    pubSubMessageHandler,
    setConfigurationSettings,
    twitch,
  ])

  return ready ? (
    <>
      <TranslationsDrawer />
      {children}
    </>
  ) : null
}
