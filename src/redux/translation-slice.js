import { createSlice } from '@reduxjs/toolkit'

import { apolloClient } from '../utils'

import { convertGqlResult, queryGetChannelInfo } from './utils'

const initialState = {
  activationInfo: null,
  loading: false,
}

const settingsSlice = createSlice({
  initialState,
  name: 'settingsSlice',
  reducers: {
    doneRequestingTranslationStatus(state, action) {
      state.loading = false
      state.activationInfo = action.payload
    },
    requestingTranslationStatus(state) {
      state.loading = true
    },
  },
})

export const {
  requestingTranslationStatus,
  doneRequestingTranslationStatus,
} = settingsSlice.actions

export default settingsSlice.reducer

export function requestTranslationStatus(channelId) {
  return function thunk(dispatch, _getState) {
    dispatch(requestingTranslationStatus())

    return apolloClient
      .query({
        query: queryGetChannelInfo,
        variables: { id: channelId },
      })
      .then((result) => {
        const data = convertGqlResult(result)

        dispatch(doneRequestingTranslationStatus(data))
      })
  }
}
