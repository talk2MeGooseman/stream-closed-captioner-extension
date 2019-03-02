import React from "react";
import { ConfigSettingsContext } from "../config-settings";

export const withConfigSettings = (Component) => {
  return (props) => (
    <ConfigSettingsContext.Consumer>
      {(context) => {
        return <Component {...props} configSettings={context} />;
      }}
    </ConfigSettingsContext.Consumer>
  );
};

