import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faUndo, faFont, faExpand, faMinus } from "@fortawesome/free-solid-svg-icons";
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

function renderBoxSizeButton(onClick, isViewerBoxSize) {
  if (!isVideoOverlay()) {
    return null;
  }

  let text = "Enable Square Text Box";
  let icon = faExpand;
  if (isViewerBoxSize) {
    text = "Enable Horizontal Text Box";
    icon = faMinus;
  }

  return (
    <React.Fragment>
      <MenuDivider />
      <MenuItem onClick={onClick} icon={ <FontAwesomeIcon icon={icon} size="lg" /> } text={text} />
    </React.Fragment>
  );
}

const Controls = ({
  playerContext, onReset, onSelectTextSize,
  onSelectBoxSize, isViewerBoxSize,
}) => {
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
      { renderBoxSizeButton(onSelectBoxSize, isViewerBoxSize) }
    </Menu>
  );

  return (
    <span className={controlClass}>
      <Popover position="left-bottom" content={menu}>
        <FontAwesomeIcon size="2x" icon={faCog} />
      </Popover>
    </span>
  );
};

Controls.propTypes = {
  onReset: PropTypes.func,
  playerContext: PropTypes.object.isRequired,
  onSelectTextSize: PropTypes.func.isRequired,
  onSelectBoxSize: PropTypes.func,
  isViewerBoxSize: PropTypes.bool,
};

export default withTwitchPlayerContext(Controls);
