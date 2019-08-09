/* eslint-disable no-use-before-define */
import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFont, faExpand, faMinus } from "@fortawesome/free-solid-svg-icons";
import {
  Menu, MenuDivider, MenuItem, faUndo,
} from "@blueprintjs/core";
import { isVideoOverlay } from "../../helpers/video-helpers";
import { actionToggleBoxSize } from "../../redux/config-settings-action-reducer";

const MenuSettings = ({
  onReset, onSelectTextSize, toggleBoxSize, ccState, configSettings,
}) => (
  <Menu>
    {renderDisplayLanguageOptions(ccState)}
    <MenuItem
      icon={<FontAwesomeIcon icon={faFont} />}
      text="Small Text"
      onClick={() => {
        onSelectTextSize("small");
      }}
    />
    <MenuItem
      icon={<FontAwesomeIcon icon={faFont} />}
      text="Medium Text"
      onClick={() => {
        onSelectTextSize("medium");
      }}
    />
    <MenuItem
      icon={<FontAwesomeIcon icon={faFont} />}
      text="Large Text"
      onClick={() => {
        onSelectTextSize("large");
      }}
    />
    {renderResetButton(onReset)}
    {renderBoxSizeButton(toggleBoxSize, configSettings.ccBoxSize)}
  </Menu>
);

function renderDisplayLanguageOptions(ccState) {
  if (!ccState.translations) {
    return null;
  }

  return (
    <React.Fragment>
      <MenuItem text="Display Language" icon="cog">
        <MenuItem shouldDismissPopover={false} icon="none" text="English" onClick={() => window.Twitch.ext.rig.log("Clicked") } />
        <MenuItem shouldDismissPopover={false} icon="none" text="Spanish" onClick={() => window.Twitch.ext.rig.log("Clicked") } />
        <MenuItem shouldDismissPopover={false} icon="blank" text="Korean" onClick={() => window.Twitch.ext.rig.log("Clicked") } />
      </MenuItem>
      <MenuDivider />
    </React.Fragment>
  );
}

function renderResetButton(onReset) {
  if (!isVideoOverlay()) {
    return null;
  }

  return (
    <React.Fragment>
      <MenuDivider />
      <MenuItem
        onClick={onReset}
        icon={<FontAwesomeIcon icon={faUndo} size="lg" />}
        text="Reset Position"
      />
    </React.Fragment>
  );
}

function renderBoxSizeButton(onClick, isBoxSize) {
  if (!isVideoOverlay()) {
    return null;
  }

  let text = "Enable Square Text Box";
  let icon = faExpand;
  if (isBoxSize) {
    text = "Enable Horizontal Text Box";
    icon = faMinus;
  }

  return (
    <React.Fragment>
      <MenuDivider />
      <MenuItem onClick={onClick} icon={<FontAwesomeIcon icon={icon} size="lg" />} text={text} />
    </React.Fragment>
  );
}

MenuSettings.propTypes = {
  onReset: PropTypes.func,
  onSelectTextSize: PropTypes.func.isRequired,
  toggleBoxSize: PropTypes.func,
  ccState: PropTypes.object,
  configSettings: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  ccState: state.ccState,
  configSettings: state.configSettings,
  ...ownProps,
});

const mapDispatchToProps = dispatch => ({
  toggleBoxSize: () => dispatch(actionToggleBoxSize()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuSettings);
