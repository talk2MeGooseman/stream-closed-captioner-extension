import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClosedCaptioning, faBan } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '@blueprintjs/core';
import { isVideoOverlay } from '../../helpers/video-helpers';
import { toggleCCVisibility } from '../../redux/config-settings-action-reducer';

const VisibilityToggle = ({ videoPlayerContext, configSettings, toggleVisibility }) => {
  let ccDisabledElement = null;
  let buttonCTA = 'Hide';

  if (!isVideoOverlay() || !videoPlayerContext.arePlayerControlsVisible) {
    return null;
  }

  if (configSettings.hideCC) {
    ccDisabledElement = <FontAwesomeIcon icon={faBan} color="red" className="fa-stack-1x" />;
    buttonCTA = 'Show';
  }

  return (
    <Tooltip content={`${buttonCTA} CC Text`}>
      <span onClick={toggleVisibility} className="fa-layers fa-fw fa-2x cc-visibility-toggle">
        <FontAwesomeIcon icon={faClosedCaptioning} />
        {ccDisabledElement}
      </span>
    </Tooltip>
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
