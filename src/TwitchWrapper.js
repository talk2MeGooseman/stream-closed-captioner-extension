/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { updateCCText } from './redux/captions-slice'
import {
  completeBitsTransaction,
  setChannelId, setProducts
} from './redux/products-slice'
import { useShallowEqualSelector } from "./redux/redux-helpers"
import { CONTEXT_EVENTS_WHITELIST, SECOND } from './utils/Constants'

import { TranslationsDrawer } from '@/components/TranslationDrawer'

import { updateBroadcasterSettings } from '@/redux/settings-slice'

import { requestTranslationStatus } from '@/redux/translation-slice'

import { updateVideoPlayerContext } from '@/redux/video-player-context-slice'

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

export function TwitchExtension({ children }) {
  const [ready, setReady] = useState(false)
  const dispatch = useDispatch()
  // Authentication = new Authentication()

  const videoPlayerContext = useShallowEqualSelector(
    (state) => state.videoPlayerContext,
  )

  const onUpdateVideoPlayerContext = useCallback((state) => dispatch(updateVideoPlayerContext(state)), [dispatch])
  const onUpdateCCText = useCallback((state) => dispatch(updateCCText(state)), [dispatch])
  const onUpdateBroadcasterSettings = useCallback((settings) => dispatch(updateBroadcasterSettings(settings)), [dispatch])
  const onSetProducts = useCallback((products) => dispatch(setProducts(products)), [dispatch])
  const onCompleteTransaction = useCallback((transaction) => dispatch(completeBitsTransaction(transaction)), [dispatch])
  const onChannelIdReceived = useCallback((channelId) => dispatch(setChannelId(channelId)), [dispatch])
  const fetchTranslationStatus = useCallback(() => dispatch(requestTranslationStatus()), [dispatch])

  useEffect(() => {
    const twitch = window.Twitch ? window.Twitch.ext : null

    if (twitch) {
      const onAuthorized = (auth) => {
        onChannelIdReceived(auth.channelId)
        fetchTranslationStatus()
      }

      const parseProducts = (products) => {
        onSetProducts(products)
      }

      const onTransactionComplete = (transaction) => {
        onCompleteTransaction(transaction)
      }

      const contextUpdate = (context, delta) => {
        if (contextStateUpdated(delta)) {
          const newContext = fetchChangedContextValues(context, delta)

          onUpdateVideoPlayerContext(newContext)
        }
      }

      const setConfigurationSettings = () => {
        let config = twitch.configuration.broadcaster
          ? twitch.configuration.broadcaster.content
          : ''

        try {
          config = JSON.parse(config)
        } catch (e) {
          config = {}
        }

        onUpdateBroadcasterSettings({
          ...config,
          isBitsEnabled: twitch.features.isBitsEnabled,
        })

        setReady(true)
      }

      const displayClosedCaptioningText = (message) => {
        const { hlsLatencyBroadcaster } = videoPlayerContext
        let delayTime = hlsLatencyBroadcaster * SECOND

        if (message.delay) {
          delayTime -= message.delay * SECOND
        }

        setTimeout(() => {
          onUpdateCCText(message)
        }, delayTime)
      }

      const pubSubMessageHandler = (target, contentType, message) => {
        let parsedMessage

        try {
          parsedMessage = JSON.parse(message)
        } catch (error) {
          parsedMessage = {
            interim: message,
          }
        }

        displayClosedCaptioningText(parsedMessage)
      }

      // TODO: Uncomment to test with bits locally
      // twitch.bits.setUseLoopback = true;

      twitch.onAuthorized(onAuthorized)
      twitch.onContext(contextUpdate)
      twitch.configuration.onChanged(setConfigurationSettings)
      twitch.listen('broadcast', pubSubMessageHandler)
      twitch.bits.getProducts().then(parseProducts)
      twitch.bits.onTransactionComplete(onTransactionComplete)
    }

    return () => {
            if (twitch) {
        twitch.unlisten('broadcast', () => null)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!ready) {
    return null
  }

  return (
    <>
      <TranslationsDrawer />
      { children }
    </>
  )
}

