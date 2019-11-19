import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { MenuItem } from '@blueprintjs/core';
import {
  increaseLineCount,
  decreaseLineCount,
} from '../../../redux/config-settings-action-reducer';
import { useShallowEqualSelector, useCallbackDispatch } from '../../../redux/redux-helpers';
import { isVideoOverlay } from '../../../helpers/video-helpers';

function LineCountOptions() {
  const ccBoxSize = useShallowEqualSelector(state => state.configSettings.ccBoxSize);
  const horizontalLineCount = useShallowEqualSelector(
    state => state.configSettings.horizontalLineCount,
  );
  const boxLineCount = useShallowEqualSelector(state => state.configSettings.boxLineCount);
  const onLineIncrease = useCallbackDispatch(increaseLineCount());
  const onLineDecrease = useCallbackDispatch(decreaseLineCount());

  if (!isVideoOverlay()) return null;

  let disableDecrease = false;

  if (ccBoxSize && boxLineCount === 1) {
    disableDecrease = true;
  } else if (horizontalLineCount === 1) {
    disableDecrease = true;
  }

  return (
    <MenuItem text="Line Count">
      <MenuItem
        icon={<FontAwesomeIcon icon={faPlus} />}
        text="Increase Line Count"
        onClick={onLineIncrease}
        shouldDismissPopover={false}
      />
      <MenuItem
        icon={<FontAwesomeIcon icon={faMinus} />}
        text="Decrease Line Count"
        onClick={onLineDecrease}
        disabled={disableDecrease}
        shouldDismissPopover={false}
      />
    </MenuItem>
  );
}

export default LineCountOptions;
