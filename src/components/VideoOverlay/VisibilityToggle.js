import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClosedCaptioning, faBan } from "@fortawesome/free-solid-svg-icons";
import { toggleCCVisibility } from "../../redux/config-settings-action-reducer";

const VisibilityToggle = ({ videoPlayerContext, configSettings, toggleVisibility }) => {
  let ccDisabledElement = null;

  if (!videoPlayerContext.arePlayerControlsVisible) {
    return null;
  }

  if (configSettings.hideCC) {
    ccDisabledElement = <FontAwesomeIcon icon={faBan} color="red" className="fa-stack-1x" />;
  }

  return (
    <span onClick={toggleVisibility} className="fa-layers fa-fw fa-2x cc-visibility-toggle">
      <FontAwesomeIcon icon={faClosedCaptioning} />
      {ccDisabledElement}
    </span>
  );
};

VisibilityToggle.propTypes = {
  videoPlayerContext: PropTypes.object,
  configSettings: PropTypes.object,
  toggleVisibility: PropTypes.func,
};

const mapStateToProps = state => ({
  videoPlayerContext: state.videoPlayerContext,
  configSettings: state.configSettings,
});

const mapDispatchToProps = dispatch => ({
  toggleVisibility: () => dispatch(toggleCCVisibility()),
});

export default connect(mapStateToProps, mapDispatchToProps)(VisibilityToggle);
