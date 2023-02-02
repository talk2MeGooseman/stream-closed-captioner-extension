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
    () => dispatch(requestTranslationStatus()),
    [dispatch],
  )

  return useCallback(
    (auth) => {
      onChannelIdReceived(auth.channelId)
      fetchTranslationStatus()
    },
    [fetchTranslationStatus, onChannelIdReceived],
  )
}
