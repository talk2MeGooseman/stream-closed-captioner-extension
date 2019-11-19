import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import { Popover, Tooltip } from "@blueprintjs/core";
import classnames from "classnames";

import VisibilityToggle from "../VideoOverlay/VisibilityToggle";
import MenuSettings from "./MenuSettings";
import { isVideoOverlay } from "../../helpers/video-helpers";
import LanguageSettings from "./LanguageSettings";

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
      <LanguageSettings />
      <VisibilityToggle />
      <Popover position="left-bottom" content={<MenuSettings />} captureDismiss >
        <Tooltip content={"Settings"}>
          <FontAwesomeIcon size="2x" icon={faCog} />
        </Tooltip>
      </Popover>
    </span>
  );
};

Controls.propTypes = {
  configSettings: PropTypes.object,
  videoPlayerContext: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  configSettings: state.configSettings,
  videoPlayerContext: state.videoPlayerContext,
});

export default connect(mapStateToProps)(Controls);
