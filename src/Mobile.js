import React from "react";
import ReactDOM from "react-dom";
import {withTwitchData} from "./components/shared/TwitchWrapper";
import MobilePanel from "./components/Mobile/MobilePanel";
import "./App.css";

let Component = withTwitchData(MobilePanel);

ReactDOM.render(
  <Component />,
  document.getElementById("root"),
);
