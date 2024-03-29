import { useCallback } from 'react'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'

export function useShallowEqualSelector(selector) {
  return useSelector(selector, shallowEqual)
}

export function useReduxCallbackDispatch(action) {
  const dispatch = useDispatch()

  return useCallback(() => dispatch(action), [dispatch, action])
}
