import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { setChannelId } from '../redux/products-slice'

import { requestTranslationStatus } from '@/redux/translation-slice'

export function useOnAuthorization() {
  const dispatch = useDispatch()

  const onChannelIdReceived = useCallback(
    (channelId) => dispatch(setChannelId(channelId)),
    [dispatch],
  )
  const fetchTranslationStatus = useCallback(
    (channelId) => dispatch(requestTranslationStatus(channelId)),
    [dispatch],
  )

  return useCallback(
    (auth) => {
      onChannelIdReceived(auth.channelId)
      fetchTranslationStatus(auth.channelId)
    },
    [fetchTranslationStatus, onChannelIdReceived],
  )
}
