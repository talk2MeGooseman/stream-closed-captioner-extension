import React from "react";
import ReactDOM from "react-dom";
import {withTwitchData} from "./components/App/TwitchWrapper";
import Overlay from "./components/App/Overlay";

let Component = withTwitchData(Overlay);

ReactDOM.render(
  <Component />,
  document.getElementById("root"),
);
