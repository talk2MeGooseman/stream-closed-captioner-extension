/* eslint-disable no-use-before-define */
import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFont, faExpand, faMinus } from "@fortawesome/free-solid-svg-icons";
import {
  Menu, MenuDivider, MenuItem, faUndo,
} from "@blueprintjs/core";
import { isVideoOverlay } from "../../helpers/video-helpers";

const MenuSettings = ({
  onReset, onSelectTextSize, onSelectBoxSize, isBoxSize,
}) => (
  <Menu>
    <MenuItem
      icon={<FontAwesomeIcon icon={faFont} />}
      text="Small Text"
      onClick={() => {
        onSelectTextSize("small");
      }}
    />
    <MenuItem
      icon={<FontAwesomeIcon icon={faFont} />}
      text="Medium Text"
      onClick={() => {
        onSelectTextSize("medium");
      }}
    />
    <MenuItem
      icon={<FontAwesomeIcon icon={faFont} />}
      text="Large Text"
      onClick={() => {
        onSelectTextSize("large");
      }}
    />
    {renderResetButton(onReset)}
    {renderBoxSizeButton(onSelectBoxSize, isBoxSize)}
  </Menu>
);

function renderResetButton(onReset) {
  if (!isVideoOverlay()) {
    return null;
  }

  return (
    <React.Fragment>
      <MenuDivider />
      <MenuItem
        onClick={onReset}
        icon={<FontAwesomeIcon icon={faUndo} size="lg" />}
        text="Reset Position"
      />
    </React.Fragment>
  );
}

function renderBoxSizeButton(onClick, isBoxSize) {
  if (!isVideoOverlay()) {
    return null;
  }

  let text = "Enable Square Text Box";
  let icon = faExpand;
  if (isBoxSize) {
    text = "Enable Horizontal Text Box";
    icon = faMinus;
  }

  return (
    <React.Fragment>
      <MenuDivider />
      <MenuItem onClick={onClick} icon={<FontAwesomeIcon icon={icon} size="lg" />} text={text} />
    </React.Fragment>
  );
}

MenuSettings.propTypes = {
  onReset: PropTypes.func,
  onSelectTextSize: PropTypes.func.isRequired,
  onSelectBoxSize: PropTypes.func,
  isBoxSize: PropTypes.bool,
};

export default MenuSettings;
