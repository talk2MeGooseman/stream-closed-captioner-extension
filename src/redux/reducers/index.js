/* eslint-disable import/no-extraneous-dependencies */
import { combineReducers } from 'redux';
import ccState from '../cc-state';
import configSettings from '../config-settings-action-reducer';
import videoPlayerContextReducer from '../videoPlayerContextSlice';
import productsCatalog from '../products-catalog-action-reducers';

const streamCC = combineReducers({
  ccState,
  configSettings,
  videoPlayerContext: videoPlayerContextReducer,
  productsCatalog,
});

export default streamCC;
