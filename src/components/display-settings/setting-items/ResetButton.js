import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MenuDivider, MenuItem, faUndo } from '@blueprintjs/core';
import { isVideoOverlay } from '@/helpers/video-helpers';
import { resetCCText } from '@/redux/settingsSlice';
import { useReduxCallbackDispatch } from '../../../redux/redux-helpers';

function ResetButton() {
  const onResetPosition = useReduxCallbackDispatch(resetCCText());

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

ResetButton.propTypes = {};

export default ResetButton;
