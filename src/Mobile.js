import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import {withTwitchData} from "./components/shared/TwitchWrapper";
import MobilePanel from "./components/Mobile/MobilePanel";
import streamCCApp from "./redux/reducers";
import "./App.css";

const store = createStore(streamCCApp);
let Component = withTwitchData(MobilePanel, store);

ReactDOM.render(
  <Provider store={store}>
    <Component />
  </Provider>,
  document.getElementById("root"),
);
