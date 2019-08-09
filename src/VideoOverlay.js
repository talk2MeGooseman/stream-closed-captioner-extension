import React from "react";
import ReactDOM from "react-dom";
import Overlay from "./components/VideoOverlay/Overlay";
import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import logger from 'redux-logger';
import {withTwitchData} from "./components/shared/TwitchWrapper";
import streamCCApp from "./redux/reducers";
import "./App.css";

const store = createStore(streamCCApp, applyMiddleware(logger));
const Component = withTwitchData(Overlay, store);

ReactDOM.render(
  <Provider store={store}>
    <Component />
  </Provider>,
  document.getElementById("root"),
);
