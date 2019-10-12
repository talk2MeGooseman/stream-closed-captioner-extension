import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFont } from "@fortawesome/free-solid-svg-icons";
import { MenuItem } from "@blueprintjs/core";
import { actionChangeTextSize } from "../../../redux/config-settings-action-reducer";
import { useCallbackDispatch } from "../../../redux/redux-helpers";

function FontSizeOptions() {
  const onClickSmallTextSize = useCallbackDispatch(actionChangeTextSize("small"));
  const onClickMediumTextSize = useCallbackDispatch(actionChangeTextSize("medium"));
  const onClickLargeTextSize = useCallbackDispatch(actionChangeTextSize("large"));

  const fontIcon = <FontAwesomeIcon icon={faFont} />;

  return (
    <React.Fragment>
      <MenuItem
        icon={fontIcon}
        text="Small Text"
        onClick={onClickSmallTextSize}
      />
      <MenuItem
        icon={fontIcon}
        text="Medium Text"
        onClick={onClickMediumTextSize}
      />
      <MenuItem
        icon={fontIcon}
        text="Large Text"
        onClick={onClickLargeTextSize}
      />
    </React.Fragment>
  );
}

FontSizeOptions.propTypes = {};

export default FontSizeOptions;
