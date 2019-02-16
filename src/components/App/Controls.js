import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faUndo } from "@fortawesome/free-solid-svg-icons";
import { withTwitchPlayerContext } from "../../context/provider/TwitchPlayer";
import { Button, Menu, MenuDivider, MenuItem, Popover, Position } from "@blueprintjs/core";

const Controls = ({ playerContext, onReset }) => {
    if (!playerContext.arePlayerControlsVisible) {
        return null;
    }

    const exampleMenu = (
        <Menu>
            <MenuItem onClick={onReset} icon={ <FontAwesomeIcon icon={faUndo} size="lg" /> } text="Reset Position" />
        </Menu>
    );

    return (
        <span className="controls-button">
            <Popover content={exampleMenu} >
                <FontAwesomeIcon size="2x" icon={faCog} />
            </Popover>
        </span>
    );
};

Controls.propTypes = {
    onReset: PropTypes.func.isRequired,
    playerContext: PropTypes.object.isRequired,
};

export default withTwitchPlayerContext(Controls);