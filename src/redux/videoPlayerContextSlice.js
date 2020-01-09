import { createSlice } from '@reduxjs/toolkit'

const videoPlayerContextSlice = createSlice({
  name: 'videoPlayerContext',
  initialState: {},
  reducers: {
    updateVideoPlayerContext(state, action) {
      const playerContext = action.payload
      Object.keys(playerContext).forEach((key) => {
        // eslint-disable-next-line no-param-reassign
        state[key] = playerContext[key]
      })
    },
  },
})

export const { updateVideoPlayerContext } = videoPlayerContextSlice.actions

export default videoPlayerContextSlice.reducer
