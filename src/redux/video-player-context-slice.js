import { createSlice } from '@reduxjs/toolkit'

const videoPlayerContextSlice = createSlice({
  initialState: {},
  name: 'videoPlayerContext',
  reducers: {
    updateVideoPlayerContext(state, action) {
      const playerContext = action.payload

      Object.keys(playerContext).forEach((key) => {
        state[key] = playerContext[key]
      })
    },
  },
})

export const { updateVideoPlayerContext } = videoPlayerContextSlice.actions

export default videoPlayerContextSlice.reducer
