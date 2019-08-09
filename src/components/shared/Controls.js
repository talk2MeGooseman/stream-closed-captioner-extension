import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog, faUndo, faExpand, faMinus, faCommentDollar,
} from "@fortawesome/free-solid-svg-icons";
import { Popover, Tooltip } from "@blueprintjs/core";
import classnames from "classnames";

import VisibilityToggle from "../VideoOverlay/VisibilityToggle";
import MenuSettings from "./MenuSettings";
import { isVideoOverlay } from "../../helpers/video-helpers";

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
  });

  const menu = (
    <MenuSettings />
  );

  const displayBitsMenu = () => {
    configSettings.useBits(123);
  };

  return (
    <span className={controlClass}>
      <FontAwesomeIcon size="2x" icon={faCommentDollar} onClick={displayBitsMenu} />
      {renderVisToggleSettings(configSettings.hideCC)}
      <Popover position="left-bottom" content={menu}>
        <FontAwesomeIcon size="2x" icon={faCog} />
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
