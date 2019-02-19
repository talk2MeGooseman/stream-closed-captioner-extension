import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faUndo, faFont } from "@fortawesome/free-solid-svg-icons";
import { withTwitchPlayerContext } from "../../context/provider/TwitchPlayer";
import { Button, Menu, MenuDivider, MenuItem, Popover, PopoverInteractionKind } from "@blueprintjs/core";

const Controls = ({ playerContext, onReset, onSelectTextSize }) => {
  if (!playerContext.arePlayerControlsVisible) {
    return null;
  }

  const exampleMenu = (
    <Menu>
      <MenuItem icon={ <FontAwesomeIcon icon={faFont} />} text="Small Text" onClick={() => {onSelectTextSize("small");}} />
      <MenuItem icon={ <FontAwesomeIcon icon={faFont} />} text="Medium Text" onClick={() => {onSelectTextSize("medium");}} />
      <MenuItem icon={ <FontAwesomeIcon icon={faFont} />} text="Large Text" onClick={() => {onSelectTextSize("large");}} />
      <MenuItem onClick={onReset} icon={ <FontAwesomeIcon icon={faUndo} size="lg" /> } text="Reset Position" />
    </Menu>
  );

  return (
    <span className="controls-button">
      <Popover content={exampleMenu}>
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