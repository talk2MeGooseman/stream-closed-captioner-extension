import React from "react";
import { ConfigSettingsContext } from "../config-settings";

export const withConfigSettings = (Component) => (props) => (
    <ConfigSettingsContext.Consumer>
      {(context) => {
        return <Component {...props} configSettings={context} />;
      }}
    </ConfigSettingsContext.Consumer>
);
