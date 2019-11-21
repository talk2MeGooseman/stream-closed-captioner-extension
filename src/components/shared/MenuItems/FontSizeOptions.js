import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFont } from '@fortawesome/free-solid-svg-icons';
import { MenuItem } from '@blueprintjs/core';
import { changeTextSize } from '@/redux/settingsSlice';
import { useCallbackDispatch } from '@/redux/redux-helpers';

function FontSizeOptions() {
  const onClickSmallTextSize = useCallbackDispatch(changeTextSize('small'));
  const onClickMediumTextSize = useCallbackDispatch(changeTextSize('medium'));
  const onClickLargeTextSize = useCallbackDispatch(changeTextSize('large'));

  const fontIcon = <FontAwesomeIcon icon={faFont} />;

  return (
    <React.Fragment>
      <MenuItem
        icon={fontIcon}
        text="Small Text"
        onClick={onClickSmallTextSize}
        shouldDismissPopover={false}
      />
      <MenuItem
        icon={fontIcon}
        text="Medium Text"
        onClick={onClickMediumTextSize}
        shouldDismissPopover={false}
      />
      <MenuItem
        icon={fontIcon}
        text="Large Text"
        onClick={onClickLargeTextSize}
        shouldDismissPopover={false}
      />
    </React.Fragment>
  );
}

FontSizeOptions.propTypes = {};

export default FontSizeOptions;
