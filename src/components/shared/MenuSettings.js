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
import { actionToggleBoxSize, actionChangeTextSize, actionResetCC } from "../../redux/config-settings-action-reducer";

const MenuSettings = ({
  resetCC, changeTextSize, toggleBoxSize, ccState, configSettings,
}) => (
  <Menu>
    {renderDisplayLanguageOptions(ccState)}
    <MenuItem
      icon={<FontAwesomeIcon icon={faFont} />}
      text="Small Text"
      onClick={() => {
        changeTextSize("small");
      }}
    />
    <MenuItem
      icon={<FontAwesomeIcon icon={faFont} />}
      text="Medium Text"
      onClick={() => {
        changeTextSize("medium");
      }}
    />
    <MenuItem
      icon={<FontAwesomeIcon icon={faFont} />}
      text="Large Text"
      onClick={() => {
        changeTextSize("large");
      }}
    />
    {renderResetButton(resetCC)}
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

function renderResetButton(resetCC) {
  if (!isVideoOverlay()) {
    return null;
  }

  return (
    <React.Fragment>
      <MenuDivider />
      <MenuItem
        onClick={resetCC}
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
  resetCC: PropTypes.func,
  changeTextSize: PropTypes.func.isRequired,
  toggleBoxSize: PropTypes.func,
  ccState: PropTypes.object,
  configSettings: PropTypes.object,
};

const mapStateToProps = state => ({
  ccState: state.ccState,
  configSettings: state.configSettings,
});

const mapDispatchToProps = dispatch => ({
  toggleBoxSize: () => dispatch(actionToggleBoxSize()),
  changeTextSize: size => dispatch(actionChangeTextSize(size)),
  resetCC: () => dispatch(actionResetCC()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuSettings);
