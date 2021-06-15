import React, { useMemo, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { isNil, isEmpty } from 'ramda'
import {
  useTwitchAuth,
  useTwitchBits,
  useTwitchContext,
  useTwitchPubSub,
  useTwitchConfig,
} from './hooks'
import Authentication from './utils/Authentication'

import { updateBroadcasterSettings } from '@/redux/settings-slice'
import { useShallowEqualSelector } from '@/redux/redux-helpers'
import { updateCCText, subscribeToCaptions } from '@/redux/captions-slice'
import { updateVideoPlayerContext } from '@/redux/video-player-context-slice'
import {
  completeBitsTransaction,
  setChannelId,
  setProducts,
} from './redux/products-slice'
import { requestTranslationStatus } from '@/redux/translation-slice'

export const Twitch = React.memo(function Twitch({ children }) {
  const dispatch = useDispatch()
  const authentication = useMemo(() => new Authentication(), [])
  const { token, userId, channelId } = useTwitchAuth()
  const { broadcastConfig, globalConfig, features } = useTwitchConfig()

  const updateChannelId = useCallback(
    (state) => dispatch(setChannelId(state)),
    [dispatch],
  )

  const updateProducts = useCallback((state) => dispatch(setProducts(state)), [
    dispatch,
  ])

  const updateContext = useCallback(
    (state) => dispatch(updateVideoPlayerContext(state)),
    [dispatch],
  )
  useTwitchContext(updateContext)

  const transactionComplete = useCallback(
    (state) => dispatch(completeBitsTransaction(state)),
    [dispatch],
  )
  const { products } = useTwitchBits(transactionComplete)

  const displayCCText = useCallback((state) => dispatch(updateCCText(state)), [
    dispatch,
  ])

  const fetchTranslationStatus = useCallback(
    (channelId) => dispatch(requestTranslationStatus(channelId)),
    [dispatch],
  )
  const subscribeCaptions = useCallback(
    (channelId) => dispatch(subscribeToCaptions(channelId)),
    [dispatch],
  )

  const setBroadcasterSettings = useCallback(
    (settings) => dispatch(updateBroadcasterSettings(settings)),
    [dispatch],
  )

  const hlsLatencyBroadcaster = useShallowEqualSelector(
    (state) => state.videoPlayerContext.hlsLatencyBroadcaster,
  )

  // Set configuration settings
  useEffect(() => {
    setBroadcasterSettings({
      ...broadcastConfig,
      gqlSubscribe: globalConfig?.gqlSubscribe || false,
      isBitsEnabled: features?.isBitsEnabled,
    })
  }, [broadcastConfig, features?.isBitsEnabled, globalConfig?.gqlSubscribe, setBroadcasterSettings])

  useEffect(() => {
    if (token && userId && channelId) {
      authentication.setToken(token, userId)
      updateChannelId(channelId)
    }
  }, [token, userId, channelId, authentication, updateChannelId])

  useEffect(() => {
    if (!isNil(products)) {
      updateProducts(products)
    }
  }, [products, updateProducts])

  useEffect(() => {
    if (!isNil(channelId) && !isEmpty(channelId)) {
      fetchTranslationStatus(channelId)
      // Turn on GQL Subscriptions for caption events
      if (globalConfig?.gqlSubscribe) {
        subscribeCaptions(channelId)
      }
    }
  }, [channelId, fetchTranslationStatus, globalConfig?.gqlSubscribe, subscribeCaptions])

  const onBroadcast = useCallback(
    (message) => {
      // Turn off captions through Twitch PubSub
      if (globalConfig?.gqlSubscribe) return

      let delayTime = hlsLatencyBroadcaster * 60

      if (message.delay) {
        delayTime -= message.delay * 60
      }

      setTimeout(() => {
        displayCCText(message)
      }, delayTime)
    },
    [displayCCText, globalConfig?.gqlSubscribe, hlsLatencyBroadcaster],
  )
  useTwitchPubSub(onBroadcast)

  return children
})

Twitch.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
}
