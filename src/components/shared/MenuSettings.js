/* eslint-disable no-use-before-define */
import React from "react";
import {
  Menu,
} from "@blueprintjs/core";
import FontSizeOptions from "./MenuItems/FontSizeOptions";
import ResetButton from "./MenuItems/ResetButton";
import BoxSizeButton from "./MenuItems/BoxSizeButton";
import LineCountOptions from "./MenuItems/LineCountOptions";

const MenuSettings = () => (
  <Menu>
    <FontSizeOptions />
    <LineCountOptions />
    <ResetButton />
    <BoxSizeButton />
  </Menu>
);

MenuSettings.propTypes = {};

export default MenuSettings;
