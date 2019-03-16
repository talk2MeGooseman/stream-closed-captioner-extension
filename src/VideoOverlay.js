import React from "react";
import ReactDOM from "react-dom";
import {withTwitchData} from "./components/shared/TwitchWrapper";
import Overlay from "./components/VideoOverlay/Overlay";
import "./App.css";

let Component = withTwitchData(Overlay);

ReactDOM.render(
  <Component />,
  document.getElementById("root"),
);
