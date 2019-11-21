/* eslint-disable import/no-extraneous-dependencies */
import { combineReducers } from 'redux';
import ccState from '@/redux/cc-state';
import settingsSlice from '@/redux/settingsSlice';
import videoPlayerContextReducer from '@/redux/videoPlayerContextSlice';
import productsCatalog from '@/redux/products-catalog-action-reducers';

const streamCC = combineReducers({
  ccState,
  configSettings: settingsSlice,
  videoPlayerContext: videoPlayerContextReducer,
  productsCatalog,
});

export default streamCC;
