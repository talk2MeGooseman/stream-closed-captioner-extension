import React, { useMemo, useEffect, useCallback } from 'react'

import { useDispatch } from 'react-redux'
import { isNil } from 'ramda'
import {
  useTwitchAuth,
  useTwitchBits,
  useTwitchContext,
  useTwitchPubSub,
} from './hooks'
import Authentication from './utils/Authentication'

import { useShallowEqualSelector } from '@/redux/redux-helpers'
import { updateCCText } from '@/redux/captions-slice'
import { updateVideoPlayerContext } from '@/redux/video-player-context-slice'
import {
  completeBitsTransaction,
  setChannelId,
  setProducts,
} from './redux/products-slice'

export const TwitchHOC = ({ children }) => {
  const dispatch = useDispatch()
  const authentication = useMemo(() => new Authentication(), [])

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

  const { token, userId, channelId } = useTwitchAuth()
  const { products } = useTwitchBits(transactionComplete)
  const twitchContext = useTwitchContext()
  useTwitchPubSub(onBroadcast)

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

  return children
}
