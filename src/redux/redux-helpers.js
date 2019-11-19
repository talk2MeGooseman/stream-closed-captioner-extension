import { useCallback } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

export function useShallowEqualSelector(selector) {
  return useSelector(selector, shallowEqual);
}

export function useCallbackDispatch(action) {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(action), [dispatch, action]);
}

export default {
  useShallowEqualSelector,
  useCallbackDispatch,
};
