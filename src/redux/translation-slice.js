/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
  activationInfo: null,
}

const settingsSlice = createSlice({
  name: 'settingsSlice',
  initialState,
  reducers: {
    requestingTranslationStatus(state) {
      state.loading = true
    },
    doneRequestingTranslationStatus(state, action) {
      state.loading = false
      state.activationInfo = action.payload
    },
  },
})

export const {
  requestingTranslationStatus,
  doneRequestingTranslationStatus,
} = settingsSlice.actions

export default settingsSlice.reducer

export function requestTranslationStatus() {
  return function thunk(dispatch, getState) {
    dispatch(requestingTranslationStatus())

    const { channelId } = getState().productsCatalog

    return fetch(`https://stream-cc.gooseman.codes/api/translation_status/${channelId}`, {
      cache: 'no-cache',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(doneRequestingTranslationStatus(data))
      })
  }
}
