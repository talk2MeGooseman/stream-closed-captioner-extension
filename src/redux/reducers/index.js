import { combineReducers } from "redux";
import ccState from "../cc-state";
import broadcasterSettings from "../broadcaster-settings";
import videoPlayerContext from "../twitch-player-action-reducers";

const streamCC = combineReducers({
  ccState,
  broadcasterSettings,
  videoPlayerContext,
});

export default streamCC;
