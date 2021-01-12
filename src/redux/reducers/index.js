/* eslint-disable import/no-extraneous-dependencies */
import { combineReducers } from 'redux'
import captionsSlice from '@/redux/captions-slice'
import settingsSlice from '@/redux/settings-slice'
import videoPlayerContextReducer from '@/redux/videoPlayerContextSlice'
import productsSlice from '@/redux/products-slice'
import translationSlice from '@/redux/translation-slice'

const streamCC = combineReducers({
  captionsState: captionsSlice,
  configSettings: settingsSlice,
  videoPlayerContext: videoPlayerContextReducer,
  productsCatalog: productsSlice,
  translationInfo: translationSlice,
})

export default streamCC
