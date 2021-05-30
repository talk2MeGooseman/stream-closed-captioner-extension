import { useMemo, useEffect, useCallback } from 'react'

import { useDispatch } from 'react-redux'
import { isNil } from 'ramda'
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
import { updateCCText } from '@/redux/captions-slice'
import { updateVideoPlayerContext } from '@/redux/video-player-context-slice'
import {
  completeBitsTransaction,
  setChannelId,
  setProducts,
} from './redux/products-slice'
import { requestTranslationStatus } from '@/redux/translation-slice'

export const TwitchHOC = ({ children }) => {
  const dispatch = useDispatch()
  const authentication = useMemo(() => new Authentication(), [])
  const { token, userId, channelId } = useTwitchAuth()
  const { products } = useTwitchBits(transactionComplete)
  const twitchContext = useTwitchContext()
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

  const transactionComplete = useCallback(
    (state) => dispatch(completeBitsTransaction(state)),
    [dispatch],
  )
  const displayCCText = useCallback((state) => dispatch(updateCCText(state)), [
    dispatch,
  ])

  const fetchTranslationStatus = useCallback(
    (channelId) => dispatch(requestTranslationStatus(channelId)),
    [dispatch],
  )
  const setBroadcasterSettings = useCallback(
    (settings) => dispatch(updateBroadcasterSettings(settings)),
    [dispatch],
  )

  const hlsLatencyBroadcaster = useShallowEqualSelector(
    (state) => state.videoPlayerContext.hlsLatencyBroadcaster,
  )

  const onBroadcast = useCallback(
    (message) => {
      let delayTime = hlsLatencyBroadcaster * 60

      if (message.delay) {
        delayTime -= message.delay * 60
      }

      setTimeout(() => {
        displayCCText(message)
      }, delayTime)
    },
    [displayCCText, hlsLatencyBroadcaster],
  )

  useTwitchPubSub(onBroadcast)

  // Set configuration settings
  useEffect(() => {
    setBroadcasterSettings({
      ...broadcastConfig,
      elixirVersion: globalConfig?.elixirVersion || false,
      isBitsEnabled: features?.isBitsEnabled,
    })
  }, [
    broadcastConfig,
    features?.isBitsEnabled,
    globalConfig?.elixirVersion,
    setBroadcasterSettings,
  ])

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
    updateContext(twitchContext)
  }, [twitchContext, updateContext])

  useEffect(() => {
    if (!isNil(channelId)) {
      fetchTranslationStatus(channelId)
    }
  }, [channelId, fetchTranslationStatus])

  return children
}
