/* eslint-disable import/no-extraneous-dependencies */
import { combineReducers } from 'redux'

import captionsSlice from '@/redux/captions-slice'

import productsSlice from '@/redux/products-slice'

import settingsSlice from '@/redux/settings-slice'

import translationSlice from '@/redux/translation-slice'

import videoPlayerContextReducer from '@/redux/video-player-context-slice'

const streamCC = combineReducers({
  captionsState: captionsSlice,
  configSettings: settingsSlice,
  videoPlayerContext: videoPlayerContextReducer,
  productsCatalog: productsSlice,
  translationInfo: translationSlice,
})

export default streamCC
