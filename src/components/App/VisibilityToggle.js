import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClosedCaptioning, faBan } from "@fortawesome/free-solid-svg-icons";
import { withTwitchPlayerContext } from "../../context/provider/TwitchPlayer";

const VisibilityToggle = (props) => {
    let ccDisabledElement = null;

    if (!props.playerContext.arePlayerControlsVisible) {
        return null;
    }

    if (props.isCCDisabled) {
        ccDisabledElement = <FontAwesomeIcon icon={faBan} color="red" className="fa-stack-1x" />;
    }

    return (
        <span onClick={props.onClick} className="fa-layers fa-fw fa-2x cc-visibility-toggle">
            <FontAwesomeIcon icon={faClosedCaptioning} />
            {ccDisabledElement}
        </span>
    );
};

VisibilityToggle.propTypes = {
    onClick: PropTypes.func,
    isCCDisabled: PropTypes.bool,
    playerContext: PropTypes.object,
};

export default withTwitchPlayerContext(VisibilityToggle);
