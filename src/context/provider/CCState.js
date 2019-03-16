import React from "react";
import { CCStateContext } from "../cc-state";

export const withCCState = Component => props => (
  <CCStateContext .Consumer>
    {(context) => <Component {...props} ccState={context} />}
  </CCStateContext .Consumer>
);
