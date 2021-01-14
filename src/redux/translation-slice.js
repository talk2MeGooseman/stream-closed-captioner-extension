import { createSlice } from '@reduxjs/toolkit'

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

export function requestTranslationStatus() {
  return function thunk(dispatch, getState) {
    dispatch(requestingTranslationStatus())

    const { channelId } = getState().productsCatalog

    return fetch(`https://stream-cc.gooseman.codes/api/translation_status/${channelId}`, {
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(doneRequestingTranslationStatus(data))
      })
  }
}
