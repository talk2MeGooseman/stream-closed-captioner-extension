/* eslint-disable import/prefer-default-export */
import React from "react";
import { ConfigSettingsContext } from "../config-settings";

export const withConfigSettings = Component => props => (
  <ConfigSettingsContext.Consumer>
    {context => <Component {...props} configSettings={context} />}
  </ConfigSettingsContext.Consumer>
);
