import { combineReducers } from "redux";
import ccState from "../cc-state";
import configSettings from "../config-settings-action-reducer";
import videoPlayerContext from "../twitch-player-action-reducers";
import productsCatalog from "../products-catalog-action-reducers";

const streamCC = combineReducers({
  ccState,
  configSettings,
  videoPlayerContext,
  productsCatalog,
});

export default streamCC;
