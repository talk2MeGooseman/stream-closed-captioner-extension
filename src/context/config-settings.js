/* eslint-disable import/prefer-default-export */
import React from "react";

export const defaultSettings = {
  products: [],
  useBits: () => console.log("Override Me!!!"),
};

export const ConfigSettingsContext = React.createContext(defaultSettings);
