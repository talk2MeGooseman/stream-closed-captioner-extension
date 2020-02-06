/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Provider, useDispatch, useSelector, useStore } from 'react-redux'
import { SECOND, CONTEXT_EVENTS_WHITELIST } from '@/utils/Constants'
import Authentication from '../Authentication/Authentication'
import { updateCCText } from '@/redux/captionsSlice'
import { updateBroadcasterSettings, loadLocalStorageSettings } from '@/redux/settingsSlice'
import { requestTranslationStatus } from '@/redux/translationSlice'
import { updateVideoPlayerContext } from '@/redux/videoPlayerContextSlice'
import {
  setProducts,
  completeBitsTransaction,
  setChannelId,
  cancelUseBits,
} from '@/redux/productsSlice'
import { TranslationsDrawer } from '@/components/TranslationDrawer'
import { useReduxCallbackDispatch } from '@/redux/redux-helpers'

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

export default function withTwitchData(WrappedComponent, store) {
  function TwitchWrapper() {
    const [ready, setReady] = useState(false)
    const authenticationRef = useRef(null)
    const twitchRef = useRef(null)
    const dispatch = useDispatch()
    const store = useStore()

    const onLoadLocalStorageSettings = useReduxCallbackDispatch(loadLocalStorageSettings())
    const fetchTranslationStatus = useReduxCallbackDispatch(requestTranslationStatus())
    const onCancelUseBits = useReduxCallbackDispatch(cancelUseBits())
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
    const onUpdateBroadcasterSettings = useCallback(
      (settings) => dispatch(updateBroadcasterSettings(settings)),
      [dispatch],
    )
    const onSetProducts = useCallback((products) => dispatch(setProducts(products)), [dispatch])
    const onCompleteTransaction = useCallback(
      (transaction) => dispatch(completeBitsTransaction(transaction)),
      [dispatch],
    )
    const onChannelIdReceived = useCallback((channelId) => dispatch(setChannelId(channelId)), [
      dispatch,
    ])

    const onAuthorized = useCallback(
      (auth) => {
        onChannelIdReceived(auth.channelId)
        authenticationRef.current.setToken(auth.token, auth.userId)
        fetchTranslationStatus()
      },
      [fetchTranslationStatus, onChannelIdReceived],
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

    const pubSubMessageHandler = (target, contentType, message) => {
      const { videoPlayerContext } = store.getState()

      let parsedMessage
      try {
        parsedMessage = JSON.parse(message)
      } catch (error) {
        parsedMessage = {
          interim: message,
        }
      }

      let delayTime = videoPlayerContext.hlsLatencyBroadcaster * SECOND
      if (message.delay) {
        delayTime -= message.delay * SECOND
      }

      setTimeout(() => {
        onUpdateCCText(parsedMessage)
      }, delayTime)
    }

    useEffect(() => {
      authenticationRef.current = new Authentication()
      twitchRef.current = window.Twitch ? window.Twitch.ext : null

      if (twitchRef.current) {
        // TODO: Comment out below when releasing
        twitchRef.current.bits.setUseLoopback = true

        twitchRef.current.onAuthorized(onAuthorized)
        twitchRef.current.onContext(contextUpdate)
        twitchRef.current.configuration.onChanged(setConfigurationSettings)
        twitchRef.current.listen('broadcast', pubSubMessageHandler)
        twitchRef.current.bits.getProducts().then(onSetProducts)
        twitchRef.current.bits.onTransactionComplete(onCompleteTransaction)
        twitchRef.current.bits.onTransactionCancelled(onCancelUseBits)
      }

      return () => {
        if (twitchRef.current) {
          twitchRef.current.unlisten('broadcast', () => null)
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
