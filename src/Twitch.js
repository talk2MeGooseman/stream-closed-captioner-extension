import React, { useMemo, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { isNil, isEmpty } from 'ramda'
import {
  useTwitchAuth,
  useTwitchBits,
  useTwitchContext,
  useTwitchConfig,
} from './hooks'
import Authentication from './utils/Authentication'

import { updateBroadcasterSettings } from '@/redux/settings-slice'
import {
  stopCaptionsSubscription,
  subscribeToCaptions,
} from '@/redux/captions-slice'
import { updateVideoPlayerContext } from '@/redux/video-player-context-slice'
import {
  completeBitsTransaction,
  setChannelId,
  setProducts,
} from './redux/products-slice'
import { requestTranslationStatus } from '@/redux/translation-slice'
import { useShallowEqualSelector } from './redux/redux-helpers'
import { isVideoOverlay } from './helpers/video-helpers'

export const Twitch = React.memo(function Twitch({ children }) {
  const dispatch = useDispatch()
  const authentication = useMemo(() => new Authentication(), [])
  const { token, userId, channelId } = useTwitchAuth()
  const { broadcastConfig, features } = useTwitchConfig()

  const updateChannelId = useCallback(
    (state) => dispatch(setChannelId(state)),
    [dispatch],
  )

  const updateProducts = useCallback(
    (state) => dispatch(setProducts(state)),
    [dispatch],
  )

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

  // Set configuration settings
  useEffect(() => {
    setBroadcasterSettings({
      ...broadcastConfig,
      isBitsEnabled: features?.isBitsEnabled,
    })
  }, [broadcastConfig, features?.isBitsEnabled, setBroadcasterSettings])

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
    }
  }, [channelId, fetchTranslationStatus])

  const isCaptionsHidden = useShallowEqualSelector(
    (state) => state.configSettings.hideCC,
  )

  useEffect(() => {
    if (isCaptionsHidden && isVideoOverlay()) {
      dispatch(stopCaptionsSubscription())
    } else {
      subscribeCaptions(channelId)
    }
  }, [channelId, dispatch, isCaptionsHidden, subscribeCaptions])

  return children
})

Twitch.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
}
