import { useCallback } from 'react'
import { useSelector, shallowEqual, useDispatch, useStore } from 'react-redux'
import { pick } from 'lodash'
import { WHITE_LISTED_VIEWER_SETTINGS } from './settingsSlice'
import { setLocalStorageJson } from '@/utils/BrowserStorage'

function whiteListedViewerSettings(data) {
  return pick(data, WHITE_LISTED_VIEWER_SETTINGS)
}

export function useShallowEqualSelector(selector) {
  return useSelector(selector, shallowEqual)
}

export function useReduxCallbackDispatch(action) {
  const dispatch = useDispatch()
  const store = useStore()

  return useCallback(() => {
    dispatch(action)
    const { configSettings } = store.getState()
    setLocalStorageJson('viewerSettings', whiteListedViewerSettings(configSettings))
  }, [dispatch, action, store])
}
