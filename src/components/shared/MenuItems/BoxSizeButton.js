import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faMinus } from "@fortawesome/free-solid-svg-icons";
import { MenuDivider, MenuItem } from "@blueprintjs/core";
import { isVideoOverlay } from "../../../helpers/video-helpers";
import { toggleBoxSize } from "../../../redux/config-settings-action-reducer";
import { useShallowEqualSelector, useCallbackDispatch } from "../../../redux/redux-helpers";

function BoxSizeButton() {
  const ccBoxSize = useShallowEqualSelector(state => state.configSettings.ccBoxSize);
  const onToggleBoxSize = useCallbackDispatch(toggleBoxSize());

  if (!isVideoOverlay()) {
    return null;
  }

  let text = "Enable Square Text Box";
  let icon = faExpand;

  if (ccBoxSize) {
    text = "Enable Horizontal Text Box";
    icon = faMinus;
  }

  return (
    <React.Fragment>
      <MenuDivider />
      <MenuItem
        onClick={onToggleBoxSize}
        icon={<FontAwesomeIcon icon={icon} size="lg" />}
        text={text}
        shouldDismissPopover={false}
      />
    </React.Fragment>
  );
}

BoxSizeButton.propTypes = {};

export default BoxSizeButton;
