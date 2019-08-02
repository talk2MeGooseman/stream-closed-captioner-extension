import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog, faUndo, faExpand, faMinus, faCommentDollar,
} from "@fortawesome/free-solid-svg-icons";
import { Popover, Tooltip } from "@blueprintjs/core";
import classnames from "classnames";

import VisibilityToggle from "../VideoOverlay/VisibilityToggle";
import MenuSettings from "../VideoOverlay/MenuSettings";
import { withTwitchPlayerContext } from "../../context/provider/TwitchPlayer";
import { withConfigSettings } from "../../context/provider/ConfigSettings";
import { isVideoOverlay } from "../../helpers/video-helpers";

function isPositionLeft(configSettings) {
  return isVideoOverlay() && configSettings.switchSettingsPosition;
}

function renderVisToggleSettings(hideCC, toggleCCVisibility) {
  if (!isVideoOverlay()) {
    return null;
  }

  const state = hideCC ? "Show" : "Hide";

  return (
    <Tooltip content={`${state} CC Text`}>
      <VisibilityToggle isCCDisabled={hideCC} onClick={toggleCCVisibility} />
    </Tooltip>
  );
}

const Controls = ({
  onReset,
  onSelectTextSize,
  onSelectBoxSize,
  isBoxSize,
  isCCDisabled,
  toggleCCVisibility,
  playerContext,
  configSettings,
}) => {
  if (isVideoOverlay() && !playerContext.arePlayerControlsVisible) {
    return null;
  }

  const controlClass = classnames({
    "controls-container": isVideoOverlay(),
    "position-right": !isPositionLeft(configSettings),
    "position-left": isPositionLeft(configSettings),
    "mobile-controls-button": !isVideoOverlay(),
  });

  const menu = (
    <MenuSettings
      onReset={onReset}
      onSelectTextSize={onSelectTextSize}
      onSelectBoxSize={onSelectBoxSize}
      isBoxSize={isBoxSize}
    />
  );

  const displayBitsMenu = () => {
    configSettings.useBits(123);
  }

  return (
    <span className={controlClass}>
      <FontAwesomeIcon size="2x" icon={faCommentDollar} onClick={displayBitsMenu} />
      {renderVisToggleSettings(isCCDisabled, toggleCCVisibility)}
      <Popover position="left-bottom" content={menu}>
        <FontAwesomeIcon size="2x" icon={faCog} />
      </Popover>
    </span>
  );
};

Controls.propTypes = {
  onReset: PropTypes.func,
  onSelectTextSize: PropTypes.func.isRequired,
  onSelectBoxSize: PropTypes.func,
  isBoxSize: PropTypes.bool,
  isCCDisabled: PropTypes.boolean,
  toggleCCVisibility: PropTypes.func,
  configSettings: PropTypes.object,
  playerContext: PropTypes.object.isRequired,
};

export default withTwitchPlayerContext(withConfigSettings(Controls));
