/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Provider, useDispatch } from 'react-redux'
import { SECOND, CONTEXT_EVENTS_WHITELIST } from './utils/Constants'
import Authentication from './components/Authentication/Authentication'
import { updateCCText } from './redux/captionsSlice'
import { updateBroadcasterSettings, loadLocalStorageSettings } from '@/redux/settingsSlice'
import { requestTranslationStatus } from '@/redux/translationSlice'
import { updateVideoPlayerContext } from '@/redux/videoPlayerContextSlice'
import { setProducts, completeBitsTransaction, setChannelId } from './redux/productsSlice'
import { TranslationsDrawer } from '@/components/TranslationDrawer'
import { useShallowEqualSelector, useReduxCallbackDispatch } from './redux/redux-helpers'

// Resub - rw_grim
//

function fetchChangedContextValues(context, delta) {
  const newData = {}
  delta.forEach((event) => {
    newData[event] = context[event]
  })

  return newData
}

function contextStateUpdated(delta) {
  return delta.find((event) => CONTEXT_EVENTS_WHITELIST.includes(event))
}

export function withTwitchData(WrappedComponent, store) {
  function TwitchWrapper() {
    const [ready, setReady] = useState(false)
    const authenticationRef = useRef(null)
    const twitchRef = useRef(null)
    const dispatch = useDispatch()

    const onUpdateVideoPlayerContext = useCallback(
      (state) => dispatch(updateVideoPlayerContext(state)),
      [dispatch],
    )
    const onUpdateCCText = useCallback(
      (state) => {
        dispatch(updateCCText(state))
      },
      [dispatch],
    )
    const onUpdateBroadcasterSettings = useReduxCallbackDispatch((settings) =>
      updateBroadcasterSettings(settings),
    )
    const onLoadLocalStorageSettings = useReduxCallbackDispatch(loadLocalStorageSettings())
    const onSetProducts = useReduxCallbackDispatch((products) => setProducts(products))
    const onCompleteTransaction = useReduxCallbackDispatch((transaction) =>
      completeBitsTransaction(transaction),
    )
    const onChannelIdReceived = useReduxCallbackDispatch((channelId) => setChannelId(channelId))
    const fetchTranslationStatus = useReduxCallbackDispatch(requestTranslationStatus())

    const onAuthorized = useCallback(
      (auth) => {
        onChannelIdReceived(auth.channelId)
        authenticationRef.current.setToken(auth.token, auth.userId)
        fetchTranslationStatus()
      },
      [fetchTranslationStatus, onChannelIdReceived],
    )

    const parseProducts = useCallback(
      (products) => {
        onSetProducts(products)
      },
      [onSetProducts],
    )

    const onTransactionComplete = useCallback(
      (transaction) => {
        onCompleteTransaction(transaction)
      },
      [onCompleteTransaction],
    )

    const contextUpdate = useCallback(
      (context, delta) => {
        if (contextStateUpdated(delta)) {
          const newContext = fetchChangedContextValues(context, delta)
          onUpdateVideoPlayerContext(newContext)
        }
      },
      [onUpdateVideoPlayerContext],
    )

    const setConfigurationSettings = useCallback(() => {
      let config = twitchRef.current.configuration.broadcaster
        ? twitchRef.current.configuration.broadcaster.content
        : ''

      try {
        config = JSON.parse(config)
      } catch (e) {
        config = {}
      }

      // Load the setting saved by the broadcaster
      onUpdateBroadcasterSettings({
        ...config,
        isBitsEnabled: twitchRef.current.features.isBitsEnabled,
      })

      // Load the settings that users prefers
      onLoadLocalStorageSettings()

      setReady(true)
    }, [onLoadLocalStorageSettings, onUpdateBroadcasterSettings])

    const { hlsLatencyBroadcaster } = useShallowEqualSelector((state) => state.videoPlayerContext)
    const pubSubMessageHandler = useCallback(
      (target, contentType, message) => {
        let parsedMessage
        try {
          parsedMessage = JSON.parse(message)
        } catch (error) {
          parsedMessage = {
            interim: message,
          }
        }

        let delayTime = hlsLatencyBroadcaster * SECOND
        if (message.delay) {
          delayTime -= message.delay * SECOND
        }

        setTimeout(() => {
          onUpdateCCText(parsedMessage)
        }, delayTime)
      },
      [hlsLatencyBroadcaster, onUpdateCCText],
    )

    useEffect(() => {
      authenticationRef.current = new Authentication()
      twitchRef.current = window.Twitch ? window.Twitch.ext : null

      if (twitchRef.current) {
        // TODO: Comment out below when releasing
        // twitchRef.current.bits.setUseLoopback = true;

        twitchRef.current.onAuthorized(onAuthorized)
        twitchRef.current.onContext(contextUpdate)
        twitchRef.current.configuration.onChanged(setConfigurationSettings)
        twitchRef.current.listen('broadcast', pubSubMessageHandler)
        twitchRef.current.bits.getProducts().then(parseProducts)
        twitchRef.current.bits.onTransactionComplete(onTransactionComplete)
      }

      return () => {
        if (twitchRef.current) {
          twitchRef.current.unlisten('broadcast', () => null)
        }
      }
    }, [
      contextUpdate,
      onAuthorized,
      onTransactionComplete,
      parseProducts,
      pubSubMessageHandler,
      setConfigurationSettings,
    ])

    if (!ready) {
      return null
    }

    return (
      <Provider store={store}>
        <TranslationsDrawer />
        <WrappedComponent />
      </Provider>
    )
  }

  return TwitchWrapper
}
