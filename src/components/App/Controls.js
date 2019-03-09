import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faUndo, faFont } from "@fortawesome/free-solid-svg-icons";
import {
  Menu, MenuDivider, MenuItem, Popover,
} from "@blueprintjs/core";
import classnames from "classnames";
import { withTwitchPlayerContext } from "../../context/provider/TwitchPlayer";
import "url-search-params-polyfill";


function isVideoOverlay() {
  const search = new URLSearchParams(window.location.search);
  const platform = search.get("platform");
  const anchor = search.get("anchor");

  return anchor === "video_overlay" && platform === "web";
}

function renderResetButton(onReset) {
  if (!isVideoOverlay()) {
    return null;
  }

  return (
    <React.Fragment>
      <MenuDivider />
      <MenuItem onClick={onReset} icon={ <FontAwesomeIcon icon={faUndo} size="lg" /> } text="Reset Position" />
    </React.Fragment>
  );
}

const Controls = ({ playerContext, onReset, onSelectTextSize }) => {
  if (isVideoOverlay() && !playerContext.arePlayerControlsVisible) {
    return null;
  }

  const controlClass = classnames({
    "controls-button": isVideoOverlay(),
    "mobile-controls-button": !isVideoOverlay(),
  });

  const menu = (
    <Menu>
      <MenuItem icon={ <FontAwesomeIcon icon={faFont} />} text="Small Text" onClick={() => { onSelectTextSize("small"); }} />
      <MenuItem icon={ <FontAwesomeIcon icon={faFont} />} text="Medium Text" onClick={() => { onSelectTextSize("medium"); }} />
      <MenuItem icon={ <FontAwesomeIcon icon={faFont} />} text="Large Text" onClick={() => { onSelectTextSize("large"); }} />
      { renderResetButton(onReset) }
    </Menu>
  );

  return (
    <span className={controlClass}>
      <Popover content={menu}>
        <FontAwesomeIcon size="2x" icon={faCog} />
      </Popover>
    </span>
  );
};

Controls.propTypes = {
  onReset: PropTypes.func.isRequired,
  playerContext: PropTypes.object.isRequired,
  onSelectTextSize: PropTypes.func.isRequired,
};

export default withTwitchPlayerContext(Controls);
