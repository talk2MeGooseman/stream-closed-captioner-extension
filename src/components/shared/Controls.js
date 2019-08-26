import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog, faLanguage,
} from "@fortawesome/free-solid-svg-icons";
import { Popover, Tooltip, Menu } from "@blueprintjs/core";
import classnames from "classnames";

import VisibilityToggle from "../VideoOverlay/VisibilityToggle";
import MenuSettings from "./MenuSettings";
import { isVideoOverlay } from "../../helpers/video-helpers";
import LanguageOptions from "./MenuItems/LanguageOptions";

function isPositionLeft(configSettings) {
  return isVideoOverlay() && configSettings.switchSettingsPosition;
}

const Controls = ({
  videoPlayerContext,
  configSettings,
}) => {
  if (isVideoOverlay() && !videoPlayerContext.arePlayerControlsVisible) {
    return null;
  }

  const controlClass = classnames({
    "controls-container": isVideoOverlay(),
    "position-right": !isPositionLeft(configSettings),
    "position-left": isPositionLeft(configSettings),
    "mobile-controls-button": !isVideoOverlay(),
    "bg-black-transparent": true,
  });

  return (
    <span className={controlClass}>
      <LanguageOptions />
      {renderVisToggleSettings(configSettings.hideCC)}
      <Popover position="left-bottom" content={<MenuSettings />}>
        <Tooltip content={'Settings'}>
          <FontAwesomeIcon size="2x" icon={faCog} />
        </Tooltip>
      </Popover>
    </span>
  );
};

function renderVisToggleSettings(hideCC) {
  if (!isVideoOverlay()) {
    return null;
  }

  const state = hideCC ? "Show" : "Hide";

  return (
    <Tooltip content={`${state} CC Text`}>
      <VisibilityToggle />
    </Tooltip>
  );
}

Controls.propTypes = {
  configSettings: PropTypes.object,
  videoPlayerContext: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  configSettings: state.configSettings,
  videoPlayerContext: state.videoPlayerContext,
});

export default connect(mapStateToProps)(Controls);
