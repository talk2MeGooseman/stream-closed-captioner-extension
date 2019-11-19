import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MenuDivider, MenuItem, faUndo } from '@blueprintjs/core';
import { isVideoOverlay } from '../../../helpers/video-helpers';
import { actionResetCC } from '../../../redux/config-settings-action-reducer';

function ResetButton({ onResetPosition }) {
  if (!isVideoOverlay()) {
    return null;
  }

  return (
    <React.Fragment>
      <MenuDivider />
      <MenuItem
        onClick={onResetPosition}
        icon={<FontAwesomeIcon icon={faUndo} size="lg" />}
        text="Reset Position"
        shouldDismissPopover={false}
      />
    </React.Fragment>
  );
}

ResetButton.propTypes = {
  onResetPosition: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  onResetPosition: () => dispatch(actionResetCC()),
});

export default connect(
  null,
  mapDispatchToProps,
)(ResetButton);
