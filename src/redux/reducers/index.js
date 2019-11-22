/* eslint-disable import/no-extraneous-dependencies */
import { combineReducers } from 'redux';
import ccState from '@/redux/cc-state';
import settingsSlice from '@/redux/settingsSlice';
import videoPlayerContextReducer from '@/redux/videoPlayerContextSlice';
import productsSlice from '@/redux/productsSlice';
import translationSlice from '@/redux/translationSlice';

const streamCC = combineReducers({
  ccState,
  configSettings: settingsSlice,
  videoPlayerContext: videoPlayerContextReducer,
  productsCatalog: productsSlice,
  translationInfo: translationSlice,
});

export default streamCC;
