import React from "react";
import ReactDOM from "react-dom";
import {withTwitchData} from "./components/App/TwitchWrapper";
import MobilePanel from "./components/App/MobilePanel";

let Component = withTwitchData(MobilePanel);

ReactDOM.render(
  <Component />,
  document.getElementById("root"),
);
